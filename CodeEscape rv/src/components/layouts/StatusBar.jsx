import { useStatusClock } from '../../hooks/useStatusClock'

export function StatusBar({ left, right, center }) {
  const clock = useStatusClock()

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neon/10 bg-abyss/95 px-4 py-3 backdrop-blur-lg sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-[0.62rem] uppercase tracking-[0.28em] text-ghost">
        <span className="truncate">{left}</span>
        <span className="hidden sm:inline">{center ?? clock}</span>
        <span className="flex items-center gap-2 truncate text-right">
          {right}
          <span className="inline-block h-3.5 w-2 animate-caret bg-neon" />
        </span>
      </div>
    </div>
  )
}
