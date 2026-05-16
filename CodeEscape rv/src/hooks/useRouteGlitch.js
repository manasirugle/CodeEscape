import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export const useRouteGlitch = () => {
  const location = useLocation()

  return useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: `${location.pathname}-${index}`,
        top: Math.random() * 100,
        height: 1 + Math.random() * 7,
        delay: Math.random() * 0.18,
        duration: 0.08 + Math.random() * 0.12,
        color: Math.random() > 0.45 ? '#00ff88' : '#00d4ff',
      })),
    [location.pathname],
  )
}
