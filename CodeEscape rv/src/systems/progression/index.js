export function getLevelProgressSummary(levelState) {
  return {
    completed: Boolean(levelState?.completed),
    attempts: levelState?.attempts ?? 0,
    wrongAttempts: levelState?.wrongAttempts ?? 0,
    xpEarned: levelState?.xpEarned ?? 0,
    timeSpent: levelState?.timeSpent ?? 0,
  }
}

export function getUnlockState({ levelId, unlockedLevels = [] }) {
  return unlockedLevels.includes(levelId)
}

