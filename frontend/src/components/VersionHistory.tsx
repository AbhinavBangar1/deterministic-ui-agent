'use client'

interface Version {
  version: number
  timestamp: string
  userRequest: string
}

interface VersionHistoryProps {
  versions: Version[]
  currentVersion: number | null
  onRollback: (version: number) => void
}

export function VersionHistory({ versions, currentVersion, onRollback }: VersionHistoryProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-4 bg-gray-50 border-l">
      <h3 className="font-semibold text-sm mb-3">Version History</h3>

      {versions.length === 0 ? (
        <p className="text-xs text-gray-400">No versions yet</p>
      ) : (
        <div className="space-y-2">
          {versions.reverse().map((v) => (
            <div
              key={v.version}
              className={`p-2 rounded border text-xs ${
                v.version === currentVersion
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold">v{v.version}</span>
                <span className="text-gray-400">{formatTime(v.timestamp)}</span>
              </div>
              <p className="text-gray-600 truncate">{v.userRequest}</p>
              {v.version !== currentVersion && (
                <button
                  onClick={() => onRollback(v.version)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                >
                  Rollback to this
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
