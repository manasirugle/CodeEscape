import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import executeRouter from './routes/execute.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 3000)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN?.trim()

app.use(
  cors(
    FRONTEND_ORIGIN
      ? {
          origin: FRONTEND_ORIGIN,
        }
      : true,
  ),
)
app.use(express.json({ limit: '64kb' }))

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'code-execution-proxy' })
})

app.use("/api/execute", executeRouter);

app.use((_req, res) => {
  res.status(404).json({
    ok: false,
    error: {
      type: 'NOT_FOUND',
      message: 'Route not found.',
    },
  })
})

app.listen(PORT, () => {
  console.log(`Execution proxy listening on http://localhost:${PORT}`)
})
