interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string
      }[]
    }
  }[]
}

export async function callGeminiAPI(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable not set')
  }

  const MODEL = 'gemini-2.5-flash'
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`

  const fullPrompt = `${systemPrompt}\n\n${userMessage}`

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: fullPrompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
        topK: 1,
        topP: 0.8
      }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  const data = (await response.json()) as GeminiResponse

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Invalid response format from Gemini API')
  }

  return text
}

export const callClaudeAPI = callGeminiAPI
