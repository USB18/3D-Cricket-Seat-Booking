import type { ReactNode } from 'react'
import { useStore } from '@/store'
import ThemeToggle from './ThemeToggle'
import './AppHeader.css'

interface AppHeaderProps {
  title: ReactNode
  /** Small text next to the title (hidden on phones). */
  subtitle?: ReactNode
  /** "overlay" floats above the 3D view; "static" sits in the normal page flow. */
  variant?: 'overlay' | 'static'
  /** Extra actions shown before the theme toggle. */
  children?: ReactNode
}

/** Top bar shared by the stadium list and the 3D stadium: title, theme toggle, user and sign-out. */
export default function AppHeader({ title, subtitle, variant = 'static', children }: AppHeaderProps) {
  const displayName = useStore((state) => state.displayName)
  const logout = useStore((state) => state.logout)

  return (
    <header className={`app-header app-header--${variant} glass`}>
      <div className="app-header__title">{title}</div>
      {subtitle && <div className="app-header__subtitle">{subtitle}</div>}

      <div className="app-header__actions">
        {children}
        <ThemeToggle />
        <span className="app-header__user">👤 {displayName}</span>
        <button className="btn-ghost" onClick={logout}>
          Switch user
        </button>
      </div>
    </header>
  )
}
