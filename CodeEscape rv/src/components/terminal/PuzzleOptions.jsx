export function PuzzleOptions({ options, selectedOption, resolved, onSelect }) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {options.map((option, index) => {
        const isSelected = selectedOption === option.id
        const wrong = isSelected && !option.correct && !resolved
        const correct = resolved && option.correct
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option)}
            className={[
              'min-h-12 border px-4 py-3 text-left font-mono text-sm uppercase tracking-[0.14em] transition',
              correct
                ? 'border-neon bg-neon/15 text-neon shadow-neon'
                : wrong
                ? 'border-danger bg-danger/15 text-danger'
                : 'border-neon/25 bg-black/20 text-mist hover:border-neon/70 hover:text-neon',
            ].join(' ')}
          >
            <span className="mr-3 text-ghost">{index + 1}.</span>
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
