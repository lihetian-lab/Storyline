import { Marked } from 'marked'
import hljs from 'highlight.js'

const marked = new Marked({
  breaks: true,
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
      const highlighted = hljs.highlight(text, { language }).value
      return `<div class="code-block">
        <div class="code-header">
          <span class="code-lang">${language}</span>
          <button class="copy-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(text)}'))">复制</button>
        </div>
        <pre><code class="hljs language-${language}">${highlighted}</code></pre>
      </div>`
    },
  },
})

export function renderMarkdown(text) {
  if (!text) return ''
  return marked.parse(text)
}
