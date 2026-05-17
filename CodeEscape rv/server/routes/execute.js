import { Router } from 'express'

import { validateExecuteRequest } from '../middleware/validateExecuteRequest.js'
import { executePythonCode } from '../services/pistonService.js'

const router = Router()

router.post('/', validateExecuteRequest, async (req, res) => {
  const { code, stdin = '' } = req.body

  try {
    const result = await executePythonCode({ code, stdin })
    return res.status(200).json({
      ok: true,
      result,
    })
  } catch (error) {
    if (error?.type === 'PYTHON_NOT_FOUND') {
      return res.status(500).json({
        ok: false,
        error: {
          type: 'PYTHON_NOT_FOUND',
          message:
            'Python is not available on this machine. Set PYTHON_BIN in .env to a valid Python command.',
        },
      })
    }

    if (error?.code === 'ECONNABORTED') {
      return res.status(504).json({
        ok: false,
        error: {
          type: 'EXECUTION_TIMEOUT',
          message: 'Execution timed out. Please simplify your code and try again.',
        },
      })
    }

    return res.status(500).json({
      ok: false,
      error: {
        type: 'INTERNAL_ERROR',
        message: 'Unexpected server error during code execution.',
      },
    })
  }
})

export default router
