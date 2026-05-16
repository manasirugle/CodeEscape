import gsap from 'gsap'
import { ArrowRight, RefreshCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CyberLayout } from '../../components/layouts/CyberLayout'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { NeonButton } from '../../components/ui/NeonButton'
import { TypewriterLog } from '../../components/terminal/TypewriterLog'
import { useEscapeStore } from '../../store/useEscapeStore'

const BOOT_LINES = [
  'SYS://COLD_BOOT_SEQUENCE',
  'SCANNING ARCHIVE_NODES',
  'BREACH_PROTOCOL VERIFIED',
  'MISSION CONTROL READY',
]

export default function LandingPage() {
  const navigate = useNavigate()
  const shellRef = useRef(null)
  const [logComplete, setLogComplete] = useState(false)
  const selectedLanguage = useEscapeStore((state) => state.selectedLanguage)
  const currentLevel = useEscapeStore((state) => state.currentLevel)
  const setBootSequenceComplete = useEscapeStore((state) => state.setBootSequenceComplete)

  useEffect(() => {
    if (!shellRef.current) {
      return
    }

    gsap.fromTo(
      shellRef.current.querySelectorAll('[data-hero-item]'),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power2.out',
      },
    )
  }, [])

  const handleLaunch = () => {
    setBootSequenceComplete(true)
    navigate('/language-select')
  }

  return (
    <CyberLayout
      status={{
        left: 'SYS://ESCAPE_PROTOCOL/BOOT',
        right: 'ENVIRONMENT_INIT v2.0',
      }}
    >
      <div ref={shellRef} className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl flex-col justify-center">
        <div className="mb-8 text-[0.7rem] uppercase tracking-[0.38em] text-ghost" data-hero-item>
          SYS://UNAUTHORIZED SIGNAL ACQUIRED
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <div data-hero-item>
              <div className="font-display text-[clamp(4rem,12vw,8rem)] leading-none tracking-[0.12em] text-neon drop-shadow-[0_0_28px_rgba(0,255,136,0.35)]">
                CODE ESCAPE ROOM
              </div>
              <div className="mt-3 text-sm uppercase tracking-[0.45em] text-neon-dim animate-flicker">
                HACKER SIMULATION / MISSION CONTROL / DIGITAL BREACH
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-8 text-mist/75 sm:text-base" data-hero-item>
              The chamber has awakened around your signal. Grid ghosts are active, relay walls are listening, and every
              sector is waiting for a precise breach pattern to keep you alive inside the system.
            </p>

            <div className="flex flex-wrap gap-4" data-hero-item>
              <NeonButton onClick={handleLaunch} className="min-w-[15rem]">
                Initiate Environment <ArrowRight className="ml-2 h-4 w-4" />
              </NeonButton>
              <NeonButton
                variant="muted"
                className="min-w-[15rem]"
                onClick={() => navigate(selectedLanguage ? '/mission-hub' : '/language-select')}
              >
                Restore Session <RefreshCcw className="ml-2 h-4 w-4" />
              </NeonButton>
            </div>

            <div className="grid max-w-3xl gap-4 sm:grid-cols-3" data-hero-item>
              {[
                ['Primary Compiler', selectedLanguage?.toUpperCase() ?? 'UNBOUND'],
                ['Mission Pointer', `Level ${String(currentLevel).padStart(2, '0')}`],
                ['Simulation Layer', 'SYNCHRONIZED'],
              ].map(([label, value]) => (
                <GlassPanel key={label} className="px-5 py-4">
                  <div className="text-[0.65rem] uppercase tracking-[0.26em] text-ghost">{label}</div>
                  <div className="mt-2 font-display text-3xl tracking-[0.12em] text-neon">{value}</div>
                </GlassPanel>
              ))}
            </div>
          </div>

          <GlassPanel className="max-w-2xl px-6 py-6 sm:px-8 sm:py-8" data-hero-item>
            <div className="mb-5 flex items-center justify-between border-b border-neon/15 pb-4">
              <div>
                <div className="text-[0.65rem] uppercase tracking-[0.26em] text-ghost">Boot Console</div>
                <div className="mt-1 font-display text-2xl tracking-[0.16em] text-neon">SYS://BOOTSTRAP_ESCAPE_PROTOCOL</div>
              </div>
              <div className="flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-ember/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-neon/80" />
              </div>
            </div>
            <TypewriterLog lines={BOOT_LINES} onComplete={() => setLogComplete(true)} />
            <div className="mt-6 border-t border-neon/15 pt-5 text-xs uppercase tracking-[0.26em] text-ghost">
              {logComplete ? 'STATUS: ENTRY GATE READY FOR COMPILER HANDSHAKE' : 'STATUS: CALIBRATING SIGNAL'}
            </div>
          </GlassPanel>
        </div>
      </div>
    </CyberLayout>
  )
}
