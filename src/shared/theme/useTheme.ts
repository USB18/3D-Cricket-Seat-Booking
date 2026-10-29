import { create } from 'zustand'
import { persistentStore } from '../lib/storage'
import { SCENE_PALETTES, type ScenePalette } from './palettes'

export type Theme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'theme'
const BROWSER_CHROME_COLOR: Record<Theme, string> = { dark: '#070b14', light: '#e6eef9' }

/** Saved choice first, then the operating-system preference. */
function getInitialTheme(): Theme {
  const saved = persistentStore.getString(THEME_STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

/** Tells the CSS (via `data-theme`) and the browser UI which theme is active. */
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BROWSER_CHROME_COLOR[theme])
}

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark'
    persistentStore.set(THEME_STORAGE_KEY, next)
    applyTheme(next)
    set({ theme: next })
  },
}))

applyTheme(useTheme.getState().theme)

/** Scene colours for the active theme. */
export function useScenePalette(): ScenePalette {
  return SCENE_PALETTES[useTheme((state) => state.theme)]
}
