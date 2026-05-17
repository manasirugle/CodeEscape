import { motion } from 'framer-motion'
import { ArrowRight, AlertTriangle, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { CyberLayout } from '../../components/layouts/CyberLayout'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { LEVELS, LEVEL_COUNT } from '../../data/levels'
import { useEscapeStore } from '../../store/useEscapeStore'

export default function MissionHubPage() {
  const navigate = useNavigate()
  const selectedLanguage = useEscapeStore((state) => state.selectedLanguage)
  const levels = useEscapeStore((state) => state.levels)
  const unlockedLevels = useEscapeStore((state) => state.unlockedLevels ?? [1])
  const totalXp = useEscapeStore((state) => state.totalXp ?? 0)
  const totalAttempts = useEscapeStore((state) => state.totalAttempts ?? 0)
  const markLevelStarted = useEscapeStore((state) => state.markLevelStarted)

  const completedCount = LEVELS.filter((level) => levels[level.id]?.completed).length

  const handleEnter = (levelId) => {
    markLevelStarted(levelId)
    navigate(`/levels/${levelId}`)
  }

  return (
    <CyberLayout
      status={{
        left: 'SYS://ESCAPE_PROTOCOL/HUB',
        right: 'MISSION_SELECT v2.0',
      }}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center">
          <div className="text-[0.7rem] uppercase tracking-[0.34em] text-ghost">
            SYS://{LEVEL_COUNT} LEVELS DETECTED / COMPILER {(selectedLanguage ?? 'unbound').toUpperCase()}
          </div>
          <div className="mt-3 font-display text-[clamp(3.5rem,9vw,6.2rem)] leading-none tracking-[0.12em] text-neon drop-shadow-[0_0_24px_rgba(0,255,136,0.35)]">
            CODE ESCAPE ROOM
          </div>
          <div className="mt-2 text-sm uppercase tracking-[0.45em] text-neon-dim">Select Your Mission</div>
        </header>

        <GlassPanel className="mx-auto mb-12 max-w-3xl px-6 py-6">
          <div className="text-center text-[0.72rem] uppercase tracking-[0.26em] text-ghost">
            Sectors Stabilized: {completedCount} / {LEVEL_COUNT}
          </div>
          <div className="mt-4 h-3 rounded-full border border-neon/20 bg-neon/5 p-1">
            <div
              className="h-full rounded-full bg-neon shadow-neon transition-all duration-700"
              style={{ width: `${(completedCount / LEVEL_COUNT) * 100}%` }}
            />
          </div>
          <div className="mt-4 grid gap-2 text-center text-xs uppercase tracking-[0.2em] text-ghost sm:grid-cols-3">
            <div>Total XP: <span className="text-neon">{totalXp}</span></div>
            <div>Unlocked: <span className="text-neon">{unlockedLevels.length}</span></div>
            <div>Attempts: <span className="text-neon">{totalAttempts}</span></div>
          </div>
        </GlassPanel>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {LEVELS.map((level, index) => {
            const levelState = levels[level.id]
            const isUnlocked = unlockedLevels.includes(level.id)
            const isCompleted = levelState?.completed
            const isInProgress = levelState?.started && !isCompleted

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.045, duration: 0.3 }}
              >
                <GlassPanel
                  className={[
                    'flex min-h-[17.5rem] flex-col px-6 py-6 transition duration-300',
                    isUnlocked ? 'border-neon/35 hover:-translate-y-1.5 hover:border-neon hover:shadow-neon' : 'border-neon/10 opacity-35 grayscale',
                  ].join(' ')}
                >
                  <div className="mb-2 text-[0.68rem] uppercase tracking-[0.22em] text-ghost">
                    {isCompleted ? 'Sector stabilized' : isInProgress ? 'Signal retained' : isUnlocked ? 'Ready for breach' : 'Locked'}
                  </div>
                  <div className="font-display text-4xl tracking-[0.12em] text-neon">{level.code}</div>
                  <div className="mt-2 text-lg text-mist">{level.name}</div>
                  <div className="my-5 h-px bg-gradient-to-r from-neon-dim/70 to-transparent" />
                  <div className="mt-auto space-y-1 text-[0.72rem] uppercase tracking-[0.2em] text-ghost">
                    <div>Skill // {level.skill}</div>
                    <div>Concept // {level.concept}</div>
                    <div>XP // {level.xpReward}</div>
                  </div>

                  <div className="mt-6 flex min-h-[3rem] flex-col justify-end gap-2">
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-neon">
                        <RotateCcw className="h-3.5 w-3.5" />
                        Re-enter Sector
                      </div>
                    )}
                    {isInProgress && (
                      <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-ember">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Breach in progress
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() => handleEnter(level.id)}
                      className={[
                        'mt-2 inline-flex min-h-12 items-center justify-center border px-4 py-3 font-mono text-xs uppercase tracking-[0.26em] transition duration-300',
                        isUnlocked
                          ? 'border-neon/80 text-neon hover:bg-neon hover:text-abyss hover:shadow-neon'
                          : 'cursor-not-allowed border-neon/10 text-ghost',
                      ].join(' ')}
                    >
                      {isCompleted ? 'Re-enter' : isInProgress ? 'Resume' : isUnlocked ? 'Enter' : 'Locked'}
                      {isUnlocked && <ArrowRight className="ml-2 h-4 w-4" />}
                    </button>
                  </div>
                </GlassPanel>
              </motion.div>
            )
          })}
        </div>
      </div>
    </CyberLayout>
  )
}
