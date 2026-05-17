import { useMemo, useState } from 'react'

export function useHints(hints = []) {
  const [revealedCount, setRevealedCount] = useState(0)

  const visibleHints = useMemo(
    () => hints.slice(0, revealedCount),
    [hints, revealedCount],
  )

  const canRevealMore = revealedCount < hints.length

  const revealNextHint = () => {
    if (!canRevealMore) return
    setRevealedCount((prev) => prev + 1)
  }

  const resetHints = () => setRevealedCount(0)

  return {
    visibleHints,
    canRevealMore,
    revealedCount,
    revealNextHint,
    resetHints,
  }
}

