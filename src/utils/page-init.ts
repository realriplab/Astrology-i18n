type PageInitCallback = () => void

const callbacks = new Map<string, PageInitCallback>()
let listenersBound = false

function runCallback(callback: PageInitCallback): void {
  try {
    callback()
  } catch (error) {
    console.error("[page-init] callback failed", error)
  }
}

function runAllCallbacks(): void {
  callbacks.forEach(runCallback)
}

function runWhenReady(callback: PageInitCallback): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => runCallback(callback), {
      once: true,
    })
    return
  }

  queueMicrotask(() => runCallback(callback))
}

function bindPageInitListeners(): void {
  if (listenersBound) return
  listenersBound = true
  document.addEventListener("astro:page-load", runAllCallbacks)
}

export function registerPageInit(
  key: string,
  callback: PageInitCallback
): void {
  callbacks.set(key, callback)
  bindPageInitListeners()
  runWhenReady(callback)
}
