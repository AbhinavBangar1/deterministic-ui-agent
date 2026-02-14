'use client'

import { useState, useEffect } from 'react'
import { ChatPanel } from '@/components/ChatPanel'
import { CodeEditor } from '@/components/CodeEditor'
import { PreviewPanel } from '@/components/PreviewPanel'
import { VersionHistory } from '@/components/VersionHistory'
import { generateUI, rollback, getVersions } from '@/lib/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [versions, setVersions] = useState<any[]>([])
  const [currentVersion, setCurrentVersion] = useState<number | null>(null)
  const [showVersions, setShowVersions] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  // Load versions
  const loadVersions = async () => {
    try {
      const result = await getVersions()
      if (result.success) {
        setVersions(result.versions || [])
      }
    } catch (error) {
      console.error('Error loading versions:', error)
    }
  }

  useEffect(() => {
    loadVersions()
  }, [])

  const handleSend = async (prompt: string) => {
    setMessages([...messages, { role: 'user', content: prompt }])
    setLoading(true)

    try {
      const flowType = hasGenerated ? 'modify' : 'new'
      const result = await generateUI(prompt, flowType)

      if (result.success && result.version) {
        setCode(result.version.code)
        setCurrentVersion(result.version.version)
        setHasGenerated(true)

        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: result.version!.explanation
          }
        ])


        await loadVersions()
      } else {

        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Error: ${result.error || 'Unknown error'}\n${
              result.validationErrors ? '\nValidation errors:\n' + result.validationErrors.join('\n') : ''
            }`
          }
        ])
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleRollback = async (version: number) => {
    try {
      const result = await rollback()
      if (result.success && result.version) {
        setCode(result.version.code)
        setCurrentVersion(result.version.version)
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Rolled back to version ${result.version!.version}`
          }
        ])
        await loadVersions()
      }
    } catch (error) {
      console.error('Rollback error:', error)
    }
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center px-6 shadow-lg">
        <div className="flex-1">
          <h1 className="text-lg font-bold">Deterministic UI Generator</h1>
          <p className="text-xs text-blue-100"></p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded transition-colors"
          >
            {showVersions ? 'Hide' : 'Show'} Versions
          </button>
        </div>
      </div>


      <div className="flex-1 flex overflow-hidden">

        <div className="w-1/3 border-r">
          <ChatPanel onSend={handleSend} messages={messages} loading={loading} />
        </div>

        <div className="w-1/3 border-r">
          <CodeEditor code={code} onChange={handleCodeChange} />
        </div>

        <div className={showVersions ? 'w-1/4' : 'w-1/3'}>
          <PreviewPanel code={code} />
        </div>

        {showVersions && (
          <div className="w-1/4">
            <VersionHistory
              versions={versions}
              currentVersion={currentVersion}
              onRollback={handleRollback}
            />
          </div>
        )}
      </div>

      <div className="h-6 bg-gray-800 text-gray-400 text-xs flex items-center px-4 gap-4">
        <span>Status: {loading ? 'Generating...' : '✓ Ready'}</span>
        {currentVersion !== null && <span>Version: {currentVersion}</span>}
        <span className="ml-auto">Deterministic UI Generator</span>
      </div>
    </div>
  )
}
