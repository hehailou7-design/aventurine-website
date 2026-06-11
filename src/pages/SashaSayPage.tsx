import { useState, useEffect } from 'react'
import { useContent } from '../context/ContentContext'
import type { SandKnowledge } from '../context/ContentContext'
import { fetchCloudData, saveCloudData, mergeArrays } from '../services/CloudDataService'

// ============ 云词展现组件 ============
function WordCloud({ items, onAdd }: { items: SandKnowledge[]; onAdd: () => void }) {
  return (
    <div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center',
        padding: '24px 8px', minHeight: '120px', alignItems: 'center',
      }}>
        {items.length === 0 ? (
          <div style={{ color: 'rgba(248,246,240,0.3)', fontSize: '13px', textAlign: 'center', width: '100%' }}>
            🌟 还没有冷知识，来投稿第一条吧
          </div>
        ) : (
          items.map((item, idx) => {
            const sizes = ['14px', '13px', '16px', '12px', '15px', '18px', '13px', '14px', '17px', '13px']
            const colors = ['#d4b878', '#e898b8', '#88c8d8', '#b8d888', '#d4a8e8', '#f0a060', '#9cba8a', '#c4a868', '#f0c8a0', '#a0c8d8']
            const size = sizes[idx % sizes.length]
            const color = colors[idx % colors.length]
            return (
              <div key={item.id} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '20px',
                padding: '10px 20px', maxWidth: '280px',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'default', transition: 'all 0.3s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
              >
                <div style={{ color, fontSize: size, lineHeight: '1.6', fontWeight: 500 }}>{item.text}</div>
                {item.source && (
                  <div style={{ color: 'rgba(248,246,240,0.3)', fontSize: '10px', marginTop: '4px' }}>
                    —— {item.source}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          onClick={onAdd}
          style={{
            background: 'rgba(232,152,184,0.1)', border: '1px solid rgba(232,152,184,0.25)',
            borderRadius: '20px', padding: '8px 24px', color: '#e898b8',
            fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          ✏️ 我知道冷知识，我要投稿
        </button>
      </div>
    </div>
  )
}

// ============ 扭蛋预言组件 ============
function GachaFortune({ quotes, gachaTitle }: { quotes: any[]; gachaTitle: string }) {
  const [wish, setWish] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSpin = () => {
    if (!wish.trim() || spinning) return
    setSpinning(true)
    setShowResult(false)

    // 随机抽取（UR 10%, SSR 30%, SR 60%）
    const roll = Math.random()
    let pool = quotes.filter(q => q.rarity === 'SR')
    if (roll < 0.1) pool = quotes.filter(q => q.rarity === 'UR')
    else if (roll < 0.4) pool = quotes.filter(q => q.rarity === 'SSR')

    const picked = pool[Math.floor(Math.random() * pool.length)] || quotes[Math.floor(Math.random() * quotes.length)]

    // 模拟扭蛋动画
    setTimeout(() => {
      setResult(picked)
      setShowResult(true)
      setSpinning(false)
    }, 1500)
  }

  const rarityColors: Record<string, string> = {
    SR: '#88c8d8', SSR: '#d4a8e8', UR: '#d4b878',
  }
  const rarityGlow: Record<string, string> = {
    SR: '0 0 20px rgba(136,200,216,0.3)', SSR: '0 0 20px rgba(212,168,232,0.4)', UR: '0 0 30px rgba(212,184,120,0.5)',
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {/* 愿望输入 */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)', padding: '20px',
        marginBottom: '24px',
      }}>
        <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginBottom: '12px' }}>
          把你的愿望写下来，扭一扭——砂金会告诉你答案
        </div>
        <textarea
          value={wish}
          onChange={e => setWish(e.target.value)}
          placeholder="例如：希望砂金下次UP不要再歪了..."
          rows={2}
          maxLength={100}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px',
            background: 'rgba(14,14,14,0.8)', border: '1px solid rgba(212,184,120,0.2)',
            color: '#f2e8d0', fontSize: '13px', outline: 'none',
            resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleSpin}
          disabled={!wish.trim() || spinning}
          style={{
            marginTop: '16px',
            background: spinning ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #d4b878, #e898b8)',
            border: 'none', borderRadius: '24px',
            color: spinning ? 'rgba(248,246,240,0.3)' : '#121212',
            fontSize: '15px', fontWeight: 700, padding: '12px 40px',
            cursor: spinning ? 'default' : 'pointer',
            transition: 'all 0.3s',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
          }}
        >
          {spinning ? (
            <>
              <span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>🎰</span>
              扭蛋中...
            </>
          ) : '🎰 扭一扭'}
        </button>
      </div>

      {/* 结果 */}
      {spinning && !showResult && (
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', animation: 'spin 0.6s linear infinite', display: 'inline-block', marginBottom: '16px' }}>🥚</div>
          <div style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px' }}>砂金正在为你挑选预言...</div>
        </div>
      )}

      {showResult && result && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,184,120,0.08), rgba(232,152,184,0.06))',
          borderRadius: '20px', border: '1px solid rgba(212,184,120,0.2)',
          padding: '32px 24px', animation: 'fadeInUp 0.5s ease',
          boxShadow: rarityGlow[result.rarity],
        }}>
          <div style={{
            display: 'inline-block', background: rarityColors[result.rarity] + '20',
            border: '1px solid ' + rarityColors[result.rarity],
            borderRadius: '12px', padding: '4px 14px',
            color: rarityColors[result.rarity], fontSize: '12px', fontWeight: 700,
            marginBottom: '16px',
          }}>
            {result.rarity === 'UR' ? '💎 极品 · ' : result.rarity === 'SSR' ? '✨ 稀有 · ' : '🌟 普通 · '}
            {result.rarity}
          </div>
          <div style={{
            color: '#d4b878', fontSize: '18px', fontWeight: 700,
            lineHeight: '1.8', marginBottom: '20px',
            fontStyle: 'italic',
          }}>
            {result.text}
          </div>
          <div style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>
            —— 你的愿望："{wish}"
          </div>
          <button
            onClick={() => { setShowResult(false); setResult(null); setWish('') }}
            style={{
              marginTop: '16px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
              padding: '6px 20px', color: 'rgba(248,246,240,0.5)',
              fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            再扭一次
          </button>
        </div>
      )}
    </div>
  )
}

// ============ 投稿弹窗 ============
function SubmitKnowledge({ onClose, onSubmit }: { onClose: () => void; onSubmit: (text: string) => void }) {
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!text.trim()) return
    onSubmit(text.trim())
    setSubmitted(true)
    setTimeout(() => { onClose() }, 1500)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#1a1a2e', border: '1px solid rgba(232,152,184,0.25)',
        borderRadius: '20px', padding: '28px', maxWidth: '440px', width: '90%',
      }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>✅</div>
            <div style={{ color: '#e898b8', fontSize: '16px' }}>投稿已提交！</div>
          </div>
        ) : (
          <>
            <h3 style={{ color: '#e898b8', fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>📝 投稿冷知识</h3>
            <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '16px' }}>分享你知道的砂金小秘密</p>
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="关于砂金的冷知识..." rows={4} maxLength={200}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(14,14,14,0.8)',
                border: '1px solid rgba(255,255,255,0.1)', color: '#f2e8d0', fontSize: '13px',
                outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '8px 20px', color: 'rgba(248,246,240,0.5)',
                fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
              }}>取消</button>
              <button onClick={handleSubmit} disabled={!text.trim()} style={{
                background: text.trim() ? 'linear-gradient(135deg, #e898b8, #d4b878)' : 'rgba(255,255,255,0.05)',
                border: 'none', borderRadius: '10px', padding: '8px 20px',
                color: text.trim() ? '#121212' : 'rgba(248,246,240,0.3)',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>提交投稿</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ============ 主页面 ============
export default function SashaSayPage() {
  const { content } = useContent()
  const [activeTab, setActiveTab] = useState<'knowledge' | 'gacha'>('knowledge')
  const [showSubmit, setShowSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const knowledge = content.sashaSay?.knowledge || []
  const gachaQuotes = content.sashaSay?.gachaQuotes || []
  const gachaTitle = content.sashaSay?.gachaTitle || '🎰 扭蛋预言'

  const handleSubmitKnowledge = async (text: string) => {
    // Save to localStorage pending
    try {
      const pending = JSON.parse(localStorage.getItem('aventurine_knowledge_pending') || '[]')
      pending.push({ id: 'k_' + Date.now(), text, submittedAt: new Date().toISOString(), submittedBy: '匿名' })
      localStorage.setItem('aventurine_knowledge_pending', JSON.stringify(pending))
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
      // 保存到云端
      try {
        const cloud = await fetchCloudData()
        const local = JSON.parse(localStorage.getItem('aventurine_knowledge_pending') || '[]')
        cloud.knowledgePending = mergeArrays(local, cloud.knowledgePending)
        await saveCloudData(cloud)
      } catch {}
    } catch { /* ignore */ }
  }

  useEffect(() => {
    const sync = async () => {
      try {
        const cloud = await fetchCloudData()
        if (cloud.knowledgePending && cloud.knowledgePending.length > 0) {
          const local = JSON.parse(localStorage.getItem('aventurine_knowledge_pending') || '[]')
          const merged = mergeArrays(cloud.knowledgePending, local)
          localStorage.setItem('aventurine_knowledge_pending', JSON.stringify(merged))
        }
      } catch {}
    }
    sync()
    const interval = setInterval(sync, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ padding: '40px 0 100px', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 className="section-title" style={{ fontSize: '28px', marginBottom: '6px' }}>砂砂想说</h2>
          <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px' }}>
            {content.sashaSay?.subtitle || '关于砂金的趣味冷知识与名言预言'}
          </p>
        </div>

        {/* Tab Switch */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '32px',
        }}>
          <button onClick={() => setActiveTab('knowledge')} style={{
            padding: '10px 32px', border: '1px solid ' + (activeTab === 'knowledge' ? 'rgba(232,152,184,0.3)' : 'rgba(255,255,255,0.08)'),
            borderRadius: '20px 0 0 20px',
            background: activeTab === 'knowledge' ? 'rgba(232,152,184,0.1)' : 'transparent',
            color: activeTab === 'knowledge' ? '#e898b8' : 'rgba(248,246,240,0.4)',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>📖 冷知识</button>
          <button onClick={() => setActiveTab('gacha')} style={{
            padding: '10px 32px', border: '1px solid ' + (activeTab === 'gacha' ? 'rgba(212,184,120,0.3)' : 'rgba(255,255,255,0.08)'),
            borderRadius: '0 20px 20px 0',
            background: activeTab === 'gacha' ? 'rgba(212,184,120,0.1)' : 'transparent',
            color: activeTab === 'gacha' ? '#d4b878' : 'rgba(248,246,240,0.4)',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>🎰 扭蛋预言</button>
        </div>

        {/* Content */}
        {activeTab === 'knowledge' ? (
          <div className="card-glass" style={{ borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ color: '#e898b8', fontSize: '16px', marginBottom: '4px', textAlign: 'center' }}>
              🌸 砂金冷知识
            </h3>
            <p style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px', textAlign: 'center', marginBottom: '16px' }}>
              点击卡片翻转查看详细来源
            </p>

            {submitted && (
              <div style={{
                background: 'rgba(156,186,138,0.1)', border: '1px solid rgba(156,186,138,0.2)',
                borderRadius: '10px', padding: '10px 16px', textAlign: 'center', marginBottom: '16px',
                color: '#9cba8a', fontSize: '12px',
              }}>✅ 投稿已提交，管理员审核后将展示在此处</div>
            )}

            <WordCloud items={knowledge} onAdd={() => setShowSubmit(true)} />
          </div>
        ) : (
          <div className="card-glass" style={{ borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ color: '#d4b878', fontSize: '16px', marginBottom: '20px', textAlign: 'center' }}>
              {gachaTitle}
            </h3>
            <GachaFortune quotes={gachaQuotes} gachaTitle={gachaTitle} />
          </div>
        )}

        {/* Submit Modal */}
        {showSubmit && (
          <SubmitKnowledge onClose={() => setShowSubmit(false)} onSubmit={handleSubmitKnowledge} />
        )}
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}
