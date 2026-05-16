import { Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { LANGUAGE_OPTIONS } from '../../data/levels'
import { CyberLayout } from '../../components/layouts/CyberLayout'
import { GlassPanel } from '../../components/ui/GlassPanel'
import { NeonButton } from '../../components/ui/NeonButton'
import { useEscapeStore } from '../../store/useEscapeStore'

export default function LanguageSelectPage() {
  const navigate = useNavigate()
  const selectedLanguage = useEscapeStore((state) => state.selectedLanguage)
  const setSelectedLanguage = useEscapeStore((state) => state.setSelectedLanguage)

  const handleSelect = (language) => {
    setSelectedLanguage(language)
    window.setTimeout(() => navigate('/mission-hub'), 120)
  }

  return (
    <CyberLayout
      status={{
        left: 'SYS://ESCAPE_PROTOCOL/INIT',
        right: 'LANG_SELECT v2.0',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center pt-10">
        <header className="mb-12 text-center">
          <div className="font-display text-[clamp(3.5rem,9vw,6.25rem)] leading-none tracking-[0.14em] text-neon drop-shadow-[0_0_24px_rgba(0,255,136,0.35)]">
            SYS://INIT_ENVIRONMENT
          </div>
          <div className="mt-3 text-sm uppercase tracking-[0.45em] text-neon-dim animate-flicker">
            Select Primary Compiler
          </div>
        </header>

        <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-4">
          {LANGUAGE_OPTIONS.map((language, index) => {
            const active = language.id === 'python'
            const isSelected = selectedLanguage === language.id

            return (
              <motion.div
                key={language.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.36 }}
              >
                <GlassPanel
                  className={[
                    'flex min-h-[18rem] flex-col items-center justify-center px-7 py-8 text-center transition duration-300',
                    active
                      ? 'border-neon/50 hover:-translate-y-1.5 hover:border-neon hover:shadow-neon'
                      : 'border-neon/10 opacity-40 grayscale',
                  ].join(' ')}
                >
                  <div className="font-display text-6xl text-neon drop-shadow-[0_0_18px_rgba(0,255,136,0.3)]">{language.icon}</div>
                  <div className="mt-5 font-display text-[2.2rem] tracking-[0.16em] text-neon">{language.label}</div>
                  <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-neon-dim/60 to-transparent" />

                  {active ? (
                    <>
                      <div className="mb-5 text-[0.68rem] uppercase tracking-[0.22em] text-ghost">
                        {isSelected ? 'Handshake primed' : 'Signal detected'}
                      </div>
                      <NeonButton className="w-full" onClick={() => handleSelect(language.id)}>
                        {isSelected ? 'Reconnect ->' : 'Connect ->'}
                      </NeonButton>
                    </>
                  ) : (
                    <div className="mt-4 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-ghost">
                      <Lock className="h-3.5 w-3.5" />
                      Status: Coming Soon
                    </div>
                  )}
                </GlassPanel>
              </motion.div>
            )
          })}
        </div>
      </div>
    </CyberLayout>
  )
}
