import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoadingScreen from '@/shared/components/LoadingScreen'
import RequireAuth from './RequireAuth'
import { ROUTES } from './routes'

// Each screen is its own chunk, so the 3D code only downloads when a stadium opens.
const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const StadiumsPage = lazy(() => import('@/features/venues/StadiumsPage'))
const StadiumPage = lazy(() => import('@/features/stadium/StadiumPage'))

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route element={<RequireAuth />}>
          <Route path={ROUTES.stadiums} element={<StadiumsPage />} />
          <Route path={ROUTES.stadiumPattern} element={<StadiumPage />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.stadiums} replace />} />
      </Routes>
    </Suspense>
  )
}
