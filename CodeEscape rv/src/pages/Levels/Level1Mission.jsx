import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { AlertTriangle, CheckCircle2, Expand, Minimize, SkipForward } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CyberLayout } from '../../components/layouts/CyberLayout'
import { PuzzleOptions } from '../../components/terminal/PuzzleOptions'
import { TypewriterLog } from '../../components/terminal/TypewriterLog'
import { TerminalWindow } from '../../components/terminal/TerminalWindow'
import { NeonButton } from '../../components/ui/NeonButton'
import { useEscapeStore } from '../../store/useEscapeStore'
import { useSimulationStore } from '../../store/useSimulationStore'

const BOOT_LINES = ['signal_detected...', 'scanning...', 'anomaly found', 'source: USER']
const OPTIONS = [
  { id: 'A', label: 'A) 7', value: 7, correct: false },
  { id: 'B', label: 'B) 8', value: 8, correct: true },
  { id: 'C', label: 'C) 9', value: 9, correct: false },
  { id: 'D', label: 'D) 10', value: 10, correct: false },
]
const HINT_SETS = [
  ['Not quite.', 'Take a closer look.', 'Observe how the numbers are changing.'],
  ["You're getting closer.", 'Track the distance between each number.'],
  ['Pattern drift detected.', 'Each step increases by the same amount.', 'What is that amount?'],
  ['Stable pattern: +2 per step.'],
]

function getSignal(wrongAttempts, elapsedMs) {
  if (wrongAttempts === 0 && elapsedMs < 8000) return 'STRONG'
  if (wrongAttempts === 0) return 'GOOD'
  if (wrongAttempts <= 2) return 'MODERATE'
  return 'WEAK'
}

function getSignalBars(signal) {
  const level = { STRONG: 5, GOOD: 4, MODERATE: 3, WEAK: 2 }[signal] ?? 2
  const color = level >= 4 ? 'bg-neon border-neon' : level === 3 ? 'bg-ember border-ember' : 'bg-danger border-danger'
  return { level, color }
}

export default function Level1Mission() {
  const navigate = useNavigate()
  const terminalRef = useRef(null)
  const puzzleStartTime = useRef(0)

  const markLevelStarted = useEscapeStore((state) => state.markLevelStarted)
  const markLevelCompleted = useEscapeStore((state) => state.markLevelCompleted)
  const currentLevelState = useEscapeStore((state) => state.levels[1])
  const playerName = useEscapeStore((state) => state.playerName || 'OPERATIVE')
  const setMode = useSimulationStore((state) => state.setMode)
  const triggerPulse = useSimulationStore((state) => state.triggerPulse)

  const [phase, setPhase] = useState('boot')
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [resolved, setResolved] = useState(false)
  const [signal, setSignal] = useState(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)

  const feedbackClass = resolved ? 'text-neon' : wrongAttempts > 0 ? 'text-danger' : 'text-ghost'

  useEffect(() => {
    markLevelStarted(1)
    setMode('boot')
  }, [markLevelStarted, setMode])

  useEffect(() => {
    const onFullScreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullScreen)
    return () => document.removeEventListener('fullscreenchange', onFullScreen)
  }, [])

  useEffect(() => {
    if (!terminalRef.current) return
    gsap.fromTo(
      terminalRef.current.querySelectorAll('[data-cinematic]'),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out' },
    )
  }, [phase])

  const handleBootComplete = () => {
    window.setTimeout(() => {
      setMode('calm')
      setPhase('briefing')
    }, 500)
  }

  const startPuzzle = () => {
    puzzleStartTime.current = Date.now()
    setMode('focus')
    setPhase('puzzle')
  }

  const handleSelect = useCallback(
    (option) => {
      if (resolved) return

      setSelectedOption(option.id)
      if (option.correct) {
        const elapsed = Date.now() - puzzleStartTime.current
        const nextSignal = getSignal(wrongAttempts, elapsed)
        setSignal(nextSignal)
        setTimeSpent(elapsed)
        setFeedback(['Pattern accepted.', 'Logic fingerprint verified.'])
        setResolved(true)
        triggerPulse()
        setMode('stabilized')
        markLevelCompleted(1, {
          wrongAttempts,
          timeSpent: elapsed,
          signal: nextSignal,
          completedAt: Date.now(),
        })
        window.dispatchEvent(new CustomEvent('cer:audio', { detail: { cue: 'success' } }))
        window.setTimeout(() => setPhase('complete'), 1400)
      } else {
        const nextWrong = wrongAttempts + 1
        setWrongAttempts(nextWrong)
        setFeedback(HINT_SETS[Math.min(nextWrong - 1, HINT_SETS.length - 1)])
        triggerPulse()
        setIsRecovering(true)
        setMode('alert')
        window.dispatchEvent(new CustomEvent('cer:audio', { detail: { cue: 'failure' } }))
        window.setTimeout(() => {
          setSelectedOption(null)
          setIsRecovering(false)
          setMode('focus')
        }, 650)
      }
    },
    [markLevelCompleted, resolved, setMode, triggerPulse, wrongAttempts],
  )

  useEffect(() => {
    const onKeyDown = (event) => {
      if (phase === 'puzzle' && !resolved && ['1', '2', '3', '4'].includes(event.key)) {
        const option = OPTIONS[Number(event.key) - 1]
        if (option) handleSelect(option)
      }
      if (event.key === 'Enter') {
        if (phase === 'briefing') setPhase('puzzle')
        if (phase === 'complete') navigate('/levels/2')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleSelect, navigate, phase, resolved])

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      return
    }
    await document.exitFullscreen()
  }

  return (
    <CyberLayout
      status={{
        left: 'SYS://ESCAPE_PROTOCOL/LEVEL_01',
        right: 'LOGIC_ENGINE v2.0',
      }}
    >
      <div ref={terminalRef} className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div data-cinematic className="text-[0.7rem] uppercase tracking-[0.28em] text-ghost">
            SIGNAL NODE 01 // Logic Verification
          </div>
          <div className="flex items-center gap-2">
            <NeonButton variant="muted" className="min-h-9 px-3 py-2 text-[0.62rem]" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Expand className="h-3.5 w-3.5" />}
            </NeonButton>
            {phase === 'briefing' && (
              <NeonButton className="min-h-9 px-3 py-2 text-[0.62rem]" onClick={startPuzzle}>
                <SkipForward className="mr-2 h-3.5 w-3.5" />
                Begin Trial
              </NeonButton>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'boot' && (
            <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TerminalWindow title="SYS://BOOT_SEQUENCE" status="AUTH TRACE: LIVE">
                <TypewriterLog lines={BOOT_LINES} onComplete={handleBootComplete} />
              </TerminalWindow>
            </motion.div>
          )}

          {phase === 'briefing' && (
            <motion.div key="briefing" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TerminalWindow title="MISSION BRIEF" status="DIRECTIVE LOCKED">
                <div className="space-y-4 text-sm leading-8 text-mist/80">
                  <p>You were never listed in this system, {playerName}.</p>
                  <p>Remain online by proving deterministic logic under stress.</p>
                  <p className="text-neon">Objective: decode the sequence and resolve the missing value.</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <NeonButton onClick={startPuzzle}>Initiate Logic Trial</NeonButton>
                  <NeonButton variant="muted" onClick={() => navigate('/mission-hub')}>
                    Return To Mission Hub
                  </NeonButton>
                </div>
              </TerminalWindow>
            </motion.div>
          )}

          {phase === 'puzzle' && (
            <motion.div key="puzzle" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TerminalWindow title="LOGIC TRIAL" status={resolved ? 'SIGNAL STABLE' : 'INPUT REQUIRED'}>
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.2em] text-ghost">Pattern Stream</div>
                    <div className="mt-3 font-display text-[clamp(3rem,8vw,4.4rem)] tracking-[0.18em] text-neon">
                      2 | 4 | 6 | <span className="text-ember">?</span>
                    </div>
                    <div className="mt-3 text-xs uppercase tracking-[0.2em] text-ghost">Select one output to stabilize the channel</div>

                    <PuzzleOptions options={OPTIONS} selectedOption={selectedOption} resolved={resolved} onSelect={handleSelect} />
                  </div>

                  <div className="rounded-md border border-neon/15 bg-black/25 px-4 py-4">
                    <div className="text-[0.66rem] uppercase tracking-[0.22em] text-ghost">Mission Objectives</div>
                    <div className="mt-4 space-y-3 text-xs uppercase tracking-[0.14em]">
                      <div className="flex items-center gap-2 text-neon">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Decode numeric rhythm
                      </div>
                      <div className={`flex items-center gap-2 ${wrongAttempts > 0 ? 'text-ember' : 'text-ghost'}`}>
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Maintain low anomaly count
                      </div>
                      <div className={`flex items-center gap-2 ${resolved ? 'text-neon' : 'text-ghost'}`}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Restore channel stability
                      </div>
                    </div>

                    <div className={`mt-5 min-h-[6rem] space-y-1 text-sm leading-7 ${feedbackClass}`}>
                      {(feedback.length > 0 ? feedback : ['Awaiting validated input.']).map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </div>

                    <div className="mt-5 border-t border-neon/10 pt-3 text-[0.68rem] uppercase tracking-[0.2em] text-ghost">
                      Wrong attempts: {wrongAttempts}
                    </div>
                    {isRecovering && (
                      <div className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-danger">Signal corruption detected...</div>
                    )}
                  </div>
                </div>
              </TerminalWindow>
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TerminalWindow title="SECTOR STABILIZED" status="LEVEL 01 CLEARED">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4 text-sm leading-8 text-mist/80">
                    <p>Logic signature accepted.</p>
                    <p>You are not random noise, {playerName}. You follow structure.</p>
                    <p className="text-neon">Next sector unlocked: Interface Output</p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <NeonButton onClick={() => navigate('/levels/2')}>Continue To Level 02</NeonButton>
                      <NeonButton variant="muted" onClick={() => navigate('/mission-hub')}>
                        Return To Mission Hub
                      </NeonButton>
                    </div>
                  </div>

                  <div className="rounded-md border border-neon/15 bg-black/25 px-4 py-4">
                    <div className="text-[0.66rem] uppercase tracking-[0.22em] text-ghost">Signal Report</div>
                    <div className="mt-3 font-display text-4xl tracking-[0.14em] text-neon">{signal ?? currentLevelState?.signal ?? 'MODERATE'}</div>
                    <div className="mt-4 flex gap-1.5">
                      {Array.from({ length: 5 }, (_, index) => {
                        const bars = getSignalBars(signal ?? currentLevelState?.signal ?? 'MODERATE')
                        return (
                          <div
                            key={index}
                            className={[
                              'h-5 w-4 border',
                              index < bars.level ? bars.color : 'border-neon/20 bg-transparent',
                            ].join(' ')}
                          />
                        )
                      })}
                    </div>
                    <div className="mt-5 space-y-2 text-xs uppercase tracking-[0.16em] text-ghost">
                      <div>Anomaly Count: {wrongAttempts}</div>
                      <div>Response Time: {(timeSpent / 1000).toFixed(2)}s</div>
                    </div>
                  </div>
                </div>
              </TerminalWindow>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CyberLayout>
  )
}
