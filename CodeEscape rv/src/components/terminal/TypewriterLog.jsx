import { useEffect, useState } from 'react'

import { cn } from '../../utils/cn'

export function TypewriterLog({
  lines,
  className,
  lineClassName,
  charDelay = 24,
  lineDelay = 220,
  onComplete,
}) {
  const [activeLine, setActiveLine] = useState(0)
  const [renderedLines, setRenderedLines] = useState(lines.map(() => ''))

  useEffect(() => {
    let lineIndex = 0
    let charIndex = 0
    let timeoutId

    const typeNextCharacter = () => {
      const currentLine = lines[lineIndex]
      const nextValue = currentLine.slice(0, charIndex + 1)

      setRenderedLines((previous) =>
        previous.map((line, index) => (index === lineIndex ? nextValue : line)),
      )

      if (charIndex < currentLine.length - 1) {
        charIndex += 1
        timeoutId = window.setTimeout(typeNextCharacter, charDelay)
        return
      }

      if (lineIndex < lines.length - 1) {
        lineIndex += 1
        charIndex = 0
        setActiveLine(lineIndex)
        timeoutId = window.setTimeout(typeNextCharacter, lineDelay)
        return
      }

      onComplete?.()
    }

    timeoutId = window.setTimeout(typeNextCharacter, 180)

    return () => window.clearTimeout(timeoutId)
  }, [charDelay, lineDelay, lines, onComplete])

  return (
    <div className={cn('space-y-3', className)}>
      {renderedLines.map((line, index) => (
        <div
          key={`${index}-${lines[index]}`}
          className={cn(
            'min-h-6 text-sm uppercase tracking-[0.18em] text-mist/90',
            activeLine === index && line.length < lines[index].length && 'after:ml-1 after:inline-block after:h-4 after:w-2 after:animate-caret after:bg-neon after:content-[""]',
            lineClassName,
          )}
        >
          {line}
        </div>
      ))}
    </div>
  )
}
