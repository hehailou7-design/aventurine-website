import { useState, useEffect, useRef } from 'react'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'
import type { Blessing } from '../context/ContentContext'

function loadLocalBlessings(): Blessing[] {
  try {
    const raw = localStorage.getItem('aventurine_blessings')
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

function saveLocalBlessings(b: Blessing[]) {
  localStorage.setItem('aventurine_blessings', JSON.stringify(b))
}

/** Merge published blessings (from content.json) with local blessings */
function mergeBlessings(published: Blessing[], local: Blessing[]): Blessing[] {
  const map = new Map<string, Blessing>()
  // Published first, then local (local overrides with same ID)
  published.forEach(b => map.set(b.id, b))
  local.forEach(b => map.set(b.id, b))
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  )
}

// 弹幕组件
function DanmuItem({ blessing, index }: { blessing: Blessing; index: number }) {
  const [position, setPosition] = useState(100) // 从右侧100%开始
  const [speed] = useState(30 + Math.random() * 40) // 随机速度
  const [top] = useState(() => Math.random() * 70 + 10) // 随机垂直位置 10%-80%
  const [opacity] = useState(() => 0.6 + Math.random() * 0.4) // 随机透明度
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    let currentPos = 100
    const animate = () => {
      currentPos -= speed * 0.016 // 每帧移动
      setPosition(currentPos)
      
      if (currentPos > -50) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [speed])

  // 如果弹幕完全离开屏幕，不渲染
  if (position < -50) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: `${top}%`,
        left: `${position}%`,
        transform: 'translateX(0)',
        whiteSpace: 'nowrap',
        color: '#d4b878',
        fontSize: index % 3 === 0 ? '18px' : index % 3 === 1 ? '16px' : '14px',
        fontWeight: 500,
        textShadow: '0 0 10px rgba(212,184,120,0.3), 0 0 20px rgba(212,184,120,0.1)',
        opacity,
        pointerEvents: 'auto',
        cursor: 'pointer',
        transition: 'text-shadow 0.3s',
        zIndex: 10,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textShadow = '0 0 20px rgba(212,184,120,0.8), 0 0 40px rgba(212,184,120,0.4)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textShadow = '0 0 10px rgba(212,184,120,0.3), 0 0 20px rgba(212,184,120,0.1)'
      }}
      title={`${blessing.name}: ${blessing.text}`}
    >
      <span style={{ marginRight: '8px', opacity: 0.7 }}>✦</span>
      {blessing.name}: {blessing.text}
    </div>
  )
}

export default function BlessingsPage() {
  const { t } = useLang()
  const { content, updateContent } = useContent()
  
  // Merge published blessings + local blessings
  const [blessings, setBlessings] = useState<Blessing[]>(() => {
    return mergeBlessings(content.blessings.items, loadLocalBlessings())
  })
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [showDanmu, setShowDanmu] = useState(true)

  // Sync local history to localStorage on mount (for backward compat)
  useEffect(() => {
    const local = loadLocalBlessings()
    if (local.length > 0) {
      // Merge local into ContentContext so admin can publish
      const merged = mergeBlessings(content.blessings.items, local)
      updateContent('blessings.items', merged)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setCharCount(text.length)
  }, [text])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    const now = new Date()
    const newBlessing: Blessing = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim() || '骰子守望者',
      text: text.trim(),
      time: now.toISOString(),
      likes: 0,
    }

    const updated = [newBlessing, ...blessings]
    setBlessings(updated)
    // Save to localStorage for immediate cross-page persistence
    saveLocalBlessings(updated)
    // Also sync to ContentContext so admin can publish to content.json
    updateContent('blessings.items', updated)
    setName('')
    setText('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  const sorted = [...blessings].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e0e', position: 'relative' }}>
      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(180deg, #0d0d1a 0%, rgba(124,92,191,0.08) 30%, #0e0e0e 100%)',
        padding: '60px 24px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Aurora effect */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(124,92,191,0.2) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: '36px',
            marginBottom: '12px',
            color: '#d4b878',
            opacity: 0.8,
          }}>
            ✦
          </div>
          <h1 style={{
            fontSize: 'clamp(20px, 4vw, 28px)',
            color: '#d4b878',
            fontWeight: 700,
            letterSpacing: '0.08em',
            marginBottom: '8px',
          }}>
            {t('blessings_title')}
          </h1>
          <p style={{
            color: 'rgba(242,232,208,0.5)',
            fontSize: '14px',
            letterSpacing: '0.05em',
          }}>
            {t('blessings_subtitle')}
          </p>
          <div style={{
            marginTop: '16px',
            display: 'inline-block',
            padding: '6px 20px',
            background: 'rgba(212,184,120,0.06)',
            border: '1px solid rgba(212,184,120,0.2)',
            borderRadius: '20px',
            color: 'rgba(212,184,120,0.6)',
            fontSize: '12px',
          }}>
            {sorted.length} 条祝福 · 愿极光照亮前路
          </div>
          
          {/* 弹幕开关 */}
          <button
            onClick={() => setShowDanmu(!showDanmu)}
            style={{
              marginLeft: '12px',
              padding: '6px 16px',
              background: showDanmu ? 'rgba(212,184,120,0.15)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(212,184,120,0.3)',
              borderRadius: '20px',
              color: showDanmu ? '#d4b878' : 'rgba(248,246,240,0.3)',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            {showDanmu ? '🎆 弹幕开启' : '🎆 弹幕关闭'}
          </button>
        </div>
      </div>

      {/* 弹幕显示区域 */}
      {showDanmu && blessings.length > 0 && (
        <div style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(14,14,14,0.8) 0%, rgba(14,14,14,0.95) 100%)',
          borderTop: '1px solid rgba(212,184,120,0.1)',
          borderBottom: '1px solid rgba(212,184,120,0.1)',
          marginBottom: '40px',
        }}>
          {sorted.slice(0, 50).map((b, i) => (
            <DanmuItem key={b.id} blessing={b} index={i} />
          ))}
        </div>
      )}

      {/* Blessing form */}
      <div className="max-w-screen-lg mx-auto px-4 md:px-8 relative z-10">
        <form onSubmit={handleSubmit} style={{
          background: 'linear-gradient(135deg, rgba(212,184,120,0.06), rgba(176,160,216,0.05))',
          border: '1px solid rgba(212,184,120,0.2)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '40px',
        }}>
          <div style={{
            display: 'flex', gap: '12px', marginBottom: '12px',
            flexWrap: 'wrap',
          }}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="你的名字（可选，默认：骰子守望者）"
              maxLength={20}
              style={{
                flex: '1 1 180px',
                padding: '10px 16px',
                background: '#121212',
                border: '1px solid rgba(212,184,120,0.25)',
                borderRadius: '8px',
                color: '#f2e8d0',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <div style={{
              flex: '3 1 350px',
              position: 'relative',
            }}>
              <textarea
                value={text}
                onChange={e => {
                  if (e.target.value.length <= 500) setText(e.target.value)
                }}
                placeholder={t('blessings_input_placeholder')}
                maxLength={500}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 16px 28px',
                  background: '#121212',
                  border: '1px solid rgba(212,184,120,0.25)',
                  borderRadius: '8px',
                  color: '#f2e8d0',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <span style={{
                position: 'absolute',
                bottom: '8px',
                right: '12px',
                color: charCount > 450 ? '#e07070' : 'rgba(248,246,240,0.3)',
                fontSize: '10px',
              }}>
                {charCount}/500
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={!text.trim()}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 28px',
                background: text.trim()
                  ? 'linear-gradient(135deg, #d4b878, #c4a868)'
                  : 'rgba(212,184,120,0.15)',
                border: 'none',
                borderRadius: '8px',
                color: text.trim() ? '#121212' : 'rgba(212,184,120,0.4)',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '0.05em',
                cursor: text.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
              }}
            >
              {submitted ? '✓ 已发送' : t('blessings_send')}
            </button>
          </div>
        </form>

        {/* Blessings list - 保留列表视图作为补充 */}
        {sorted.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
              opacity: 0.2,
              color: '#d4b878',
            }}>
              ◈
            </div>
            <p style={{
              color: 'rgba(248,246,240,0.35)',
              fontSize: '14px',
              letterSpacing: '0.05em',
            }}>
              {t('blessings_empty')}
            </p>
          </div>
        ) : (
          <>
            <h3 style={{
              color: '#d4b878',
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '20px',
              textAlign: 'center',
              letterSpacing: '0.05em',
            }}>
              ✦ 最新祝福 ✦
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
              paddingBottom: '40px',
            }}>
              {sorted.slice(0, 12).map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,184,120,0.06), rgba(176,160,216,0.05))',
                    border: '1px solid rgba(212,184,120,0.12)',
                    borderRadius: '10px',
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(212,184,120,0.4), transparent)',
                  }} />

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}>
                    <span style={{
                      color: '#d4b878',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}>
                      {b.name}
                    </span>
                    <span style={{
                      color: 'rgba(248,246,240,0.3)',
                      fontSize: '10px',
                    }}>
                      {formatTime(b.time)}
                    </span>
                  </div>

                  <p style={{
                    color: 'rgba(242,232,208,0.8)',
                    fontSize: '13px',
                    lineHeight: '1.8',
                    margin: '0 0 12px 0',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${dd}`
}
