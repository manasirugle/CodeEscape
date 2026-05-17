const level3 = {
  id: 3,
  title: 'User Input',
  concept: 'Input/Output',
  difficulty: 'Beginner',
  learningObjectives: [
    'Read user input using input()',
    'Use input in printed output',
  ],
  narrative: 'Authenticate the relay by reading the operator name from input.',
  instructions:
    'Read a name using input() and print: Welcome, <name>!',
  starterCode: `# Read input and greet the user
name = input()
print("")
`,
  expectedOutput: 'Welcome, Alex!',
  validationType: 'output',
  testCases: [
    {
      input: 'Alex',
      expectedOutput: 'Welcome, Alex!',
      explanation: 'Use the input value in the output greeting.',
    },
  ],
  hints: [
    'Store input() result in a variable called name.',
    'Combine text and name using + or f-strings.',
    'Example: print("Welcome, " + name + "!")',
  ],
  xpReward: 170,
  unlocks: [4],
}

export default level3

