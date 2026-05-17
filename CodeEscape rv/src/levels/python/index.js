import level1 from './level1'
import level2 from './level2'
import level3 from './level3'

export const PYTHON_LEVELS = [level1, level2, level3]

export const getPythonLevelById = (id) =>
  PYTHON_LEVELS.find((level) => level.id === Number(id)) ?? null

