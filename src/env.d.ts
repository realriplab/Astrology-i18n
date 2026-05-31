/// <reference types="astro/client" />

interface Window {
  adsbygoogle?: unknown[]
  PagefindUI?: new (options: {
    element: string
    bundlePath: string
    showImages: boolean
    showSubResults: boolean
  }) => { destroy?: () => void }
  __polyglowMenuCleanup?: () => void
  __polyglowMobileNavCleanup?: () => void
  __polyglowThemeSwitcherCleanup?: () => void
  __polyglowPagefindSearch?: {
    id: string
    instance: { destroy?: () => void }
    locale: string
  }
  __polyglowPagefindSearchCleanup?: () => void
  __polyglowDynamicGlassCleanup?: () => void
  __polyglowAuthorActivityCleanup?: () => void
}
