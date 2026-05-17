import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const EXECUTE_TIMEOUT_MS = Number(
  process.env.EXECUTE_TIMEOUT_MS || process.env.PISTON_TIMEOUT_MS || 15000,
)
const PYTHON_BIN = process.env.PYTHON_BIN?.trim() || 'python'

function normalize(text) {
  return String(text ?? '').replace(/\r\n/g, '\n')
}

export async function executePythonCode({ code, stdin = '' }) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'codeescape-'))
  const scriptPath = path.join(tempDir, 'main.py')

  await writeFile(scriptPath, code, 'utf8')

  try {
    return await new Promise((resolve, reject) => {
      const child = spawn(PYTHON_BIN, [scriptPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        windowsHide: true,
      })

      let stdout = ''
      let stderr = ''
      let timedOut = false

      const timeoutId = setTimeout(() => {
        timedOut = true
        child.kill('SIGKILL')
      }, EXECUTE_TIMEOUT_MS)

      child.stdout.on('data', (chunk) => {
        stdout += String(chunk)
      })

      child.stderr.on('data', (chunk) => {
        stderr += String(chunk)
      })

      child.on('error', (error) => {
        clearTimeout(timeoutId)
        if (error?.code === 'ENOENT') {
          const wrapped = new Error(`Python executable not found: ${PYTHON_BIN}`)
          wrapped.type = 'PYTHON_NOT_FOUND'
          reject(wrapped)
          return
        }
        reject(error)
      })

      child.on('close', (exitCode, signal) => {
        clearTimeout(timeoutId)
        if (timedOut) {
          const timeoutError = new Error('Execution timed out.')
          timeoutError.code = 'ECONNABORTED'
          reject(timeoutError)
          return
        }

        const normalizedStdout = normalize(stdout)
        const normalizedStderr = normalize(stderr)
        resolve({
          stdout: normalizedStdout,
          stderr: normalizedStderr,
          output: normalize(`${stdout}${stderr}`),
          code: typeof exitCode === 'number' ? exitCode : 1,
          signal: signal ?? null,
          language: 'python',
          version: 'local',
        })
      })

      if (stdin) {
        child.stdin.write(stdin)
      }
      child.stdin.end()
    })
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}
