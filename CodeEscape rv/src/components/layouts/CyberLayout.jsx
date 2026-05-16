import { Suspense, lazy } from 'react'

import { Scanlines } from '../effects/Scanlines'
import { StatusBar } from './StatusBar'

const CyberScene = lazy(() =>
  import('../three/CyberScene').then((module) => ({
    default: module.CyberScene,
  })),
)

export function CyberLayout({ status, children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-abyss text-neon">
      <Suspense fallback={null}>
        <CyberScene />
      </Suspense>
      <Scanlines />
      <div className="relative z-10 min-h-screen px-6 pb-28 pt-10 sm:px-8 lg:px-12">{children}</div>
      <StatusBar {...status} />
    </div>
  )
}
