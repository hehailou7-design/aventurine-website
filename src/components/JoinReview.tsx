import { useState, useEffect } from 'react'

interface JoinRequest {
  name: string
  contact: string
  supportTypes: string[]
  note: string
  submittedAt: string
}

const typeLabels: Record<string, string> = {
  screen: '🖥️ 提供大屏',
  freebie: '🎁 提供无料',
  venue: '🏠 场地支持',
  fund: '💰 经济支持',
  relay: '🎨 产出接龙',
  online: '🎉 线上生日会',
  cafe: '☕ 线下生咖/only',
}

export default function JoinReview() {
  const [requests, setRequests] = useState<JoinRequest[]>([])

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('aventurine_join_requests') || '[]')
      setRequests(data)
    } catch {
      setRequests([])
    }
  }, [])

  const handleClear = () => {
    if (confirm('确定要清空所有报名记录吗？此操作不可撤销。')) {
      localStorage.removeItem('aventurine_join_requests')
      setRequests([])
    }
  }

  const handleDelete = (index: number) => {
    const updated = requests.filter((_, i) => i !== index)
    localStorage.setItem('aventurine_join_requests', JSON.stringify(updated))
    setRequests(updated)
  }

  if (requests.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '14px' }}>暂无应援报名记录</p>
        <p style={{ color: 'rgba(248,246,240,0.25)', fontSize: '12px', marginTop: '4px' }}>
          用户在前台"加入应援"提交后会出现在这里
        </p>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div style={{ color: '#d4b878', fontSize: '14px', fontWeight: 600 }}>
          📋 应援报名记录（{requests.length} 条）
        </div>
        <button
          onClick={handleClear}
          style={{
            background: 'rgba(224,96,96,0.1)', border: '1px solid rgba(224,96,96,0.2)',
            borderRadius: '6px', color: '#e06060', fontSize: '12px',
            padding: '4px 12px', cursor: 'pointer',
          }}
        >
          清空全部
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {requests.map((req, i) => (
          <div key={i} style={{
            background: 'rgba(20,20,30,0.6)',
            border: '1px solid rgba(212,184,120,0.1)',
            borderRadius: '12px', padding: '16px',
            position: 'relative',
          }}>
            {/* Delete */}
            <button
              onClick={() => handleDelete(i)}
              style={{
                position: 'absolute', top: '12px', right: '12px',
                background: 'transparent', border: 'none',
                color: 'rgba(248,246,240,0.3)', fontSize: '16px',
                cursor: 'pointer', padding: '4px 8px',
              }}
              title="删除此条"
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4b878, #c4a060)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#121212', fontSize: '16px', fontWeight: 700,
                flexShrink: 0,
              }}>
                {req.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ color: '#f8f6f0', fontSize: '14px', fontWeight: 600 }}>{req.name}</div>
                <div style={{ color: 'rgba(248,246,240,0.4)', fontSize: '11px' }}>
                  {new Date(req.submittedAt).toLocaleString('zh-CN')}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div style={{
              padding: '8px 12px', borderRadius: '8px',
              background: 'rgba(100,180,120,0.05)',
              marginBottom: '10px',
              color: '#8cba6a', fontSize: '12px',
            }}>
              📞 {req.contact}
            </div>

            {/* Support Types */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: req.note ? '10px' : '0' }}>
              {req.supportTypes.map((type) => (
                <span key={type} style={{
                  padding: '3px 10px', borderRadius: '20px',
                  background: 'rgba(212,184,120,0.08)',
                  border: '1px solid rgba(212,184,120,0.15)',
                  color: '#d4b878', fontSize: '11px',
                }}>
                  {typeLabels[type] || type}
                </span>
              ))}
            </div>

            {/* Note */}
            {req.note && (
              <div style={{
                color: 'rgba(248,246,240,0.5)', fontSize: '12px',
                padding: '8px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
                lineHeight: '1.6',
              }}>
                💬 {req.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
