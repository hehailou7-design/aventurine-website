import { useState } from 'react'

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: '', contact: '', content: '', type: 'suggestion' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.content.trim()) return
    const feedbacks = JSON.parse(localStorage.getItem('aventurine_feedbacks') || '[]')
    feedbacks.push({ ...form, time: new Date().toISOString(), status: 'pending' })
    localStorage.setItem('aventurine_feedbacks', JSON.stringify(feedbacks))
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setForm({ name: '', contact: '', content: '', type: 'suggestion' })
  }

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <h2 className="section-title">意见反馈</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '24px', marginTop: '-8px' }}>
          你的每一条建议都能帮助这个粉丝网站变得更好，管理员会认真审阅每一条反馈
        </p>

        <div className="card-glass" style={{ padding: '28px', borderRadius: '12px' }}>
          {submitted ? (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: '#d4b878', fontSize: '15px',
              border: '1px solid rgba(212,184,120,0.3)',
              borderRadius: '8px', background: 'rgba(212,184,120,0.06)',
            }}>
              ✓ 感谢你的反馈！管理员会尽快处理
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* 反馈类型 */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  反馈类型 *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { value: 'suggestion', label: '功能建议' },
                    { value: 'bug', label: '问题反馈' },
                    { value: 'content', label: '内容纠错' },
                    { value: 'other', label: '其他' },
                  ].map(opt => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                      style={{
                        flex: 1, padding: '8px 4px', fontSize: '12px',
                        borderRadius: '6px', border: '1px solid rgba(212,184,120,0.25)',
                        background: form.type === opt.value ? 'rgba(212,184,120,0.15)' : 'transparent',
                        color: form.type === opt.value ? '#d4b878' : 'rgba(248,246,240,0.5)',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 称呼 */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  称呼（选填）
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="怎么称呼你？"
                  style={{
                    width: '100%', background: 'rgba(14,14,14,0.8)',
                    border: '1px solid rgba(212,184,120,0.3)', borderRadius: '8px',
                    padding: '10px 14px', color: '#f2e8d0', fontSize: '13px',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* 联系方式 */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  联系方式（选填）
                </label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                  placeholder="邮箱 / 微博 / 微信（方便我们联系你）"
                  style={{
                    width: '100%', background: 'rgba(14,14,14,0.8)',
                    border: '1px solid rgba(212,184,120,0.3)', borderRadius: '8px',
                    padding: '10px 14px', color: '#f2e8d0', fontSize: '13px',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* 反馈内容 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  反馈内容 *
                </label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="请详细描述你的建议或遇到的问题..."
                  required
                  style={{
                    width: '100%', minHeight: '120px',
                    background: 'rgba(14,14,14,0.8)',
                    border: '1px solid rgba(212,184,120,0.3)', borderRadius: '8px',
                    padding: '10px 14px', color: '#f2e8d0', fontSize: '13px',
                    resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>

              <button type="submit" className="btn-gold" style={{ width: '100%', padding: '12px', fontSize: '14px' }}>
                提交反馈 →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
