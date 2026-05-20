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
    'No readable signal detected on the terminal channel.',
    'Transmission protocol available: print()',
  ],
  demonstration: {
    emptyTerminalLine: 'Terminal output buffer: [empty]',
    failedTransmissionLine: 'No readable signal received.',
    explanationLine: 'The terminal only displays signals you explicitly send.',
    visualCode: 'print("Hello, World!")',
    visualOutput: 'Hello, World!',
  },
  guidedOutputExamples: [
    {
      prompt: 'Which output appears after running: print("Code")?',
      type: 'mcq',
      options: ['Code', '"Code"', 'No output'],
      answer: 'Code',
      explanation: 'print() displays the text inside quotes, without the quote symbols.',
    },
    {
      prompt: 'Which output appears after running: print("Signal " + "Ready")?',
      type: 'mcq',
      options: ['Signal Ready', 'Signal + Ready', 'No output'],
      answer: 'Signal Ready',
      explanation: 'String fragments merge before display.',
    },
    {
      prompt: 'What is missing in this command?\nprint(Hello, World!)',
      type: 'mcq',
      options: ['Quotation marks around text', 'A second print()', 'A semicolon'],
      answer: 'Quotation marks around text',
      explanation: 'Readable text must be wrapped safely in quotation marks.',
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
    'The terminal cannot display plain words automatically.',
    'Wrap readable text safely inside quotation marks so Python treats it as a message.',
    'Use print() to transmit the message into visible output.',
  ],
  xpReward: 150,
  unlocks: [3],
}

export default level2
