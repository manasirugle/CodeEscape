import { useState } from 'react'

import { executePython } from '../compiler/pistonClient'
import { useHints } from '../hints/useHints'
import { validateLevelResult } from '../validation'

export function useLevelSession(level) {
  const [code, setCode] = useState(level.starterCode ?? '')
  const [isRunning, setIsRunning] = useState(false)
  const [execution, setExecution] = useState(null)
  const [validation, setValidation] = useState(null)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  const hints = useHints(level.hints ?? [])

  const runCode = async () => {
    setIsRunning(true)
    setError('')
    setAttempts((prev) => prev + 1)

    try {
      const result = await executePython({
        code,
        stdin: level.testCases?.[0]?.input ?? '',
      })
      setExecution(result)

      if (result.stderr) {
        const nextValidation = {
          passed: false,
          score: 0,
          feedback: 'Your code ran with errors. Review the traceback in the console.',
          details: [],
        }
        setValidation(nextValidation)
        return nextValidation
      } else {
        const nextValidation = validateLevelResult({
          level,
          code,
          executionResult: result,
        })
        setValidation(nextValidation)
        return nextValidation
      }
    } catch (runError) {
      setError(
        runError?.response?.data?.message ||
          runError?.message ||
          'Execution failed. Please try again.',
      )
      const nextValidation = {
        passed: false,
        score: 0,
        feedback: 'Execution service is temporarily unavailable.',
        details: [],
      }
      setValidation(nextValidation)
      return nextValidation
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    setCode(level.starterCode ?? '')
    setExecution(null)
    setValidation(null)
    setError('')
    hints.resetHints()
  }

  return {
    code,
    setCode,
    isRunning,
    execution,
    validation,
    error,
    attempts,
    runCode,
    resetCode,
    hints,
  }
}
