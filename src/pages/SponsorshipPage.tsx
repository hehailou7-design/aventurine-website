import { useState, useEffect } from 'react'
import { fetchCloudData, saveCloudData, mergeArrays } from '../services/CloudDataService'

const APP_KEY = 'aventurine_sponsorship_pending'

function loadLocal(): any[] {
  try { return JSON.parse(localStorage.getItem(APP_KEY) || '[]') } catch { return [] }
}
function saveLocal(data: any[]) {
  localStorage.setItem(APP_KEY, JSON.stringify(data))
}

export default function SponsorshipPage() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    type: 'shenghe',
    experience: '',
    content: '',
  })
  const [submitted, setSubmitted] = useState(false)

  // 云端同步
  useEffect(() => {
    const sync = async () => {
      try {
        const cloud = await fetchCloudData()
        if (cloud.sponsorshipApps && cloud.sponsorshipApps.length > 0) {
          const merged = mergeArrays(cloud.sponsorshipApps, loadLocal())
          saveLocal(merged)
        }
      } catch {}
    }
    sync()
    const interval = setInterval(sync, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.content.trim()) return
    const item = { id: 'sp_' + Date.now(), ...form, time: new Date().toISOString(), status: 'pending' }
    const list = loadLocal()
    list.push(item)
    saveLocal(list)
    
    // 保存到云端
    try {
      const cloud = await fetchCloudData()
      cloud.sponsorshipApps = mergeArrays(list, cloud.sponsorshipApps)
      await saveCloudData(cloud)
    } catch {}
    
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setForm({ name: '', contact: '', type: 'shenghe', experience: '', content: '' })
  }

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <h2 className="section-title">生贺组应聘 / 赞助申请</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '24px', marginTop: '-8px' }}>
          砂金生贺应援筹备组招募志愿者，同时也接受应援资金/物资赞助。感谢每一位为砂金应援付出的你。
        </p>

        <div className="card-glass" style={{ padding: '28px', borderRadius: '12px' }}>
          {submitted ? (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              color: '#d4b878', fontSize: '15px',
              border: '1px solid rgba(212,184,120,0.3)',
              borderRadius: '8px', background: 'rgba(212,184,120,0.06)',
            }}>
              ✓ 申请已提交，负责人会在3个工作日内联系你
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* 申请类型 */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  申请类型 *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { value: 'shenghe', label: '生贺组应聘', desc: '加入应援筹备组' },
                    { value: 'sponsor', label: '赞助申请', desc: '提供资金/物资支持' },
                  ].map(opt => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                      style={{
                        padding: '12px', borderRadius: '8px', border: '1px solid rgba(212,184,120,0.25)',
                        background: form.type === opt.value ? 'rgba(212,184,120,0.12)' : 'transparent',
                        color: form.type === opt.value ? '#d4b878' : 'rgba(248,246,240,0.5)',
                        cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{opt.label}</div>
                      <div style={{ fontSize: '10px', opacity: 0.5 }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 姓名/昵称 */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  姓名/昵称 *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="你的昵称或真实姓名"
                  required
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
                  联系方式（微信/QQ/邮箱）*
                </label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                  placeholder="方便我们联系你"
                  required
                  style={{
                    width: '100%', background: 'rgba(14,14,14,0.8)',
                    border: '1px solid rgba(212,184,120,0.3)', borderRadius: '8px',
                    padding: '10px 14px', color: '#f2e8d0', fontSize: '13px',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* 相关经验（生贺组） */}
              {form.type === 'shenghe' && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                    相关经验（选填）
                  </label>
                  <input
                    type="text"
                    value={form.experience}
                    onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                    placeholder="如：有漫展应援经验 / 擅长视频剪辑 / 会画画..."
                    style={{
                      width: '100%', background: 'rgba(14,14,14,0.8)',
                      border: '1px solid rgba(212,184,120,0.3)', borderRadius: '8px',
                      padding: '10px 14px', color: '#f2e8d0', fontSize: '13px',
                      outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                </div>
              )}

              {/* 申请说明 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                  申请说明 *
                </label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder={form.type === 'shenghe'
                    ? '请简要说明你能为应援做出什么贡献，以及可投入的时间...'
                    : '请说明赞助形式（资金/物资）、金额或物品描述...'}
                  required
                  style={{
                    width: '100%', minHeight: '100px',
                    background: 'rgba(14,14,14,0.8)',
                    border: '1px solid rgba(212,184,120,0.3)', borderRadius: '8px',
                    padding: '10px 14px', color: '#f2e8d0', fontSize: '13px',
                    resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>

              <button type="submit" className="btn-gold" style={{ width: '100%', padding: '12px', fontSize: '14px' }}>
                提交申请 →
              </button>
            </form>
          )}
        </div>

        {/* 说明卡片 */}
        <div style={{
          marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px',
        }}>
          <div className="card-glass" style={{ padding: '16px', borderRadius: '10px' }}>
            <div style={{ color: '#d4b878', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>🎂 生贺组应聘</div>
            <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', lineHeight: '1.6' }}>
              招募：视频剪辑、美术设计、文案策划、线下执行。砂金生日（6月）前1个月截止应聘。
            </div>
          </div>
          <div className="card-glass" style={{ padding: '16px', borderRadius: '10px' }}>
            <div style={{ color: '#d4b878', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>💰 赞助说明</div>
            <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', lineHeight: '1.6' }}>
              赞助将全部用于砂金相关应援活动，定期公示支出明细。赞助者可署名鸣谢。
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
