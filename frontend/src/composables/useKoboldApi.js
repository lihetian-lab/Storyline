import { ref } from 'vue'

export function useKoboldApi(settings) {
  const isGenerating = ref(false)
  const error = ref(null)
  let abortController = null

  function getBaseUrl() {
    // In dev mode, use the Vite proxy (relative path)
    // In production, use the configured URL
    const url = settings.value.apiUrl
    if (url === 'http://localhost:5001' || url === 'http://127.0.0.1:5001') {
      return ''  // use Vite proxy
    }
    return url
  }

  async function *streamChat(messages) {
    isGenerating.value = true
    error.value = null
    abortController = new AbortController()

    try {
      const baseUrl = getBaseUrl()
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          messages: buildMessages(messages),
          max_tokens: settings.value.maxTokens,
          temperature: settings.value.temperature,
          top_p: settings.value.topP,
          top_k: settings.value.topK,
          repeat_penalty: settings.value.repeatPenalty,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data:')) continue
          const data = trimmed.slice(5).trim()
          if (data === '[DONE]') return

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) yield content
          } catch {
            // skip malformed JSON chunks
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err.message
        throw err
      }
    } finally {
      isGenerating.value = false
      abortController = null
    }
  }

  function buildMessages(messages) {
    const result = []
    if (settings.value.systemPrompt) {
      result.push({ role: 'system', content: settings.value.systemPrompt })
    }
    for (const msg of messages) {
      result.push({ role: msg.role, content: msg.content })
    }
    return result
  }

  function abort() {
    if (abortController) {
      abortController.abort()
      isGenerating.value = false
    }
  }

  async function checkConnection() {
    try {
      const baseUrl = getBaseUrl()
      const res = await fetch(`${baseUrl}/api/v1/model`, { signal: AbortSignal.timeout(5000) })
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` }
      const data = await res.json()
      return { ok: true, model: data.result }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  return {
    isGenerating,
    error,
    streamChat,
    abort,
    checkConnection,
  }
}
