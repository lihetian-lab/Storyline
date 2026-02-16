<template>
  <div class="app-layout">
    <Sidebar
      :conversations="conversations"
      :active-id="activeConversationId"
      :collapsed="sidebarCollapsed"
      :connection-ok="connectionOk"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
      @new-chat="handleNewChat"
      @select="selectConversation"
      @delete="deleteConversation"
      @open-settings="settingsVisible = true"
    />

    <ChatView
      ref="chatViewRef"
      :messages="messages"
      :is-generating="isGenerating"
      @send="sendMessage"
      @regenerate="regenerateLastMessage"
      @abort="abort"
    />

    <SettingsPanel
      :visible="settingsVisible"
      :settings="settings"
      :check-connection="checkConnection"
      @close="settingsVisible = false"
      @reset-settings="resetSettings"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useChat } from './composables/useChat.js'
import Sidebar from './components/Sidebar.vue'
import ChatView from './components/ChatView.vue'
import SettingsPanel from './components/SettingsPanel.vue'

const {
  conversations,
  settings,
  activeConversationId,
  messages,
  isGenerating,
  selectConversation,
  newConversation,
  deleteConversation,
  sendMessage,
  regenerateLastMessage,
  abort,
  checkConnection,
  resetSettings,
} = useChat()

const sidebarCollapsed = ref(false)
const settingsVisible = ref(false)
const chatViewRef = ref(null)
const connectionOk = ref(false)

function handleNewChat() {
  newConversation()
  chatViewRef.value?.focusInput()
}

onMounted(async () => {
  // Check connection on startup
  const result = await checkConnection()
  connectionOk.value = result.ok

  // Auto-select first conversation or create one
  if (conversations.value.length > 0) {
    selectConversation(conversations.value[0].id)
  }
})
</script>
