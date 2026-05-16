import { lazy } from 'react'

export const routes = [
  {
    path: '/',
    element: lazy(() => import('../pages/Landing')),
  },
  {
    path: '/language-select',
    element: lazy(() => import('../pages/LanguageSelect')),
  },
  {
    path: '/mission-hub',
    element: lazy(() => import('../pages/MissionHub')),
  },
  {
    path: '/levels/:levelId',
    element: lazy(() => import('../pages/Levels')),
  },
  {
    path: '*',
    element: lazy(() => import('../pages/Error')),
  },
]
