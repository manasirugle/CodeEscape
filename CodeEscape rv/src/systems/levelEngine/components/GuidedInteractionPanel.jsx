import { useMemo } from 'react'

import { GlassPanel } from '../../../components/ui/GlassPanel'
import { NeonButton } from '../../../components/ui/NeonButton'

export function GuidedInteractionPanel({
  prompt,
  answer,
  onAnswerChange,
  onSubmit,
  feedback,
  expectedLabel = 'Expected Response',
}) {
  const answerPreview = useMemo(() => answer, [answer])
  return (
    <GlassPanel className="px-5 py-5">
      <div className="mb-2 text-xs uppercase tracking-[0.2em] text-ghost">Guided Interaction</div>
      <p className="text-sm leading-7 text-mist/85">{prompt}</p>
      <textarea
        value={answer}
        onChange={(event) => onAnswerChange(event.target.value)}
        rows={3}
        className="mt-4 w-full border border-neon/20 bg-black/30 px-3 py-2 text-sm text-mist outline-none focus:border-neon"
        placeholder="Enter your prediction..."
      />
      <div className="mt-2 text-xs uppercase tracking-[0.14em] text-ghost">
        {expectedLabel}: <span className="text-neon">{answerPreview || 'Pending'}</span>
      </div>
      {feedback ? <div className="mt-3 text-sm text-neon">{feedback}</div> : null}
      <NeonButton className="mt-4" onClick={onSubmit}>
        Validate Prediction
      </NeonButton>
    </GlassPanel>
  )
}
