import { forwardRef } from 'react'

import { cn } from '../../utils/cn'

const styles = {
  primary:
    'border-neon/80 text-neon hover:bg-neon hover:text-abyss hover:shadow-neon',
  muted:
    'border-azure/60 text-azure hover:bg-azure hover:text-abyss hover:shadow-[0_0_20px_rgba(0,212,255,0.28)]',
  danger:
    'border-danger/70 text-danger hover:bg-danger hover:text-abyss',
}

export const NeonButton = forwardRef(function NeonButton(
  { className, variant = 'primary', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex min-h-12 items-center justify-center border bg-transparent px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] transition duration-300',
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})
