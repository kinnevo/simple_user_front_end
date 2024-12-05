<!-- ChatBox.vue -->
<template>
  <div class="chat-container">
    <div class="messages-container" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index"
        :class="['message', message.role === 'user' ? 'user-message' : 'assistant-message']">
        <div class="message-content" v-html="message.content"></div>
      </div>
      <div v-if="isLoading" class="loading-indicator">
        <span>Thinking...</span>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="input-container">
      <textarea ref="textareaRef" v-model="userInput" @keyup.enter.exact.prevent="sendMessage"
        placeholder="Type your message..." :disabled="isLoading"></textarea>
      <button type="submit" :disabled="isLoading || !userInput.trim()">
        Send
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useSessionStore } from '@/stores/session'

interface ChatBoxProps {
  systemPromptID: string;
}

const props = defineProps<ChatBoxProps>()


const userInput = ref('')
const messages = ref<Array<{ role: 'user' | 'assistant', content: string }>>([])
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const config = useRuntimeConfig()
const sessionStore = useSessionStore()
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const processMarkup = (text: string): string => {
  let processed = escapeHtml(text)

  // Process code blocks with language specification
  processed = processed.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, lang, code) => {
      const language = lang || ''
      return `<pre class="code-block ${language}"><code>${code}</code></pre>`
    }
  )

  // Process inline code
  processed = processed.replace(
    /`([^`]+)`/g,
    '<code class="inline-code">$1</code>'
  )

  // Process bold text
  processed = processed.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong>$1</strong>'
  )

  // Process italic text
  processed = processed.replace(
    /\*([^*]+)\*/g,
    '<em>$1</em>'
  )

  // Process underline
  processed = processed.replace(
    /__([^_]+)__/g,
    '<u>$1</u>'
  )

  // Process links
  processed = processed.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  )

  // Process lists
  processed = processed.replace(
    /^\s*[-*+]\s+(.+)$/gm,
    '<li>$1</li>'
  )
  processed = processed.replace(
    /((?:<li>.*<\/li>\n?)+)/g,
    '<ul>$1</ul>'
  )

  // Process numbered lists
  processed = processed.replace(
    /^\s*(\d+)\.\s+(.+)$/gm,
    '<li>$2</li>'
  )
  processed = processed.replace(
    /((?:<li>.*<\/li>\n?)+)/g,
    '<ol>$1</ol>'
  )

  // Process headers
  processed = processed.replace(
    /^(#{1,6})\s+(.+)$/gm,
    (match, hashes, content) => {
      const level = hashes.length
      return `<h${level}>${content}</h${level}>`
    }
  )

  return processed
}

const preserveFormatting = (text: string): string => {
  let formatted = processMarkup(text)

  formatted = formatted.replace(/ {2,}/g, (match) => {
    return '&nbsp;'.repeat(match.length)
  })

  return formatted
    .split('\n')
    .map(line => {
      return line.replace(/^( +)/g, (match) => {
        return '&nbsp;'.repeat(match.length)
      })
    })
    .join('<br>\n')
}

const stripFormatting = (text: string): string => {
  const div = document.createElement('div')
  div.innerHTML = text
  return div.textContent || div.innerText || ''
}

watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { deep: true })

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = userInput.value.trim()
  messages.value.push({
    role: 'user',
    content: preserveFormatting(userMessage)
  })

  userInput.value = ''
  isLoading.value = true

  try {
    const response = await fetch('http://localhost:8000/api/chat/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: stripFormatting(userMessage),
        system_prompt: props.systemPromptID,
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1000,
        session_id: sessionStore.sessionId
      })
    })

    const data = await response.json()

    if (!response.ok || data.error) {
      throw new Error(
        data.error?.message ||
        data.response ||
        `API request failed with status ${response.status}`
      )
    }

    if (data.error) {
      throw new Error('Invalid response format from API')
    }

    messages.value.push({
      role: 'assistant',
      content: preserveFormatting(data.response)
    })

  } catch (error: any) {
    console.error('Error calling Chat API:', error)
    messages.value.push({
      role: 'assistant',
      content: preserveFormatting(`Error: ${error.message || 'An unexpected error occurred'}`)
    })
  } finally {
    isLoading.value = false
    await nextTick()
    textareaRef.value?.focus()
  }
}
</script>

<style scoped>
/* Styles remain unchanged */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  max-width: 80%;
  padding: 0.75rem;
  border-radius: 8px;
}

.user-message {
  align-self: flex-end;
  background-color: #3b82f6;
  color: white;
}

.assistant-message {
  align-self: flex-start;
  background-color: #f3f4f6;
  color: black;
}

.message-content {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-content :deep(code) {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.message-content :deep(.code-block) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 1em;
  border-radius: 6px;
  margin: 0.5em 0;
  overflow-x: auto;
}

.message-content :deep(pre) {
  margin: 0;
}

.message-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}

.message-content :deep(ul),
.message-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.message-content :deep(li) {
  margin: 0.25em 0;
}

.message-content :deep(h1),
.message-content :deep(h2),
.message-content :deep(h3),
.message-content :deep(h4),
.message-content :deep(h5),
.message-content :deep(h6) {
  margin: 0.5em 0;
  font-weight: bold;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

textarea {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  resize: none;
  height: 60px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.loading-indicator {
  align-self: center;
  color: #6b7280;
  font-style: italic;
}
</style>