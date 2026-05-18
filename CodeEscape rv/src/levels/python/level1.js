const level1 = {
  id: 1,
  title: 'Pattern Recognition',
  concept: 'Signal Pattern Analysis',
  difficulty: 'Beginner',
  mode: 'synchronization',
  learningObjectives: [
    'Recognize repeating logical structures',
    'Detect sequence anomalies',
    'Build confidence in computational thinking',
  ],
  narrative:
    'Synchronization chamber initialized. Complete neural pattern calibration to unlock terminal access.',
  bootSequence: [
    'Synchronization request detected...',
    'Cognitive pattern analysis initialized...',
    'Signal lattice integrity: stable.',
    'Identify corrupted nodes to complete calibration.',
  ],
  patternTasks: [
    {
      id: 'seq-1',
      prompt: '2 -> 4 -> 6 -> ?',
      answer: '8',
      success: 'Sequence aligned. Increment pattern confirmed.',
      failure: 'Signal drift detected. The sequence rises by a fixed step.',
    },
    {
      id: 'seq-2',
      prompt: 'A -> C -> E -> ?',
      answer: 'G',
      success: 'Alphabetic jump chain restored.',
      failure: 'Corrupted alphabet stride. Move two letters forward.',
    },
    {
      id: 'seq-3',
      prompt: '1010 -> 1001 -> ?',
      answer: '1000',
      success: 'Binary node synchronized.',
      failure: 'Binary decay pattern unresolved. Track the final bit shift.',
    },
  ],
  instructions: 'Complete synchronization tasks to unlock terminal access.',
  starterCode: '',
  expectedOutput: 'Synchronization complete',
  validationType: 'output',
  testCases: [],
  hints: [
    'Look for the rule, not just the next symbol.',
    'Check how much each step changes.',
    'Stability comes from consistent progression.',
  ],
  xpReward: 120,
  unlocks: [2],
}

export default level1
