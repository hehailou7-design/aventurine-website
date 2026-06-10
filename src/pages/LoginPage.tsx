import { useState } from 'react'

// 简单密码验证（不需要完整的Auth系统）
const ADMIN_PASSWORD = 'aventurine2026'

export default function LoginPage({ onBack, onLoginSuccess }: { onBack: () => void; onLoginSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError('')
    if (!password.trim()) {
      setError('请输入管理密码')
      return
    }
    setLoading(true)
    // 用 setTimeout 让 UI 有机会更新，避免同步异常卡住
    setTimeout(() => {
      try {
        if (password !== ADMIN_PASSWORD) {
          setError('密码错误，请重试')
        } else {
          onLoginSuccess()
        }
      } catch (err) {
        setError('登录时发生错误，请重试')
        console.error('Login error:', err)
      } finally {
        setLoading(false)
      }
    }, 50)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '380px',
        maxWidth: '90vw',
        padding: '40px 32px',
        background: '#0a0a0a',
        border: '1px solid rgba(212,184,120,0.3)',
        borderRadius: '12px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎰</div>
          <div style={{
            fontSize: '14px', letterSpacing: '0.2em',
            color: '#d4b878', fontWeight: 600, marginBottom: '6px',
          }}>
            管理后台登录
          </div>
          <div style={{
            fontSize: '10px', color: 'rgba(248,246,240,0.35)',
            letterSpacing: '0.1em',
          }}>
            AVENTURINE FAN SITE ADMIN
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', color: 'rgba(248,246,240,0.5)',
              fontSize: '11px', marginBottom: '6px', letterSpacing: '0.05em',
            }}>
              管理密码
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="输入管理密码"
              autoFocus
              disabled={loading}
              style={{
                width: '100%', padding: '10px 14px',
                background: '#121212',
                border: '1px solid rgba(212,184,120,0.3)',
                borderRadius: '8px',
                color: '#f2e8d0', fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                opacity: loading ? 0.5 : 1,
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#e07070', fontSize: '12px',
              marginBottom: '16px', textAlign: 'center',
              padding: '8px',
              background: 'rgba(255,100,100,0.08)',
              borderRadius: '6px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '11px',
              background: loading ? '#666' : 'linear-gradient(135deg, #d4b878, #c4a868)',
              border: 'none', borderRadius: '8px',
              color: '#121212', fontWeight: 600,
              fontSize: '13px', letterSpacing: '0.1em',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '登录中...' : '登录管理后台'}
          </button>
        </form>

        <button
          onClick={onBack}
          disabled={loading}
          style={{
            width: '100%', marginTop: '12px',
            padding: '10px', background: 'transparent',
            border: '1px solid rgba(212,184,120,0.2)',
            borderRadius: '8px', color: 'rgba(248,246,240,0.4)',
            fontSize: '12px', cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          ← 返回网站
        </button>

      </div>
    </div>
  )
}
