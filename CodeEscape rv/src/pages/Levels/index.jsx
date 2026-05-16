import { ArrowLeft, LockKeyhole, Radar } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import { CyberLayout } from '../../components/layouts/CyberLayout'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { NeonButton } from '../../components/ui/NeonButton'
import { LEVELS } from '../../data/levels'
import { useEscapeStore } from '../../store/useEscapeStore'
import Level1Mission from './Level1Mission'

export default function LevelGatewayPage() {
  const { levelId } = useParams()
  const numericId = Number(levelId)
  const currentLevel = useEscapeStore((state) => state.currentLevel)
  const selectedLanguage = useEscapeStore((state) => state.selectedLanguage)

  const level = useMemo(() => LEVELS.find((entry) => entry.id === numericId), [numericId])

  if (!level) {
    return (
      <CyberLayout status={{ left: 'SYS://ESCAPE_PROTOCOL/404', right: 'MISSION_NULL v2.0' }}>
        <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-3xl items-center justify-center">
          <GlassPanel className="w-full px-8 py-10 text-center">
            <div className="font-display text-5xl tracking-[0.16em] text-danger">MISSION NOT FOUND</div>
            <div className="mt-4 text-sm uppercase tracking-[0.24em] text-ghost">Invalid chamber identifier</div>
            <Link to="/mission-hub" className="mt-8 inline-block">
              <NeonButton>Return To Hub</NeonButton>
            </Link>
          </GlassPanel>
        </div>
      </CyberLayout>
    )
  }

  if (level.id === 1) {
    return <Level1Mission />
  }

  return (
    <CyberLayout
      status={{
        left: `SYS://ESCAPE_PROTOCOL/${level.code.replace(' ', '_')}`,
        right: 'LEVEL_GATEWAY v2.0',
      }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-5xl flex-col justify-center">
        <Link to="/mission-hub" className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-ghost transition hover:text-neon">
          <ArrowLeft className="h-4 w-4" />
          Back To Mission Hub
        </Link>

        <GlassPanel className="overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="border-b border-neon/12 px-8 py-8 lg:border-b-0 lg:border-r">
              <div className="text-[0.7rem] uppercase tracking-[0.3em] text-ghost">Sector Dossier</div>
              <div className="mt-3 font-display text-5xl tracking-[0.16em] text-neon">{level.code}</div>
              <div className="mt-3 text-2xl text-mist">{level.name}</div>
              <div className="mt-6 max-w-2xl space-y-4 text-sm leading-8 text-mist/75">
                <p>
                  This chamber is shielded behind an adaptive firewall. The relay accepts your signature, but only after
                  Sector 01 confirms your logic trace.
                </p>
                <p>
                  Keep your compiler locked and your anomaly count low. The next breach window opens automatically when
                  prior signal verification is complete.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['Compiler', selectedLanguage?.toUpperCase() ?? 'UNBOUND'],
                  ['Progress Pointer', `Level ${String(currentLevel).padStart(2, '0')}`],
                  ['Concept', level.skill],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-neon/15 bg-black/20 px-4 py-4">
                    <div className="text-[0.65rem] uppercase tracking-[0.24em] text-ghost">{label}</div>
                    <div className="mt-2 text-sm uppercase tracking-[0.18em] text-neon">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-8 py-8">
              <div className="mb-5 flex items-center gap-3 text-neon">
                <Radar className="h-5 w-5" />
                <div className="text-sm uppercase tracking-[0.24em]">Access Conditions</div>
              </div>

              <div className="space-y-4 text-sm leading-7 text-mist/75">
                <div className="rounded-md border border-neon/15 bg-black/25 px-4 py-4">
                  1. Stabilize preceding sector trace.
                </div>
                <div className="rounded-md border border-neon/15 bg-black/25 px-4 py-4">
                  2. Preserve compiler handshake continuity.
                </div>
                <div className="rounded-md border border-neon/15 bg-black/25 px-4 py-4">
                  3. Enter on green-status mission channel.
                </div>
              </div>

              <div className="mt-8 rounded-md border border-ember/25 bg-ember/8 px-4 py-4 text-sm leading-7 text-ember">
                <div className="mb-2 flex items-center gap-2 uppercase tracking-[0.18em]">
                  <LockKeyhole className="h-4 w-4" />
                  Sector Seal
                </div>
                This chamber is currently sealed by protocol. Continue mission progression to unlock direct infiltration.
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </CyberLayout>
  )
}
