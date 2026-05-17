import {
  validateFunctionScaffold,
  validateOutput,
  validatePatternScaffold,
} from './validators'

export function validateLevelResult({ level, code, executionResult }) {
  switch (level.validationType) {
    case 'output':
      return validateOutput({ executionResult, level })
    case 'function':
      return validateFunctionScaffold({ code, level, executionResult })
    case 'pattern':
      return validatePatternScaffold({ code, level, executionResult })
    default:
      return {
        passed: false,
        score: 0,
        feedback: `Unknown validation type: ${level.validationType}`,
        details: [],
      }
  }
}

