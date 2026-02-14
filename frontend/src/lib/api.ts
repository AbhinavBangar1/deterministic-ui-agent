const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface GenerateResult {
  success: boolean
  version?: {
    version: number
    timestamp: string
    userRequest: string
    plan: any
    code: string
    explanation: string
  }
  error?: string
  validationErrors?: string[]
}

export async function generateUI(prompt: string, flowType: 'new' | 'modify' = 'new'): Promise<GenerateResult> {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, flowType }),
  })

  return response.json()
}

export async function modifyUI(prompt: string): Promise<GenerateResult> {
  const response = await fetch(`${API_URL}/api/modify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  })

  return response.json()
}

export async function rollback(): Promise<GenerateResult> {
  const response = await fetch(`${API_URL}/api/rollback`, {
    method: 'POST',
  })

  return response.json()
}

export async function getVersions() {
  const response = await fetch(`${API_URL}/api/versions`)
  return response.json()
}

export async function getCurrentVersion() {
  const response = await fetch(`${API_URL}/api/current`)
  return response.json()
}

export async function clearHistory() {
  const response = await fetch(`${API_URL}/api/history`, {
    method: 'DELETE',
  })

  return response.json()
}
