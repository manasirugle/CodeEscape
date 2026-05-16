import { GlassPanel } from '../ui/GlassPanel'
import { cn } from '../../utils/cn'

export function TerminalWindow({ title, status, className, children }) {
  return (
    <GlassPanel className={cn('overflow-hidden', className)}>
      <div className="flex items-center justify-between border-b border-neon/15 px-4 py-3 sm:px-6">
        <div className="font-display text-2xl tracking-[0.16em] text-neon">{title}</div>
        <div className="text-[0.62rem] uppercase tracking-[0.24em] text-ghost">{status}</div>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-6">{children}</div>
    </GlassPanel>
  )
}
