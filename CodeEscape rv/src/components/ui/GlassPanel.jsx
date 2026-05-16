import { cn } from '../../utils/cn'

export function GlassPanel({ className, children }) {
  return (
    <div
      className={cn(
        'rounded-md border border-neon/30 bg-abyss-soft/70 shadow-panel backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
