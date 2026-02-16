<template>
  <div class="message" :class="[message.role]">
    <div class="message-avatar">
      <span v-if="message.role === 'user'">你</span>
      <span v-else>AI</span>
    </div>
    <div class="message-body">
      <div
        v-if="message.role === 'assistant'"
        class="message-content markdown-body"
        v-html="renderedContent"
      ></div>
      <div v-else class="message-content">{{ message.content }}</div>
      <div class="message-actions" v-if="message.role === 'assistant' && message.content">
        <button class="action-btn" @click="copyContent" :title="copied ? '已复制' : '复制'">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          {{ copied ? '已复制' : '复制' }}
        </button>
        <button v-if="isLast" class="action-btn" @click="$emit('regenerate')">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
          </svg>
          重新生成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { renderMarkdown } from '../utils/markdown.js'

const props = defineProps({
  message: { type: Object, required: true },
  isLast: { type: Boolean, default: false },
})

defineEmits(['regenerate'])

const copied = ref(false)

const renderedContent = computed(() => {
  return renderMarkdown(props.message.content)
})

function copyContent() {
  navigator.clipboard.writeText(props.message.content)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
