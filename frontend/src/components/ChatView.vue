<template>
  <div class="chat-view">
    <div v-if="!messages.length" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      </div>
      <h2>Storyline</h2>
      <p>与 Mistral 24B 本地模型对话</p>
      <div class="quick-prompts">
        <button v-for="prompt in quickPrompts" :key="prompt" @click="$emit('send', prompt)">
          {{ prompt }}
        </button>
      </div>
    </div>

    <div v-else class="messages-container" ref="messagesContainer">
      <MessageBubble
        v-for="(msg, idx) in messages"
        :key="msg.id"
        :message="msg"
        :is-last="idx === messages.length - 1 && msg.role === 'assistant'"
        @regenerate="$emit('regenerate')"
      />
      <div ref="scrollAnchor"></div>
    </div>

    <InputArea
      ref="inputRef"
      :is-generating="isGenerating"
      @send="$emit('send', $event)"
      @abort="$emit('abort')"
    />
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import MessageBubble from './MessageBubble.vue'
import InputArea from './InputArea.vue'

const props = defineProps({
  messages: { type: Array, required: true },
  isGenerating: { type: Boolean, default: false },
})

defineEmits(['send', 'regenerate', 'abort'])

const messagesContainer = ref(null)
const scrollAnchor = ref(null)
const inputRef = ref(null)

const quickPrompts = [
  '你好，介绍一下你自己',
  '帮我写一段Python代码',
  '解释一下量子计算',
  '给我讲个有趣的故事',
]

function scrollToBottom() {
  nextTick(() => {
    scrollAnchor.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

// Auto-scroll when messages change
watch(
  () => props.messages.length,
  () => scrollToBottom(),
)

// Auto-scroll during streaming (watch last message content)
watch(
  () => props.messages[props.messages.length - 1]?.content,
  () => {
    if (props.isGenerating) scrollToBottom()
  },
)

defineExpose({
  focusInput: () => inputRef.value?.focus(),
})
</script>
