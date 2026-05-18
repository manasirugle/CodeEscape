import { CheckCircle2 } from 'lucide-react'

export function LessonProgressIndicator({ phases, currentPhase, completedSet }) {
  return (
    <div className="grid gap-2 md:grid-cols-4">
      {phases.map((phase, idx) => {
        const isActive = idx === currentPhase
        const isDone = completedSet.has(idx)
        return (
          <div
            key={phase.key}
            className={[
              'border px-3 py-3 text-left text-xs uppercase tracking-[0.16em]',
              isActive ? 'border-neon bg-neon/10 text-neon' : 'border-neon/20 text-ghost',
            ].join(' ')}
          >
            <div className="mb-1 flex items-center gap-1">
              {isDone ? <CheckCircle2 className="h-3.5 w-3.5 text-neon" /> : null}
              {`Phase ${idx + 1}`}
            </div>
            <div className="text-[0.65rem] tracking-[0.1em]">{phase.label}</div>
          </div>
        )
      })}
    </div>
  )
}
