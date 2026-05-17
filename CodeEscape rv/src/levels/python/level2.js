const level2 = {
  id: 2,
  title: 'Variables',
  concept: 'Variables',
  difficulty: 'Beginner',
  learningObjectives: [
    'Store text in a variable',
    'Print a variable value',
  ],
  narrative: 'Stabilize memory nodes by assigning a secure codename.',
  instructions:
    'Create a variable named codename with value "Nova" and print it.',
  starterCode: `# Create and print the codename variable
codename = ""
print(codename)
`,
  expectedOutput: 'Nova',
  validationType: 'output',
  testCases: [
    {
      input: '',
      expectedOutput: 'Nova',
      explanation: 'Print should display the variable value.',
    },
  ],
  hints: [
    'Use codename = "Nova" to store the value.',
    'Use print(codename) to show it.',
    'Your final output should be Nova.',
  ],
  xpReward: 150,
  unlocks: [3],
}

export default level2

