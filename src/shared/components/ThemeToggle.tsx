import { useTheme } from '../theme/useTheme'
import './ThemeToggle.css'

interface ThemeToggleProps {
  /** Pin to the top-right corner of the page (used on the login screen). */
  floating?: boolean
}

export default function ThemeToggle({ floating = false }: ThemeToggleProps) {
  const theme = useTheme((state) => state.theme)
  const toggleTheme = useTheme((state) => state.toggleTheme)
  const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`

  return (
    <button
      className={`theme-toggle${floating ? ' theme-toggle--floating' : ''}`}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
