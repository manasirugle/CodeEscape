import { Link } from 'react-router-dom'

import { CyberLayout } from '../../components/layouts/CyberLayout'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { NeonButton } from '../../components/ui/NeonButton'

export default function ErrorPage() {
  return (
    <CyberLayout status={{ left: 'SYS://ESCAPE_PROTOCOL/ERROR', right: '404_SIGNAL_LOST v2.0' }}>
      <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-4xl items-center justify-center">
        <GlassPanel className="w-full px-8 py-12 text-center">
          <div className="font-display text-6xl tracking-[0.2em] text-danger">404</div>
          <div className="mt-4 font-display text-4xl tracking-[0.16em] text-neon">SIGNAL LOST</div>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-mist/75">
            The requested chamber is outside the mapped escape grid. Route integrity is still intact; we just need to
            get you back onto the main circuit.
          </p>
          <Link to="/" className="mt-8 inline-block">
            <NeonButton>Return To Boot</NeonButton>
          </Link>
        </GlassPanel>
      </div>
    </CyberLayout>
  )
}
