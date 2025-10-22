// src/pages/NewPost.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../lib/api.js'

const DRAFT_KEY = 'newpost_draft_v1'
const TITLE_MAX = 80
const CONTENT_MIN = 10

export default function NewPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const dirtyRef = useRef(false)

  // 载入草稿
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      try {
        const d = JSON.parse(raw)
        setTitle(d.title || '')
        setContent(d.content || '')
      } catch {}
    }
  }, [])

  // 保存草稿
  useEffect(() => {
    const data = { title, content }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    dirtyRef.current = (title.trim().length > 0 || content.trim().length > 0)
  }, [title, content])

  // 离开提醒（有未提交内容）
  useEffect(() => {
    const handler = (e) => {
      if (dirtyRef.current && !loading) {
        e.preventDefault()
        e.returnValue = '' // 触发浏览器确认
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [loading])

  const tLen = title.length
  const cLen = content.length

  const canSubmit = useMemo(() => {
    const t = title.trim()
    const c = content.trim()
    return t.length >= 3 && t.length <= TITLE_MAX && c.length >= CONTENT_MIN
  }, [title, content])

  async function onSubmit(e) {
    e.preventDefault()
    if (!canSubmit || loading) return
    setErr('')
    setLoading(true)
    try {
      const created = await createPost({
        title: title.trim(),
        content: content.trim(),
      })
      localStorage.removeItem(DRAFT_KEY)
      dirtyRef.current = false
      nav(`/posts/${created.id}`)
    } catch (e) {
      // 简化后的错误渲染
      const msg = (e && e.message) ? String(e.message) : 'Create failed'
      setErr(msg.includes('Unauthorized') || msg.includes('401') ? '未登录或登录已过期，请重新登录。' : msg)
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e) {
    const mod = e.ctrlKey || e.metaKey
    if (mod && e.key === 'Enter') {
      onSubmit(e)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h2 style={{ marginTop: 0 }}>New Post</h2>

      <form onSubmit={onSubmit} onKeyDown={onKeyDown} className="form" style={{ display: 'grid', gap: 12 }}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
          required
          className="input"
          autoFocus
          aria-invalid={tLen > TITLE_MAX || tLen < 3}
        />
        <div className="muted" style={{ fontSize: 12 }}>
          {tLen} / {TITLE_MAX}
        </div>

        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          required
          className="textarea"
          aria-invalid={cLen < CONTENT_MIN}
        />
        <div className="muted" style={{ fontSize: 12 }}>
          {cLen} chars（至少 {CONTENT_MIN}）
        </div>

        {err && <p className="error" role="alert">{err}</p>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" disabled={!canSubmit || loading}>
            {loading ? 'Publishing…' : 'Publish'}
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => { localStorage.removeItem(DRAFT_KEY); setTitle(''); setContent('') }}
            disabled={loading}
          >
            Clear
          </button>
        </div>

        <div className="muted" style={{ fontSize: 12 }}>
          提示：按 <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> 快速发布
        </div>
      </form>
    </div>
  )
}


