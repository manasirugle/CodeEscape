import { ChevronLeft, ChevronRight } from 'lucide-react'

import { NeonButton } from '../../../components/ui/NeonButton'

export function PhaseNavigation({ canPrev, canNext, onPrev, onNext, nextLabel = 'Continue' }) {
  return (
    <div className="flex flex-wrap gap-3">
      <NeonButton variant="muted" onClick={onPrev} disabled={!canPrev}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </NeonButton>
      <NeonButton onClick={onNext} disabled={!canNext}>
        {nextLabel}
        <ChevronRight className="ml-2 h-4 w-4" />
      </NeonButton>
    </div>
  )
}
