import { LEVEL_COUNT } from '../data/levels'

export const STORAGE_KEYS = {
  state: 'cer_state',
  language: 'cer_selected_lang',
}

const createLevelRecord = () => ({
  completed: false,
  wrongAttempts: 0,
  timeSpent: 0,
  completedAt: null,
  started: false,
  attempts: 0,
  xpEarned: 0,
})

export const createDefaultState = () => {
  const levels = {}

  for (let index = 1; index <= LEVEL_COUNT; index += 1) {
    levels[index] = createLevelRecord()
  }

  return {
    currentLevel: 1,
    startTime: Date.now(),
    lastPlayed: Date.now(),
    levels,
    totalWrongAttempts: 0,
    totalTimeSpent: 0,
    totalAttempts: 0,
    totalXp: 0,
    unlockedLevels: [1],
    playerName: 'OPERATIVE',
  }
}

export const normalizeState = (candidate) => {
  const base = createDefaultState()
  const incoming = candidate && typeof candidate === 'object' ? candidate : {}
  const levels = { ...base.levels }

  for (let index = 1; index <= LEVEL_COUNT; index += 1) {
    levels[index] = {
      ...base.levels[index],
      ...(incoming.levels?.[index] ?? incoming.levels?.[String(index)] ?? {}),
    }
  }

  return {
    ...base,
    ...incoming,
    levels,
  }
}

export const readEscapeState = () => {
  if (typeof window === 'undefined') {
    return createDefaultState()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.state)
    if (!raw) {
      const base = createDefaultState()
      writeEscapeState(base)
      return base
    }

    const parsed = JSON.parse(raw)
    return normalizeState(parsed)
  } catch (error) {
    const fallback = createDefaultState()
    writeEscapeState(fallback)
    return fallback
  }
}

export const writeEscapeState = (state) => {
  if (typeof window === 'undefined') {
    return
  }

  const nextState = normalizeState(state)
  window.localStorage.setItem(STORAGE_KEYS.state, JSON.stringify(nextState))
}

export const readSelectedLanguage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(STORAGE_KEYS.language)
}

export const writeSelectedLanguage = (language) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEYS.language, language)
}
