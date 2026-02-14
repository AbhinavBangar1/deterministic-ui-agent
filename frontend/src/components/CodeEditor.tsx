'use client'

import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
  onCopy?: () => void
}

export function CodeEditor({ code, onChange, onCopy }: CodeEditorProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    if (onCopy) onCopy()
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">

      <div className="p-3 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold text-white">Generated Code</h2>
          <p className="text-xs text-gray-400">Editable React</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="flex-1">
        {code ? (
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => onChange(value || '')}
            theme="vs-dark"
            onMount={(editor, monaco) => {
              monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
                noSyntaxValidation: true,
              })
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">//</p>
              <p className="text-sm">No code generated yet</p>
              <p className="text-xs text-gray-600 mt-1">
                Describe your UI in the chat panel
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
