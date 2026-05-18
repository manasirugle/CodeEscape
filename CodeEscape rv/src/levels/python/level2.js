const level2 = {
  id: 2,
  title: 'Signal Output',
  concept: 'print() Output Transmission',
  difficulty: 'Beginner',
  mode: 'coding',
  learningObjectives: [
    'Understand how print() sends readable output',
    'Predict terminal output from simple statements',
    'Transmit your first verified message',
  ],
  narrative:
    'The terminal channel is open. Learn to transmit readable signals through output commands.',
  bootSequence: [
    'Signal relay online...',
    'Transmission protocol loaded: print()',
    'Readable output training chamber unlocked.',
  ],
  guidedOutputExamples: [
    {
      prompt: 'Predict output:\nprint("Code")\nprint("Escape")',
      answer: 'Code\nEscape',
      explanation: 'Each print() call writes on a new line.',
    },
    {
      prompt: 'Predict output:\nprint("Signal " + "Ready")',
      answer: 'Signal Ready',
      explanation: 'String fragments merge before display.',
    },
  ],
  instructions: 'Send the first readable signal: print exactly Hello, World!',
  starterCode: `# Send the first readable signal
print("")
`,
  expectedOutput: 'Hello, World!',
  validationType: 'output',
  testCases: [
    {
      input: '',
      expectedOutput: 'Hello, World!',
      explanation: 'Transmit the exact phrase, including comma and exclamation mark.',
    },
  ],
  debuggingChallenge: {
    instructions: 'Repair the broken transmission command.',
    brokenCode: 'print("Hello, World!)\n',
    validationType: 'output',
    testCases: [{ input: '', expectedOutput: 'Hello, World!', explanation: 'Close the quote and preserve punctuation.' }],
  },
  hints: [
    'The terminal only understands readable output.',
    'Wrap the signal text inside quotation marks.',
    'Use transmission protocol: print("Hello, World!")',
  ],
  xpReward: 150,
  unlocks: [3],
}

export default level2
