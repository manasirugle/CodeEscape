const level1 = {
  id: 1,
  title: 'Hello World',
  concept: 'Output',
  difficulty: 'Beginner',
  learningObjectives: [
    'Understand how print() displays text',
    'Run your first Python program',
  ],
  narrative: 'Bring the terminal online by sending the first readable signal.',
  instructions:
    'Write Python code that prints exactly Hello, World! to the output console.',
  starterCode: `# Print the required message below
print("")
`,
  expectedOutput: 'Hello, World!',
  validationType: 'output',
  testCases: [
    {
      input: '',
      expectedOutput: 'Hello, World!',
      explanation: 'Output should match exactly, including punctuation.',
    },
  ],
  hints: [
    'Use the print() function.',
    'Text output should be inside quotes.',
    'Try: print("Hello, World!")',
  ],
  xpReward: 120,
  unlocks: [2],
}

export default level1

