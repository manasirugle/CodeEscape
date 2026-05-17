import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { CyberLayout } from '../../components/layouts/CyberLayout'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { NeonButton } from '../../components/ui/NeonButton'
import { getPythonLevelById } from '../../levels/python'
import { useEscapeStore } from '../../store/useEscapeStore'
import { LevelRuntime } from '../../systems/levelEngine/LevelRuntime'

export default function LevelPage() {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const numericLevelId = Number(levelId)
  const level = getPythonLevelById(numericLevelId)
  const unlockedLevels = useEscapeStore((state) => state.unlockedLevels ?? [1])
  const isUnlocked = unlockedLevels.includes(numericLevelId)

  if (!level) {
    return (
      <CyberLayout status={{ left: 'SYS://LEARNING/404', right: 'LEVEL_NOT_FOUND' }}>
        <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-3xl items-center justify-center">
          <GlassPanel className="w-full px-8 py-10 text-center">
            <div className="font-display text-5xl tracking-[0.16em] text-danger">LEVEL NOT FOUND</div>
            <div className="mt-4 text-sm uppercase tracking-[0.24em] text-ghost">
              This learning sector is not configured yet.
            </div>
            <Link to="/mission-hub" className="mt-8 inline-block">
              <NeonButton>Return To Hub</NeonButton>
            </Link>
          </GlassPanel>
        </div>
      </CyberLayout>
    )
  }

  if (!isUnlocked) {
    return (
      <CyberLayout status={{ left: `SYS://LEARNING/${level.code}`, right: 'SECTOR_LOCKED' }}>
        <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-4xl flex-col justify-center">
          <Link
            to="/mission-hub"
            className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-ghost transition hover:text-neon"
          >
            <ArrowLeft className="h-4 w-4" />
            Back To Mission Hub
          </Link>
          <GlassPanel className="px-8 py-8">
            <div className="mb-4 flex items-center gap-2 text-ember">
              <LockKeyhole className="h-4 w-4" />
              <div className="text-xs uppercase tracking-[0.2em]">Learning Sector Locked</div>
            </div>
            <h2 className="font-display text-4xl tracking-[0.12em] text-neon">{level.title.toUpperCase()}</h2>
            <p className="mt-3 text-sm leading-7 text-mist/80">
              Complete earlier lessons to unlock this concept.
            </p>
            <div className="mt-5">
              <NeonButton onClick={() => navigate('/mission-hub')}>Return To Hub</NeonButton>
            </div>
          </GlassPanel>
        </div>
      </CyberLayout>
    )
  }

  return <LevelRuntime level={level} />
}

