import { ref, computed } from 'vue'
import { useStorage } from './useStorage.js'
import { useKoboldApi } from './useKoboldApi.js'

export function useChat() {
  const storage = useStorage()
  const api = useKoboldApi(storage.settings)
  const activeConversationId = ref(null)

  const activeConversation = computed(() => {
    if (!activeConversationId.value) return null
    return storage.getConversation(activeConversationId.value)
  })

  const messages = computed(() => {
    return activeConversation.value?.messages || []
  })

  function selectConversation(id) {
    activeConversationId.value = id
  }

  function newConversation() {
    const conv = storage.createConversation()
    activeConversationId.value = conv.id
    return conv
  }

  function deleteConversation(id) {
    storage.deleteConversation(id)
    if (activeConversationId.value === id) {
      activeConversationId.value = storage.conversations.value[0]?.id || null
    }
  }

  async function sendMessage(content) {
    if (!content.trim()) return
    if (!activeConversation.value) {
      newConversation()
    }

    const conv = activeConversation.value

    // Add user message
    conv.messages.push({
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    })

    // Auto-title from first message
    if (conv.messages.length === 1) {
      conv.title = content.trim().slice(0, 30) + (content.length > 30 ? '...' : '')
    }

    // Add placeholder assistant message
    const assistantMsg = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    conv.messages.push(assistantMsg)
    conv.updatedAt = Date.now()

    // Stream response
    try {
      const chatMessages = conv.messages
        .filter((m) => m.role === 'user' || (m.role === 'assistant' && m.content))
        .slice(0, -1) // exclude the empty placeholder

      for await (const chunk of api.streamChat(chatMessages)) {
        assistantMsg.content += chunk
      }
    } catch (err) {
      if (!assistantMsg.content) {
        assistantMsg.content = `⚠️ 生成失败: ${err.message}`
      }
    }

    conv.updatedAt = Date.now()
  }

  function regenerateLastMessage() {
    const conv = activeConversation.value
    if (!conv || conv.messages.length < 2) return

    // Remove last assistant message
    const lastMsg = conv.messages[conv.messages.length - 1]
    if (lastMsg.role === 'assistant') {
      conv.messages.pop()
    }

    // Get the last user message
    const lastUserMsg = [...conv.messages].reverse().find((m) => m.role === 'user')
    if (!lastUserMsg) return

    // Re-send by creating a new assistant placeholder and streaming
    const assistantMsg = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    conv.messages.push(assistantMsg)

    const chatMessages = conv.messages
      .filter((m) => m.role === 'user' || (m.role === 'assistant' && m.content))
      .slice(0, -1)

    ;(async () => {
      try {
        for await (const chunk of api.streamChat(chatMessages)) {
          assistantMsg.content += chunk
        }
      } catch (err) {
        if (!assistantMsg.content) {
          assistantMsg.content = `⚠️ 生成失败: ${err.message}`
        }
      }
      conv.updatedAt = Date.now()
    })()
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
  }

  return {
    ...storage,
    ...api,
    activeConversationId,
    activeConversation,
    messages,
    selectConversation,
    newConversation,
    deleteConversation,
    sendMessage,
    regenerateLastMessage,
  }
}
