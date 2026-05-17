import { CheckCircle2, Sparkles } from 'lucide-react'

import { GlassPanel } from '../../components/ui/GlassPanel'
import { NeonButton } from '../../components/ui/NeonButton'

export function LevelCompletionModal({
  level,
  attempts,
  xpReward,
  onContinue,
  onBackToHub,
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 px-4">
      <GlassPanel className="w-full max-w-2xl px-6 py-6">
        <div className="mb-3 flex items-center gap-2 text-neon">
          <CheckCircle2 className="h-5 w-5" />
          <div className="text-sm uppercase tracking-[0.22em]">Mission Accomplished</div>
        </div>
        <h3 className="font-display text-5xl tracking-[0.14em] text-neon">
          {level.title.toUpperCase()} CLEARED
        </h3>
        <p className="mt-3 text-sm leading-7 text-mist/85">
          You completed the learning objective for {level.concept}.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-neon/20 bg-black/30 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-ghost">XP Earned</div>
            <div className="mt-1 flex items-center gap-2 font-display text-3xl text-neon">
              <Sparkles className="h-4 w-4" />
              {xpReward}
            </div>
          </div>
          <div className="rounded-md border border-neon/20 bg-black/30 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-ghost">Attempts</div>
            <div className="mt-1 font-display text-3xl text-neon">{attempts}</div>
          </div>
          <div className="rounded-md border border-neon/20 bg-black/30 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-ghost">Unlocked</div>
            <div className="mt-1 font-display text-3xl text-neon">
              {level.unlocks?.join(', ') || '-'}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <NeonButton onClick={onContinue}>Continue</NeonButton>
          <NeonButton variant="muted" onClick={onBackToHub}>
            Back To Hub
          </NeonButton>
        </div>
      </GlassPanel>
    </div>
  )
}

