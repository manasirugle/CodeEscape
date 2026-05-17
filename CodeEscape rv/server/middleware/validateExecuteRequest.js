const MAX_CODE_LENGTH = 20000

export function validateExecuteRequest(req, res, next) {
  const { code, stdin } = req.body ?? {}

  if (typeof code !== 'string') {
    return res.status(400).json({
      ok: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Field "code" must be a string.',
      },
    })
  }

  if (!code.trim()) {
    return res.status(400).json({
      ok: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Code cannot be empty.',
      },
    })
  }

  if (code.length > MAX_CODE_LENGTH) {
    return res.status(413).json({
      ok: false,
      error: {
        type: 'PAYLOAD_TOO_LARGE',
        message: `Code exceeds maximum length (${MAX_CODE_LENGTH} characters).`,
      },
    })
  }

  if (stdin !== undefined && typeof stdin !== 'string') {
    return res.status(400).json({
      ok: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Field "stdin" must be a string when provided.',
      },
    })
  }

  return next()
}

