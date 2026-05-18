import { BookOpen, Lightbulb } from 'lucide-react'

import { GlassPanel } from '../../../components/ui/GlassPanel'
import { NeonButton } from '../../../components/ui/NeonButton'
import { LessonProgressIndicator } from './LessonProgressIndicator'

export function LessonPhaseLayout({
  phases,
  currentPhase,
  completedSet,
  title,
  main,
  validation,
  hints,
  onRevealHint,
  canRevealHint,
  hintFallbackMessage = 'No further assistance required.',
  hintExhaustedMessage = 'No more hints available.',
  hintButtonLabel = 'Reveal Next Hint',
  showHintButton = true,
}) {
  const hasHints = hints.length > 0

  return (
    <>
      <GlassPanel className="mb-5 px-4 py-4">
        <div className="mb-3 text-xs uppercase tracking-[0.22em] text-ghost">{title}</div>
        <LessonProgressIndicator phases={phases} currentPhase={currentPhase} completedSet={completedSet} />
      </GlassPanel>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">{main}</div>
        <div className="space-y-4">
          <GlassPanel className="px-4 py-4">
            <div className="mb-2 flex items-center gap-2 text-neon">
              <BookOpen className="h-4 w-4" />
              <div className="text-xs uppercase tracking-[0.2em]">Validation</div>
            </div>
            {validation}
          </GlassPanel>

          <GlassPanel className="px-4 py-4">
            <div className="mb-2 flex items-center gap-2 text-neon">
              <Lightbulb className="h-4 w-4" />
              <div className="text-xs uppercase tracking-[0.2em]">Hints</div>
            </div>
            <div className="space-y-2">
              {!hasHints ? (
                <div className="text-sm text-ghost">{hintFallbackMessage}</div>
              ) : (
                hints.map((hint, index) => (
                  <div key={`${hint}-${index}`} className="rounded-md border border-neon/10 bg-black/25 px-3 py-2 text-sm text-mist/85">
                    Hint {index + 1}: {hint}
                  </div>
                ))
              )}
            </div>
            {!canRevealHint && hasHints ? (
              <div className="mt-3 text-xs uppercase tracking-[0.14em] text-ghost">
                {hintExhaustedMessage}
              </div>
            ) : null}
            {showHintButton ? (
              <NeonButton className="mt-3 w-full" variant="muted" onClick={onRevealHint} disabled={!canRevealHint}>
                {hintButtonLabel}
              </NeonButton>
            ) : null}
          </GlassPanel>
        </div>
      </div>
    </>
  )
}
