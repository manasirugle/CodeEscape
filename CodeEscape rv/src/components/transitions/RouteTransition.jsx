import { motion } from 'framer-motion'

import { useRouteGlitch } from '../../hooks/useRouteGlitch'

export function RouteTransition({ children }) {
  const bars = useRouteGlitch()

  return (
    <motion.div
      className="relative min-h-screen"
      initial={{ opacity: 0, filter: 'blur(6px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
    >
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {bars.map((bar) => (
          <motion.div
            key={bar.id}
            className="absolute left-0 w-full origin-left"
            style={{
              top: `${bar.top}vh`,
              height: `${bar.height}px`,
              background: bar.color,
              opacity: 0,
            }}
            initial={{ scaleX: 0, x: -26, opacity: 0 }}
            animate={{ scaleX: [0, 1.2, 0.55, 0], x: [-26, 8, -12, 18], opacity: [0, 0.92, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: bar.duration, delay: bar.delay, ease: 'easeOut' }}
          />
        ))}
      </div>
      <motion.div
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -16, opacity: 0 }}
        transition={{ duration: 0.34, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
