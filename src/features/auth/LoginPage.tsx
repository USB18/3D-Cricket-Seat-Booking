import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/routes'
import ThemeToggle from '@/shared/components/ThemeToggle'
import { useStore } from '@/store'
import { sanitizePhoneInput } from './validation'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const redirectTo = (useLocation().state as { from?: string } | null)?.from ?? ROUTES.stadiums

  const userId = useStore((state) => state.userId)
  const login = useStore((state) => state.login)

  const [nameOrEmail, setNameOrEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (userId) return <Navigate to={redirectTo} replace />

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const message = login(nameOrEmail, phone)
    setError(message)
    if (!message) navigate(redirectTo, { replace: true })
  }

  return (
    <div className="login-page">
      <ThemeToggle floating />

      <form className="login-card glass" onSubmit={handleSubmit} noValidate>
        <div className="login-card__logo">🏏</div>
        <h1>Stadium Seat Booking</h1>
        <p>Sign in with your name or email and your phone number. You can book up to 3 seats.</p>

        <label className="field">
          <span>Name or email</span>
          <input
            autoFocus
            autoComplete="name"
            value={nameOrEmail}
            onChange={(event) => setNameOrEmail(event.target.value)}
            placeholder="Enter name or email"
          />
        </label>

        <label className="field">
          <span>Phone number</span>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(sanitizePhoneInput(event.target.value))}
            placeholder="Enter 10-digit phone number"
          />
        </label>

        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="login-card__submit">
          Continue →
        </button>
      </form>
    </div>
  )
}
