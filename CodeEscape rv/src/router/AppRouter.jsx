import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { RouteTransition } from '../components/transitions/RouteTransition'
import { useEscapeStore } from '../store/useEscapeStore'
import { routes } from './routes'

function RequireLanguage({ children }) {
  const selectedLanguage = useEscapeStore((state) => state.selectedLanguage)

  if (!selectedLanguage) {
    return <Navigate to="/language-select" replace />
  }

  return children
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routes.map(({ path, element: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <RouteTransition>
                {path === '/mission-hub' || path === '/levels/:levelId' ? (
                  <RequireLanguage>
                    <Component />
                  </RequireLanguage>
                ) : (
                  <Component />
                )}
              </RouteTransition>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
