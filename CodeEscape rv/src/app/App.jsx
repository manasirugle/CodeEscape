import { Suspense } from 'react'

import { AppRouter } from '../router/AppRouter'

export default function App() {
  return (
    <Suspense fallback={null}>
      <AppRouter />
    </Suspense>
  )
}
