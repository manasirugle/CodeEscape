import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE?.trim() || 'http://localhost:3000'

const client = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
})

export async function executePython({ code, stdin = '' }) {
  try {
    const response = await client.post('/api/execute', { code, stdin })
    const result = response?.data?.result ?? {}

    return {
      stdout: (result.stdout ?? '').replace(/\r\n/g, '\n'),
      stderr: (result.stderr ?? '').replace(/\r\n/g, '\n'),
      output: (result.output ?? '').replace(/\r\n/g, '\n'),
      code: result.code ?? null,
      signal: result.signal ?? null,
    }
  } catch (error) {
    const errorType = error?.response?.data?.error?.type
    const upstreamMessage = error?.response?.data?.error?.message

    let message = 'Unable to execute code right now. Please try again.'
    if (errorType === 'VALIDATION_ERROR') {
      message = upstreamMessage || 'Please check your code and try again.'
    } else if (errorType === 'PYTHON_NOT_FOUND') {
      message =
        'Python is not installed or not configured on the execution server. Please check PYTHON_BIN.'
    } else if (errorType === 'EXECUTION_TIMEOUT') {
      message = 'Execution timed out. Try a shorter or simpler solution.'
    } else if (errorType === 'UPSTREAM_ERROR') {
      message =
        upstreamMessage || 'Execution service is temporarily unavailable. Try again shortly.'
    } else if (error?.code === 'ECONNABORTED') {
      message = 'Request timed out. Please retry your code execution.'
    } else if (!error?.response) {
      message = 'Cannot reach the execution server. Ensure backend is running on localhost:3000.'
    }

    const wrappedError = new Error(message)
    wrappedError.type = errorType || 'EXECUTION_PROXY_ERROR'
    throw wrappedError
  }
}
