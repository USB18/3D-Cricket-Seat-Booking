import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '@/store'
import { ROUTES } from './routes'

/** Routes inside this wrapper need a signed-in user; others are sent to the login page and back. */
export default function RequireAuth() {
  const userId = useStore((state) => state.userId)
  const location = useLocation()

  if (!userId) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
