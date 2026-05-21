const DEFAULT_MIN_DESCRIPTION_LENGTH = 140
const DEFAULT_MAX_DESCRIPTION_LENGTH = 160

function cleanDescription(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function trimDescription(value: string, minLength: number, maxLength: number) {
  if (value.length <= maxLength) return value

  const slice = value.slice(0, maxLength - 1)
  const wordBoundary = slice.lastIndexOf(" ")
  const trimmed =
    wordBoundary >= minLength ? slice.slice(0, wordBoundary) : slice

  return `${trimmed.replace(/[\s,;:.-]+$/, "")}.`
}

export function normalizeMetaDescription(
  description: string,
  extension: string | string[],
  {
    minLength = DEFAULT_MIN_DESCRIPTION_LENGTH,
    maxLength = DEFAULT_MAX_DESCRIPTION_LENGTH,
  } = {}
) {
  const base = cleanDescription(description)
  if (base.length >= minLength && base.length <= maxLength) return base

  const extensions = Array.isArray(extension) ? extension : [extension]
  let expanded = base
  for (const item of extensions) {
    if (expanded.length >= minLength) break
    expanded = cleanDescription(`${expanded} ${item}`)
  }

  return trimDescription(expanded, minLength, maxLength)
}
