type PageInitCallback = () => void

function runCallback(callback: PageInitCallback): void {
  try {
    callback()
  } catch (error) {
    console.error("[page-init] callback failed", error)
  }
}

function runWhenReady(callback: PageInitCallback): void {
  if (document.readyState === "loading") {
    document.addEventListener("astro:page-load", () => runCallback(callback), {
      once: true,
    })
    return
  }

  queueMicrotask(() => runCallback(callback))
}

export function registerPageInit(
  key: string,
  callback: PageInitCallback
): void {
  void key
  runWhenReady(callback)
  document.addEventListener("astro:page-load", () => runCallback(callback))
}
