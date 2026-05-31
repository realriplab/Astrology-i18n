import { createIndex } from "pagefind"
import sirv from "sirv"
import { readFile, readdir, rm } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import type { AstroIntegration } from "astro"

const SEARCHABLE_PAGE_PATTERN =
  /^(en|zh|fr|es|ru|ja|ko|pt|de|id|ar)\/(?:about|posts\/(?!\d+\/)[^/]+)\/index\.html$/

type PagefindOptions = {
  indexConfig?: Parameters<typeof createIndex>[0]
}

const toPosixPath = (value: string) => value.split(path.sep).join("/")

const collectHtmlFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath)
    }
  }

  return files
}

export default function pagefind({
  indexConfig,
}: PagefindOptions = {}): AstroIntegration {
  let clientDir: string | undefined

  return {
    name: "polyglow-pagefind",
    hooks: {
      "astro:config:setup": ({ config, logger }) => {
        if (config.output === "server") {
          logger.warn(
            "Pagefind requires static HTML output and will not index server output."
          )
        }
        if (config.adapter) {
          clientDir = fileURLToPath(config.build.client)
        }
      },
      "astro:server:setup": ({ server, logger }) => {
        const root =
          typeof server.config.root === "string"
            ? server.config.root
            : fileURLToPath(server.config.root)
        const outDir = clientDir ?? path.join(root, server.config.build.outDir)
        logger.debug(`Serving pagefind from ${outDir}`)

        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        })

        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/pagefind/")) {
            serve(req, res, next)
          } else {
            next()
          }
        })
      },
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir)
        const outputPath = path.join(outDir, "pagefind")
        await rm(outputPath, { force: true, recursive: true })

        const { index, errors: createErrors } = await createIndex(indexConfig)
        if (!index) {
          logger.error("Pagefind failed to create index")
          createErrors.forEach((error) => logger.error(error))
          return
        }

        const htmlFiles = await collectHtmlFiles(outDir)
        const searchableFiles = htmlFiles.filter((file) => {
          const relativePath = toPosixPath(path.relative(outDir, file))
          return SEARCHABLE_PAGE_PATTERN.test(relativePath)
        })

        for (const file of searchableFiles) {
          const relativePath = toPosixPath(path.relative(outDir, file))
          const content = await readFile(file, "utf8")
          const { errors } = await index.addHTMLFile({
            url: `/${relativePath.replace(/index\.html$/, "")}`,
            content,
          })

          if (errors.length) {
            logger.error(`Pagefind failed to index ${path.relative(outDir, file)}`)
            errors.forEach((error) => logger.error(error))
          }
        }

        logger.info(`Pagefind indexed ${searchableFiles.length} pages`)

        const { outputPath: writtenPath, errors: writeErrors } =
          await index.writeFiles({ outputPath })
        if (writeErrors.length) {
          logger.error("Pagefind failed to write index")
          writeErrors.forEach((error) => logger.error(error))
          return
        }

        logger.info(`Pagefind wrote index to ${writtenPath}`)
      },
    },
  }
}
