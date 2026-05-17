const normalize = (value = '') => value.replace(/\r\n/g, '\n').trim()

export function validateOutput({ executionResult, level }) {
  const actual = normalize(executionResult.stdout || executionResult.output || '')
  const testCases = level.testCases ?? []

  if (!testCases.length) {
    return {
      passed: false,
      score: 0,
      feedback: 'No test cases configured for this level.',
      details: [],
    }
  }

  const details = testCases.map((test) => {
    const expected = normalize(test.expectedOutput)
    const passed = actual === expected
    return {
      passed,
      expected,
      actual,
      explanation: test.explanation ?? '',
    }
  })

  const passedCount = details.filter((item) => item.passed).length
  const passed = passedCount === details.length

  return {
    passed,
    score: passedCount / details.length,
    feedback: passed
      ? 'Output validated successfully.'
      : details.find((item) => !item.passed)?.explanation || 'Output did not match expected result.',
    details,
  }
}

export function validateFunctionScaffold({ code }) {
  const hasDef = /(^|\n)\s*def\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(code)
  return {
    passed: false,
    score: hasDef ? 0.4 : 0.1,
    feedback:
      'Function validation scaffolding is active. Full semantic checks will be added in the next phase.',
    details: [{ passed: hasDef, explanation: 'Function declaration detected.' }],
  }
}

export function validatePatternScaffold({ code }) {
  const hasLoop = /(^|\n)\s*(for|while)\s+/.test(code)
  const hasConditional = /(^|\n)\s*(if|elif|else)\b/.test(code)
  const hasFunctionUsage = /(^|\n)\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(code)
  const checks = [
    { key: 'loop', passed: hasLoop, explanation: 'Loop pattern detected.' },
    { key: 'conditional', passed: hasConditional, explanation: 'Conditional pattern detected.' },
    { key: 'functionUsage', passed: hasFunctionUsage, explanation: 'Function usage pattern detected.' },
  ]

  return {
    passed: false,
    score: checks.filter((entry) => entry.passed).length / checks.length,
    feedback:
      'Pattern validation scaffolding is active. Structural detection works; advanced AST checks are pending.',
    details: checks,
  }
}

