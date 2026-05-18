import { GlassPanel } from '../../../components/ui/GlassPanel'

export function ConceptPanel({ title, summary, notes = [], visualizations = [] }) {
  return (
    <GlassPanel className="px-5 py-5">
      <div className="mb-2 text-xs uppercase tracking-[0.2em] text-ghost">{title}</div>
      <p className="text-sm leading-7 text-mist/85">{summary}</p>
      {notes.length ? (
        <ul className="mt-3 space-y-2 text-sm leading-7 text-mist/80">
          {notes.map((note, index) => (
            <li key={`${index}-${note}`}>- {note}</li>
          ))}
        </ul>
      ) : null}
      {visualizations.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {visualizations.map((item, idx) => (
            <div key={`${item.label}-${idx}`} className="rounded-md border border-neon/15 bg-black/25 px-3 py-3">
              <div className="text-[0.65rem] uppercase tracking-[0.16em] text-ghost">{item.label}</div>
              <div className="mt-1 text-lg text-neon">{item.value}</div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-4 rounded-md border border-neon/10 bg-black/25 px-3 py-3 text-xs uppercase tracking-[0.14em] text-ghost">
        Terminal narration stream initialized.
      </div>
    </GlassPanel>
  )
}
