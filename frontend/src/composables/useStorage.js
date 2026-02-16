import { ref, watch } from 'vue'

const CONVERSATIONS_KEY = 'storyline_conversations'
const SETTINGS_KEY = 'storyline_settings'

const defaultSettings = {
  apiUrl: 'http://localhost:5001',
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxTokens: 2048,
  repeatPenalty: 1.1,
  systemPrompt: 'You are a helpful AI assistant.',
}

export function useStorage() {
  const conversations = ref(loadConversations())
  const settings = ref(loadSettings())

  function loadConversations() {
    try {
      const raw = localStorage.getItem(CONVERSATIONS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings }
    } catch {
      return { ...defaultSettings }
    }
  }

  function saveConversations() {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations.value))
  }

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.value))
  }

  watch(conversations, saveConversations, { deep: true })
  watch(settings, saveSettings, { deep: true })

  function createConversation(title = '新对话') {
    const conv = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    conversations.value.unshift(conv)
    return conv
  }

  function deleteConversation(id) {
    const idx = conversations.value.findIndex((c) => c.id === id)
    if (idx !== -1) conversations.value.splice(idx, 1)
  }

  function renameConversation(id, title) {
    const conv = conversations.value.find((c) => c.id === id)
    if (conv) conv.title = title
  }

  function getConversation(id) {
    return conversations.value.find((c) => c.id === id)
  }

  function resetSettings() {
    settings.value = { ...defaultSettings }
  }

  return {
    conversations,
    settings,
    createConversation,
    deleteConversation,
    renameConversation,
    getConversation,
    resetSettings,
    defaultSettings,
  }
}
