import Editor from '@monaco-editor/react'
import { Play, RotateCcw } from 'lucide-react'

import { GlassPanel } from '../../../components/ui/GlassPanel'
import { NeonButton } from '../../../components/ui/NeonButton'

export function DebuggingPanel({
  instructions,
  explanation,
  code,
  onCodeChange,
  onRun,
  onReset,
  isRunning,
  output,
}) {
  return (
    <>
      <GlassPanel className="px-5 py-5">
        <div className="mb-2 text-xs uppercase tracking-[0.2em] text-ghost">Debugging Challenge</div>
        <p className="text-sm leading-7 text-mist/85">{instructions}</p>
        <div className="mt-3 rounded-md border border-neon/10 bg-black/25 px-3 py-3 text-sm leading-7 text-mist/75">
          {explanation}
        </div>
      </GlassPanel>

      <GlassPanel className="overflow-hidden">
        <div className="border-b border-neon/15 px-4 py-3 text-xs uppercase tracking-[0.2em] text-ghost">
          Broken Code Editor
        </div>
        <Editor
          height="300px"
          defaultLanguage="python"
          value={code}
          onChange={(value) => onCodeChange(value ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: 'Share Tech Mono',
          }}
          theme="vs-dark"
        />
      </GlassPanel>

      <div className="flex flex-wrap gap-3">
        <NeonButton onClick={onRun} disabled={isRunning}>
          <Play className="mr-2 h-4 w-4" />
          {isRunning ? 'Running...' : 'Validate Fix'}
        </NeonButton>
        <NeonButton variant="muted" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Broken Code
        </NeonButton>
      </div>

      <GlassPanel className="px-4 py-4">
        <div className="mb-2 text-xs uppercase tracking-[0.2em] text-ghost">Debug Output</div>
        <pre className="min-h-[90px] whitespace-pre-wrap text-sm text-mist/85">
          {output || 'Run validation after applying your fix.'}
        </pre>
      </GlassPanel>
    </>
  )
}
