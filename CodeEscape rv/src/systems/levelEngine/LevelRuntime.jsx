import Editor from '@monaco-editor/react'
import { AlertTriangle, BookOpen, Lightbulb, Play, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CyberLayout } from '../../components/layouts/CyberLayout'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { NeonButton } from '../../components/ui/NeonButton'
import { useEscapeStore } from '../../store/useEscapeStore'
import { LevelCompletionModal } from './LevelCompletionModal'
import { useLevelSession } from './useLevelSession'

function ValidationFeedback({ validation }) {
  if (!validation) {
    return (
      <div className="text-sm text-ghost">
        Run your code to validate this mission objective.
      </div>
    )
  }

  return (
    <div
      className={[
        'text-sm leading-7',
        validation.passed ? 'text-neon' : 'text-ember',
      ].join(' ')}
    >
      <div>{validation.feedback}</div>
      {validation.details?.length ? (
        <ul className="mt-2 space-y-1 text-xs uppercase tracking-[0.08em]">
          {validation.details.map((detail, idx) => (
            <li key={`${detail.expected}-${idx}`}>
              {detail.passed ? 'PASS' : 'FAIL'} | expected: {detail.expected} | actual:{' '}
              {detail.actual}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function LevelRuntime({ level }) {
  const navigate = useNavigate()
  const markLevelStarted = useEscapeStore((state) => state.markLevelStarted)
  const markLevelCompleted = useEscapeStore((state) => state.markLevelCompleted)
  const levelState = useEscapeStore((state) => state.levels[level.id])
  const [showCompletion, setShowCompletion] = useState(false)
  const [completionLocked, setCompletionLocked] = useState(false)
  const [attemptWrong, setAttemptWrong] = useState(0)
  const session = useLevelSession(level)
  const attempts = session.attempts
  const startedLevelRef = useRef(null)

  useEffect(() => {
    if (startedLevelRef.current === level.id) return
    markLevelStarted(level.id)
    startedLevelRef.current = level.id
  }, [level.id, markLevelStarted])

  const runAndValidate = useCallback(async () => {
    const validation = await session.runCode()
    const passed = validation?.passed
    if (passed && !completionLocked) {
      setCompletionLocked(true)
      markLevelCompleted(level.id, {
        wrongAttempts: attemptWrong,
        timeSpent: 0,
        xpReward: level.xpReward,
        completedAt: Date.now(),
      })
      setShowCompletion(true)
      return
    }
    if (!passed) {
      setAttemptWrong((prev) => prev + 1)
    }
  }, [session, completionLocked, markLevelCompleted, level.id, level.xpReward, attemptWrong])

  const nextLevel = level.unlocks?.[0]
  const consoleOutput =
    session.error ||
    session.execution?.stderr ||
    session.execution?.stdout ||
    session.execution?.output ||
    ''

  return (
    <CyberLayout
      status={{
        left: `SYS://LEARNING/${String(level.id).padStart(2, '0')}`,
        right: `${level.concept.toUpperCase()} TRAINING`,
      }}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <div className="text-[0.68rem] uppercase tracking-[0.24em] text-ghost">
            {level.difficulty} / {level.concept}
          </div>
          <h1 className="font-display text-[clamp(3.1rem,8vw,5.6rem)] leading-none tracking-[0.12em] text-neon">
            {level.title.toUpperCase()}
          </h1>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-mist/80">
            {level.narrative}
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-4">
            <GlassPanel className="px-5 py-5">
              <div className="mb-2 text-xs uppercase tracking-[0.2em] text-ghost">
                Learning Objective
              </div>
              <p className="text-sm leading-7 text-mist/85">{level.objective || level.instructions}</p>
              <div className="mt-4 rounded-md border border-neon/15 bg-black/25 px-4 py-3 text-sm leading-7 text-mist/80">
                <span className="text-neon">Beginner Explanation:</span> {level.learningObjectives?.join(' | ') || level.instructions}
              </div>
              <div className="mt-3 text-sm leading-7 text-mist/80">
                <span className="text-neon">Instructions:</span> {level.instructions}
              </div>
            </GlassPanel>

            <GlassPanel className="overflow-hidden">
              <div className="border-b border-neon/15 px-4 py-3 text-xs uppercase tracking-[0.2em] text-ghost">
                Code Editor
              </div>
              <Editor
                height="320px"
                defaultLanguage="python"
                value={session.code}
                onChange={(value) => session.setCode(value ?? '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: 'Share Tech Mono',
                }}
                theme="vs-dark"
              />
            </GlassPanel>

            <div className="flex flex-wrap gap-3">
              <NeonButton onClick={runAndValidate} disabled={session.isRunning}>
                <Play className="mr-2 h-4 w-4" />
                {session.isRunning ? 'Running...' : 'Run Code'}
              </NeonButton>
              <NeonButton variant="muted" onClick={session.resetCode}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Code
              </NeonButton>
            </div>

            <GlassPanel className="px-4 py-4">
              <div className="mb-2 text-xs uppercase tracking-[0.2em] text-ghost">Output Console</div>
              <pre className="min-h-[90px] whitespace-pre-wrap text-sm text-mist/85">
                {consoleOutput || 'No output yet. Run code to execute test cases.'}
              </pre>
            </GlassPanel>
          </div>

          <div className="space-y-4">
            <GlassPanel className="px-4 py-4">
              <div className="mb-2 flex items-center gap-2 text-neon">
                <BookOpen className="h-4 w-4" />
                <div className="text-xs uppercase tracking-[0.2em]">Validation</div>
              </div>
              <ValidationFeedback validation={session.validation} />
              <div className="mt-4 text-xs uppercase tracking-[0.16em] text-ghost">
                Attempts this session: {attempts}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-ghost">
                Total attempts on this level: {levelState?.attempts ?? 0}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-neon">
                XP reward: {level.xpReward}
              </div>
            </GlassPanel>

            <GlassPanel className="px-4 py-4">
              <div className="mb-2 flex items-center gap-2 text-neon">
                <Lightbulb className="h-4 w-4" />
                <div className="text-xs uppercase tracking-[0.2em]">Hints</div>
              </div>
              <div className="space-y-2">
                {session.hints.visibleHints.length === 0 ? (
                  <div className="text-sm text-ghost">No hints revealed yet.</div>
                ) : (
                  session.hints.visibleHints.map((hint, index) => (
                    <div key={`${hint}-${index}`} className="rounded-md border border-neon/10 bg-black/25 px-3 py-2 text-sm text-mist/85">
                      Hint {index + 1}: {hint}
                    </div>
                  ))
                )}
              </div>
              <NeonButton
                className="mt-3 w-full"
                variant="muted"
                onClick={session.hints.revealNextHint}
                disabled={!session.hints.canRevealMore}
              >
                Reveal Next Hint
              </NeonButton>
            </GlassPanel>

            <GlassPanel className="px-4 py-4">
              <div className="mb-2 flex items-center gap-2 text-ember">
                <AlertTriangle className="h-4 w-4" />
                <div className="text-xs uppercase tracking-[0.2em]">Expected Outcome</div>
              </div>
              <p className="text-sm leading-7 text-mist/85">
                {level.expectedOutput}
              </p>
            </GlassPanel>
          </div>
        </div>
      </div>

      {showCompletion ? (
        <LevelCompletionModal
          level={level}
          attempts={attempts}
          xpReward={level.xpReward}
          onContinue={() => {
            setShowCompletion(false)
            if (nextLevel) navigate(`/levels/${nextLevel}`)
            else navigate('/mission-hub')
          }}
          onBackToHub={() => {
            setShowCompletion(false)
            navigate('/mission-hub')
          }}
        />
      ) : null}
    </CyberLayout>
  )
}
