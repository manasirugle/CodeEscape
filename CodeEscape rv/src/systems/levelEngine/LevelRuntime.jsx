import { AlertTriangle, BookOpen } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { executePython } from '../compiler/pistonClient'
import { validateLevelResult } from '../validation'
import { CyberLayout } from '../../components/layouts/CyberLayout'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { NeonButton } from '../../components/ui/NeonButton'
import { useEscapeStore } from '../../store/useEscapeStore'
import { CodingChallengePanel } from './components/CodingChallengePanel'
import { DebuggingPanel } from './components/DebuggingPanel'
import { LessonPhaseLayout } from './components/LessonPhaseLayout'
import { LevelCompletionModal } from './LevelCompletionModal'
import { useLevelSession } from './useLevelSession'

const DEFAULT_PHASES = [
  { key: 'intro', label: 'Concept Introduction' },
  { key: 'guided', label: 'Guided Interaction' },
  { key: 'coding', label: 'Coding Challenge' },
  { key: 'debug', label: 'Debugging Challenge' },
]

function normalize(value) {
  return String(value ?? '').replace(/\r\n/g, '\n').trim()
}

function ValidationFeedback({ validation, fallback = 'Awaiting validation input.' }) {
  if (!validation) return <div className="text-sm text-ghost">{fallback}</div>
  return (
    <div className={['text-sm leading-7', validation.passed ? 'text-neon' : 'text-ember'].join(' ')}>
      <div>{validation.feedback}</div>
    </div>
  )
}

function TypewriterFeed({ lines = [], speed = 18 }) {
  const [visibleLines, setVisibleLines] = useState([''])
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    setVisibleLines([''])
    setLineIndex(0)
    setCharIndex(0)
  }, [lines])

  useEffect(() => {
    if (!lines.length || lineIndex >= lines.length) return undefined
    const current = lines[lineIndex]
    if (charIndex >= current.length) {
      const pause = setTimeout(() => {
        setVisibleLines((prev) => [...prev, ''])
        setLineIndex((prev) => prev + 1)
        setCharIndex(0)
      }, 260)
      return () => clearTimeout(pause)
    }

    const timer = setTimeout(() => {
      setVisibleLines((prev) => {
        const next = [...prev]
        next[next.length - 1] = `${next[next.length - 1]}${current[charIndex]}`
        return next
      })
      setCharIndex((prev) => prev + 1)
    }, speed)
    return () => clearTimeout(timer)
  }, [lines, lineIndex, charIndex, speed])

  return (
    <div className="rounded-md border border-neon/10 bg-black/25 px-4 py-4 font-mono text-sm leading-7 text-neon/90">
      {visibleLines.map((line, idx) => (
        <div key={`${idx}-${line}`}>{line || '\u00A0'}</div>
      ))}
    </div>
  )
}

export function LevelRuntime({ level }) {
  const navigate = useNavigate()
  const markLevelStarted = useEscapeStore((state) => state.markLevelStarted)
  const markLevelCompleted = useEscapeStore((state) => state.markLevelCompleted)
  const levelState = useEscapeStore((state) => state.levels[level.id])
  const startedLevelRef = useRef(null)
  const session = useLevelSession(level)

  const isLevel1 = level.id === 1
  const isLevel2 = level.id === 2
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [completionLocked, setCompletionLocked] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [attemptWrong, setAttemptWrong] = useState(0)

  const [guidedIndex, setGuidedIndex] = useState(0)
  const [guidedInput, setGuidedInput] = useState('')
  const [guidedFeedback, setGuidedFeedback] = useState('')
  const [guidedDone, setGuidedDone] = useState(false)

  const [debugCode, setDebugCode] = useState(level.debuggingChallenge?.brokenCode ?? '')
  const [debugExecution, setDebugExecution] = useState(null)
  const [debugValidation, setDebugValidation] = useState(null)
  const [debugError, setDebugError] = useState('')
  const [debugRunning, setDebugRunning] = useState(false)
  const [debugPassed, setDebugPassed] = useState(false)

  useEffect(() => {
    if (startedLevelRef.current === level.id) return
    markLevelStarted(level.id)
    startedLevelRef.current = level.id
  }, [level.id, markLevelStarted])

  useEffect(() => {
    setPhaseIndex(0)
    setCompletionLocked(false)
    setShowCompletion(false)
    setAttemptWrong(0)
    setGuidedIndex(0)
    setGuidedInput('')
    setGuidedFeedback('')
    setGuidedDone(false)
    setDebugCode(level.debuggingChallenge?.brokenCode ?? '')
    setDebugExecution(null)
    setDebugValidation(null)
    setDebugError('')
    setDebugRunning(false)
    setDebugPassed(false)
  }, [level.id, level.debuggingChallenge?.brokenCode])

  const runCodingPhase = useCallback(async () => {
    const validation = await session.runCode()
    if (!validation?.passed) {
      setAttemptWrong((prev) => prev + 1)
      return
    }
    if (isLevel2) setPhaseIndex(3)
  }, [isLevel2, session])

  const runDebugPhase = useCallback(async () => {
    if (!level.debuggingChallenge?.testCases?.length) {
      setDebugValidation({ passed: true, feedback: 'Transmission repair accepted.' })
      setDebugPassed(true)
      return
    }
    setDebugRunning(true)
    setDebugError('')
    try {
      const execution = await executePython({
        code: debugCode,
        stdin: level.debuggingChallenge.testCases?.[0]?.input ?? '',
      })
      setDebugExecution(execution)
      const validation = validateLevelResult({
        level: {
          validationType: level.debuggingChallenge.validationType ?? 'output',
          testCases: level.debuggingChallenge.testCases ?? [],
        },
        code: debugCode,
        executionResult: execution,
      })
      setDebugValidation(validation)
      if (validation.passed) setDebugPassed(true)
      else setAttemptWrong((prev) => prev + 1)
    } catch (error) {
      setDebugError(error?.message || 'Debug execution failed.')
      setDebugValidation({ passed: false, feedback: 'Transmission repair failed.' })
      setAttemptWrong((prev) => prev + 1)
    } finally {
      setDebugRunning(false)
    }
  }, [debugCode, level.debuggingChallenge])

  const patternTasks = level.patternTasks ?? []
  const guidedExamples = level.guidedOutputExamples ?? []

  const activePatternTask = patternTasks[guidedIndex] ?? null
  const activeOutputTask = guidedExamples[guidedIndex] ?? null

  const submitGuided = () => {
    if (isLevel1 && activePatternTask) {
      const passed = normalize(guidedInput).toUpperCase() === normalize(activePatternTask.answer).toUpperCase()
      if (!passed) {
        setGuidedFeedback(activePatternTask.failure || 'Signal mismatch detected.')
        return
      }
      setGuidedFeedback(activePatternTask.success || 'Signal synchronized.')
      if (guidedIndex >= patternTasks.length - 1) {
        setGuidedDone(true)
        setPhaseIndex(2)
      } else {
        setGuidedIndex((prev) => prev + 1)
        setGuidedInput('')
      }
      return
    }

    if (isLevel2 && activeOutputTask) {
      const passed = normalize(guidedInput) === normalize(activeOutputTask.answer)
      if (!passed) {
        setGuidedFeedback(activeOutputTask.explanation || 'Output prediction mismatch.')
        return
      }
      setGuidedFeedback('Prediction aligned. Signal model stable.')
      if (guidedIndex >= guidedExamples.length - 1) {
        setGuidedDone(true)
        setPhaseIndex(2)
      } else {
        setGuidedIndex((prev) => prev + 1)
        setGuidedInput('')
      }
    }
  }

  useEffect(() => {
    const codingPassed = Boolean(session.validation?.passed)
    const ready = isLevel1 ? guidedDone : isLevel2 ? guidedDone && codingPassed && debugPassed : codingPassed
    if (!ready || completionLocked) return

    setCompletionLocked(true)
    markLevelCompleted(level.id, {
      wrongAttempts: attemptWrong,
      timeSpent: 0,
      xpReward: level.xpReward,
      completedAt: Date.now(),
    })
    setShowCompletion(true)
  }, [
    isLevel1,
    isLevel2,
    guidedDone,
    session.validation,
    debugPassed,
    completionLocked,
    markLevelCompleted,
    level.id,
    attemptWrong,
    level.xpReward,
  ])

  const completedSet = useMemo(() => {
    const set = new Set()
    if (phaseIndex > 0) set.add(0)
    if (guidedDone) set.add(1)
    if (session.validation?.passed) set.add(2)
    if (debugPassed) set.add(3)
    return set
  }, [phaseIndex, guidedDone, session.validation, debugPassed])

  const nextLevel = level.unlocks?.[0]
  const codingConsoleOutput =
    session.error || session.execution?.stderr || session.execution?.stdout || session.execution?.output || ''
  const debugConsoleOutput =
    debugError || debugExecution?.stderr || debugExecution?.stdout || debugExecution?.output || ''

  const level1Phases = [
    { key: 'boot', label: 'AI Boot Sequence' },
    { key: 'sync', label: 'Pattern Synchronization' },
    { key: 'access', label: 'Terminal Access' },
  ]
  const level2Phases = DEFAULT_PHASES
  const phases = isLevel1 ? level1Phases : isLevel2 ? level2Phases : [{ key: 'coding', label: 'Coding Challenge' }]
  const maxHintsForCurrentFlow = isLevel1 || isLevel2 ? 2 : Math.min(level.hints?.length ?? 0, 2)
  const availableHints = (level.hints ?? []).slice(0, maxHintsForCurrentFlow)
  const visibleHints = session.hints.visibleHints.filter((_, index) => index < maxHintsForCurrentFlow)
  const canRevealHint = session.hints.revealedCount < availableHints.length

  const hintUi = useMemo(() => {
    if (isLevel1) {
      if (phaseIndex === 0) {
        return {
          fallback: 'No guidance required for this sequence.',
          exhausted: 'No further assistance required.',
          buttonLabel: 'Assistance Offline',
          showButton: false,
        }
      }
      if (phaseIndex === 1) {
        return {
          fallback: 'Signal stable. Proceed independently.',
          exhausted: 'Guidance buffer exhausted.',
          buttonLabel: 'Request AI Guidance',
          showButton: true,
        }
      }
      return {
        fallback: 'System confidence threshold reached.',
        exhausted: 'No additional synchronization hints available.',
        buttonLabel: 'Assistance Offline',
        showButton: false,
      }
    }

    if (isLevel2) {
      if (phaseIndex === 0) {
        return {
          fallback: 'No guidance required for this sequence.',
          exhausted: 'No further assistance required.',
          buttonLabel: 'Assistance Offline',
          showButton: false,
        }
      }
      if (phaseIndex === 1) {
        return {
          fallback: 'Signal stable. Proceed independently.',
          exhausted: 'Guidance buffer exhausted.',
          buttonLabel: 'Request AI Guidance',
          showButton: true,
        }
      }
      if (phaseIndex === 2) {
        if (attemptWrong >= 2) {
          return {
            fallback: 'AI assistance temporarily unavailable.',
            exhausted: 'Guidance buffer exhausted.',
            buttonLabel: 'Request Priority Hint',
            showButton: true,
          }
        }
        return {
          fallback: 'No additional synchronization hints available.',
          exhausted: 'No more hints available.',
          buttonLabel: 'Request Transmission Hint',
          showButton: true,
        }
      }
      return {
        fallback: 'AI assistance temporarily unavailable.',
        exhausted: 'Guidance buffer exhausted.',
        buttonLabel: 'Request Recovery Hint',
        showButton: true,
      }
    }

    return {
      fallback: 'No additional synchronization hints available.',
      exhausted: 'No more hints available.',
      buttonLabel: 'Reveal Next Hint',
      showButton: true,
    }
  }, [isLevel1, isLevel2, phaseIndex, attemptWrong])

  const level1Main = (
    <>
      {phaseIndex === 0 ? (
        <GlassPanel className="px-5 py-5">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-ghost">AI Terminal Boot</div>
          <TypewriterFeed lines={level.bootSequence || []} />
          <NeonButton className="mt-4" onClick={() => setPhaseIndex(1)}>
            Initialize Synchronization
          </NeonButton>
        </GlassPanel>
      ) : null}

      {phaseIndex === 1 ? (
        <GlassPanel className="px-5 py-5">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-ghost">Pattern Recognition Chamber</div>
          <div className="rounded-md border border-neon/10 bg-black/25 px-4 py-3 font-mono text-lg text-neon">
            {activePatternTask?.prompt}
          </div>
          <input
            value={guidedInput}
            onChange={(event) => setGuidedInput(event.target.value)}
            className="mt-4 w-full border border-neon/20 bg-black/30 px-3 py-3 text-sm text-mist outline-none focus:border-neon"
            placeholder="Inject corrected signal..."
          />
          {guidedFeedback ? <div className="mt-3 text-sm text-neon">{guidedFeedback}</div> : null}
          <div className="mt-2 text-xs uppercase tracking-[0.14em] text-ghost">
            Node {Math.min(guidedIndex + 1, patternTasks.length)} / {patternTasks.length}
          </div>
          <NeonButton className="mt-4" onClick={submitGuided}>
            Validate Signal Node
          </NeonButton>
        </GlassPanel>
      ) : null}

      {phaseIndex === 2 ? (
        <GlassPanel className="px-5 py-5">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-ghost">Access Synchronization</div>
          <TypewriterFeed
            lines={[
              'Pattern integrity confirmed.',
              'Neural calibration stable.',
              'Terminal access granted.',
            ]}
            speed={16}
          />
        </GlassPanel>
      ) : null}
    </>
  )

  const level2Main = (
    <>
      {phaseIndex === 0 ? (
        <GlassPanel className="px-5 py-5">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-ghost">Signal Theory Briefing</div>
          <TypewriterFeed lines={level.bootSequence || []} speed={18} />
          <div className="mt-4 rounded-md border border-neon/10 bg-black/25 px-4 py-3 text-sm leading-7 text-mist/80">
            The `print()` protocol transmits readable text into the terminal output channel.
          </div>
          <NeonButton className="mt-4" onClick={() => setPhaseIndex(1)}>
            Begin Output Prediction
          </NeonButton>
        </GlassPanel>
      ) : null}

      {phaseIndex === 1 ? (
        <GlassPanel className="px-5 py-5">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-ghost">Output Prediction</div>
          <pre className="rounded-md border border-neon/10 bg-black/25 px-4 py-3 font-mono text-sm text-neon/90">
            {activeOutputTask?.prompt}
          </pre>
          <textarea
            value={guidedInput}
            onChange={(event) => setGuidedInput(event.target.value)}
            rows={3}
            className="mt-4 w-full border border-neon/20 bg-black/30 px-3 py-2 text-sm text-mist outline-none focus:border-neon"
            placeholder="Predict terminal output..."
          />
          {guidedFeedback ? <div className="mt-3 text-sm text-neon">{guidedFeedback}</div> : null}
          <NeonButton className="mt-4" onClick={submitGuided}>
            Validate Prediction
          </NeonButton>
        </GlassPanel>
      ) : null}

      {phaseIndex === 2 ? (
        <CodingChallengePanel
          instructions={level.instructions}
          code={session.code}
          onCodeChange={session.setCode}
          onRun={runCodingPhase}
          onReset={session.resetCode}
          isRunning={session.isRunning}
          output={codingConsoleOutput}
        />
      ) : null}

      {phaseIndex === 3 ? (
        <DebuggingPanel
          instructions={level.debuggingChallenge?.instructions || 'Repair broken signal syntax.'}
          explanation="Recover the output command and verify clean transmission."
          code={debugCode}
          onCodeChange={setDebugCode}
          onRun={runDebugPhase}
          onReset={() => setDebugCode(level.debuggingChallenge?.brokenCode ?? '')}
          isRunning={debugRunning}
          output={debugConsoleOutput}
        />
      ) : null}
    </>
  )

  const defaultMain = (
    <CodingChallengePanel
      instructions={level.instructions}
      code={session.code}
      onCodeChange={session.setCode}
      onRun={runCodingPhase}
      onReset={session.resetCode}
      isRunning={session.isRunning}
      output={codingConsoleOutput}
    />
  )

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
          <h1 className="font-display text-[clamp(3rem,8vw,5.4rem)] leading-none tracking-[0.12em] text-neon">
            {level.title.toUpperCase()}
          </h1>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-mist/80">{level.narrative}</p>
        </header>

        <LessonPhaseLayout
          phases={phases}
          currentPhase={phaseIndex}
          completedSet={completedSet}
          title={isLevel1 ? 'Synchronization Protocol' : isLevel2 ? 'Signal Output Training' : 'Coding Challenge'}
          main={isLevel1 ? level1Main : isLevel2 ? level2Main : defaultMain}
          validation={
            <ValidationFeedback
              validation={isLevel2 && phaseIndex === 3 ? debugValidation : session.validation}
              fallback={
                isLevel1
                  ? 'Awaiting synchronization checkpoints.'
                  : 'Awaiting execution signal.'
              }
            />
          }
          hints={visibleHints}
          onRevealHint={session.hints.revealNextHint}
          canRevealHint={canRevealHint}
          hintFallbackMessage={hintUi.fallback}
          hintExhaustedMessage={hintUi.exhausted}
          hintButtonLabel={hintUi.buttonLabel}
          showHintButton={hintUi.showButton}
        />

        <GlassPanel className="mt-4 px-4 py-4">
          <div className="mb-2 flex items-center gap-2 text-neon">
            <BookOpen className="h-4 w-4" />
            <div className="text-xs uppercase tracking-[0.2em]">Session Stats</div>
          </div>
          <div className="text-xs uppercase tracking-[0.16em] text-ghost">Attempts this session: {session.attempts}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.16em] text-ghost">Total attempts on this level: {levelState?.attempts ?? 0}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.16em] text-neon">XP reward: {level.xpReward}</div>
        </GlassPanel>

        {isLevel2 && phaseIndex === 2 ? (
          <GlassPanel className="mt-4 px-4 py-4">
            <div className="mb-2 flex items-center gap-2 text-ember">
              <AlertTriangle className="h-4 w-4" />
              <div className="text-xs uppercase tracking-[0.2em]">Expected Outcome</div>
            </div>
            <p className="text-sm leading-7 text-mist/85">{level.expectedOutput}</p>
          </GlassPanel>
        ) : null}
      </div>

      {showCompletion ? (
        <LevelCompletionModal
          level={level}
          attempts={session.attempts}
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
