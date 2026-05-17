import { create } from 'zustand'

import { LEVEL_COUNT } from '../data/levels'
import {
  createDefaultState,
  readEscapeState,
  readSelectedLanguage,
  writeEscapeState,
  writeSelectedLanguage,
} from '../utils/storage'

const persistedState = readEscapeState()

const sync = (state) => {
  writeEscapeState({
    currentLevel: state.currentLevel,
    startTime: state.startTime,
    lastPlayed: state.lastPlayed,
    levels: state.levels,
    totalWrongAttempts: state.totalWrongAttempts,
    totalTimeSpent: state.totalTimeSpent,
    totalAttempts: state.totalAttempts,
    totalXp: state.totalXp,
    unlockedLevels: state.unlockedLevels,
    playerName: state.playerName,
  })
  writeSelectedLanguage(state.selectedLanguage)
}

export const useEscapeStore = create((set, get) => ({
  ...persistedState,
  selectedLanguage: readSelectedLanguage(),
  isBootSequenceComplete: false,
  setBootSequenceComplete: (value) => set({ isBootSequenceComplete: value }),
  setSelectedLanguage: (selectedLanguage) => {
    set((state) => {
      const next = {
        ...state,
        selectedLanguage,
        lastPlayed: Date.now(),
      }
      sync(next)
      return next
    })
  },
  setCurrentLevel: (currentLevel) => {
    set((state) => {
      const next = {
        ...state,
        currentLevel,
        lastPlayed: Date.now(),
      }
      sync(next)
      return next
    })
  },
  setPlayerName: (playerName) => {
    set((state) => {
      const next = {
        ...state,
        playerName,
        lastPlayed: Date.now(),
      }
      sync(next)
      return next
    })
  },
  markLevelStarted: (levelId) => {
    set((state) => {
      const next = {
        ...state,
        currentLevel: levelId,
        lastPlayed: Date.now(),
        totalAttempts: state.totalAttempts + 1,
        levels: {
          ...state.levels,
          [levelId]: {
            ...state.levels[levelId],
            started: true,
            attempts: (state.levels[levelId]?.attempts ?? 0) + 1,
          },
        },
      }
      sync(next)
      return next
    })
  },
  addLevelAttempt: (levelId) => {
    set((state) => {
      const next = {
        ...state,
        lastPlayed: Date.now(),
        totalAttempts: state.totalAttempts + 1,
        levels: {
          ...state.levels,
          [levelId]: {
            ...state.levels[levelId],
            attempts: (state.levels[levelId]?.attempts ?? 0) + 1,
          },
        },
      }
      sync(next)
      return next
    })
  },
  markLevelCompleted: (levelId, payload = {}) => {
    set((state) => {
      const unlockedSet = new Set(state.unlockedLevels ?? [1])
      unlockedSet.add(levelId)
      if (levelId < LEVEL_COUNT) unlockedSet.add(levelId + 1)
      const xpReward = payload.xpReward ?? 0

      const next = {
        ...state,
        currentLevel: Math.min(levelId + 1, LEVEL_COUNT),
        lastPlayed: Date.now(),
        totalWrongAttempts: state.totalWrongAttempts + (payload.wrongAttempts ?? 0),
        totalTimeSpent: state.totalTimeSpent + (payload.timeSpent ?? 0),
        totalXp: state.totalXp + xpReward,
        unlockedLevels: Array.from(unlockedSet).sort((a, b) => a - b),
        levels: {
          ...state.levels,
          [levelId]: {
            ...state.levels[levelId],
            started: true,
            completed: true,
            completedAt: payload.completedAt ?? Date.now(),
            wrongAttempts: payload.wrongAttempts ?? state.levels[levelId]?.wrongAttempts ?? 0,
            timeSpent: payload.timeSpent ?? state.levels[levelId]?.timeSpent ?? 0,
            signal: payload.signal ?? state.levels[levelId]?.signal,
            xpEarned: (state.levels[levelId]?.xpEarned ?? 0) + xpReward,
          },
        },
      }
      sync(next)
      return next
    })
  },
  resetProgress: () => {
    const fresh = createDefaultState()
    const next = {
      ...fresh,
      selectedLanguage: get().selectedLanguage,
      isBootSequenceComplete: false,
    }
    sync(next)
    set(next)
  },
}))
