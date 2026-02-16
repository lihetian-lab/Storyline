<template>
  <Teleport to="body">
    <div v-if="visible" class="settings-overlay" @click.self="$emit('close')">
      <div class="settings-panel">
        <div class="settings-header">
          <h2>设置</h2>
          <button class="icon-btn" @click="$emit('close')">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="settings-body">
          <div class="setting-group">
            <h3>连接</h3>
            <label class="setting-item">
              <span class="setting-label">KoboldCpp 地址</span>
              <input type="text" v-model="settings.apiUrl" placeholder="http://localhost:5001" />
            </label>
            <div class="setting-item">
              <button class="check-btn" @click="testConnection" :disabled="testing">
                {{ testing ? '检测中...' : '测试连接' }}
              </button>
              <span v-if="testResult" :class="testResult.ok ? 'text-success' : 'text-error'">
                {{ testResult.ok ? `已连接: ${testResult.model}` : `失败: ${testResult.error}` }}
              </span>
            </div>
          </div>

          <div class="setting-group">
            <h3>系统提示词</h3>
            <label class="setting-item">
              <textarea
                v-model="settings.systemPrompt"
                rows="3"
                placeholder="定义AI助手的角色和行为..."
              ></textarea>
            </label>
          </div>

          <div class="setting-group">
            <h3>生成参数</h3>

            <label class="setting-item">
              <div class="setting-row">
                <span class="setting-label">Temperature</span>
                <span class="setting-value">{{ settings.temperature.toFixed(2) }}</span>
              </div>
              <input
                type="range"
                v-model.number="settings.temperature"
                min="0"
                max="2"
                step="0.05"
              />
              <span class="setting-hint">越低越确定，越高越有创造力</span>
            </label>

            <label class="setting-item">
              <div class="setting-row">
                <span class="setting-label">Top P</span>
                <span class="setting-value">{{ settings.topP.toFixed(2) }}</span>
              </div>
              <input
                type="range"
                v-model.number="settings.topP"
                min="0"
                max="1"
                step="0.05"
              />
            </label>

            <label class="setting-item">
              <div class="setting-row">
                <span class="setting-label">Top K</span>
                <span class="setting-value">{{ settings.topK }}</span>
              </div>
              <input
                type="range"
                v-model.number="settings.topK"
                min="0"
                max="100"
                step="1"
              />
            </label>

            <label class="setting-item">
              <div class="setting-row">
                <span class="setting-label">最大生成长度</span>
                <span class="setting-value">{{ settings.maxTokens }}</span>
              </div>
              <input
                type="range"
                v-model.number="settings.maxTokens"
                min="64"
                max="8192"
                step="64"
              />
            </label>

            <label class="setting-item">
              <div class="setting-row">
                <span class="setting-label">重复惩罚</span>
                <span class="setting-value">{{ settings.repeatPenalty.toFixed(2) }}</span>
              </div>
              <input
                type="range"
                v-model.number="settings.repeatPenalty"
                min="1"
                max="2"
                step="0.05"
              />
            </label>
          </div>

          <div class="setting-group">
            <button class="reset-btn" @click="$emit('reset-settings')">恢复默认设置</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  settings: { type: Object, required: true },
  checkConnection: { type: Function, required: true },
})

defineEmits(['close', 'reset-settings'])

const testing = ref(false)
const testResult = ref(null)

async function testConnection() {
  testing.value = true
  testResult.value = null
  testResult.value = await props.checkConnection()
  testing.value = false
}
</script>
