<template>
  <div class="input-area">
    <div class="input-wrapper">
      <textarea
        ref="textareaRef"
        v-model="input"
        @keydown="handleKeydown"
        @input="autoResize"
        placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
        rows="1"
        :disabled="isGenerating"
      ></textarea>
      <button
        v-if="isGenerating"
        class="send-btn stop-btn"
        @click="$emit('abort')"
        title="停止生成"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="2"/>
        </svg>
      </button>
      <button
        v-else
        class="send-btn"
        @click="send"
        :disabled="!input.trim()"
        title="发送"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
    <div class="input-hint">
      Mistral 24B · KoboldCpp
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

defineProps({
  isGenerating: { type: Boolean, default: false },
})

const emit = defineEmits(['send', 'abort'])

const input = ref('')
const textareaRef = ref(null)

function send() {
  if (!input.value.trim()) return
  emit('send', input.value)
  input.value = ''
  nextTick(() => autoResize())
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 200) + 'px'
}

function focus() {
  textareaRef.value?.focus()
}

defineExpose({ focus })
</script>
