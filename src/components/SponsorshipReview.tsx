import { useState, useEffect } from 'react'

// ============ 通用组件（内联定义） ============
function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '4px' }}>{label}</div>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, multiline, rows }: {
  value: string; onChange: (v: string) => void; multiline?: boolean; rows?: number
}) {
  return multiline ? (
    <textarea value={value} onChange={e => onChange(e.target.value)}
      rows={rows || 3}
      style={{ width: '100%', background: '#121212', border: '1px solid rgba(212,184,120,0.3)', borderRadius: '6px', padding: '8px 10px', color: '#f2e8d0', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit' }}
    />
  ) : (
    <input value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', background: '#121212', border: '1px solid rgba(212,184,120,0.3)', borderRadius: '6px', padding: '6px 10px', color: '#f2e8d0', fontSize: '13px' }}
    />
  )
}

// ============ 类型 ============
interface SponsorshipApplication {
  id: string;
  nickname: string;
  contact: string;  // 联系方式（小红书/微博/邮箱）
  experience: string;  // 相关经验
  contribution: string;  // 可以贡献的内容
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
}

// ============ 本地存储工具 ============
const STORAGE_KEY_PENDING = 'aventurine_sponsorship_pending'
const STORAGE_KEY_APPROVED = 'aventurine_sponsorship_approved'
const STORAGE_KEY_REJECTED = 'aventurine_sponsorship_rejected'

function loadPending(): SponsorshipApplication[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING) || '[]') }
  catch { return [] }
}

function loadApproved(): SponsorshipApplication[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_APPROVED) || '[]') }
  catch { return [] }
}

function loadRejected(): SponsorshipApplication[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_REJECTED) || '[]') }
  catch { return [] }
}

function savePending(items: SponsorshipApplication[]) {
  localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(items))
}

function saveApproved(items: SponsorshipApplication[]) {
  localStorage.setItem(STORAGE_KEY_APPROVED, JSON.stringify(items))
}

function saveRejected(items: SponsorshipApplication[]) {
  localStorage.setItem(STORAGE_KEY_REJECTED, JSON.stringify(items))
}

// ============ 组件 ============
export default function SponsorshipReview() {
  const [pending, setPending] = useState<SponsorshipApplication[]>([])
  const [approved, setApproved] = useState<SponsorshipApplication[]>([])
  const [rejected, setRejected] = useState<SponsorshipApplication[]>([])
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({})

  useEffect(() => {
    setPending(loadPending())
    setApproved(loadApproved())
    setRejected(loadRejected())
  }, [])

  const handleApprove = (item: SponsorshipApplication) => {
    const note = reviewNote[item.id] || ''
    const approvedItem = { ...item, status: 'approved' as const, reviewNote: note, reviewedAt: new Date().toISOString() }
    
    const nextPending = pending.filter(i => i.id !== item.id)
    const nextApproved = [...approved, approvedItem]
    
    setPending(nextPending)
    setApproved(nextApproved)
    savePending(nextPending)
    saveApproved(nextApproved)
    
    setReviewNote(prev => { delete prev[item.id]; return { ...prev } })
  }

  const handleReject = (item: SponsorshipApplication) => {
    if (!reviewNote[item.id]) {
      alert('请填写拒绝理由')
      return
    }
    
    const rejectedItem = { ...item, status: 'rejected' as const, reviewNote: reviewNote[item.id], reviewedAt: new Date().toISOString() }
    
    const nextPending = pending.filter(i => i.id !== item.id)
    const nextRejected = [...rejected, rejectedItem]
    
    setPending(nextPending)
    setRejected(nextRejected)
    savePending(nextPending)
    saveRejected(nextRejected)
    
    setReviewNote(prev => { delete prev[item.id]; return { ...prev } })
  }

  const renderList = (items: SponsorshipApplication[], showActions: boolean) => {
    if (items.length === 0) {
      return (
        <div style={{ color: 'rgba(248,246,240,0.3)', fontSize: '12px', textAlign: 'center', padding: '32px 0' }}>
          暂无{activeTab === 'pending' ? '待审核' : activeTab === 'approved' ? '已通过' : '已拒绝'}的生贺组申请
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map(item => (
          <div key={item.id} style={{ background: 'rgba(212,184,120,0.03)', border: '1px solid rgba(212,184,120,0.1)', borderRadius: '8px', padding: '16px' }}>
            {/* 头部信息 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#d4b878', fontSize: '13px', fontWeight: 500 }}>{item.nickname}</span>
                <span style={{ color: 'rgba(248,246,240,0.4)', fontSize: '11px' }}>{item.contact}</span>
              </div>
              <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '10px' }}>
                {new Date(item.submittedAt).toLocaleString('zh-CN')}
              </span>
            </div>

            {/* 详细内容 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              <div style={{ color: 'rgba(242,232,208,0.8)', fontSize: '12px', padding: '8px 10px', background: 'rgba(14,14,14,0.4)', borderRadius: '6px' }}>
                <div style={{ color: 'rgba(212,184,120,0.6)', fontSize: '10px', marginBottom: '4px' }}>相关经验</div>
                {item.experience}
              </div>
              <div style={{ color: 'rgba(242,232,208,0.8)', fontSize: '12px', padding: '8px 10px', background: 'rgba(14,14,14,0.4)', borderRadius: '6px' }}>
                <div style={{ color: 'rgba(212,184,120,0.6)', fontSize: '10px', marginBottom: '4px' }}>可以贡献的内容</div>
                {item.contribution}
              </div>
            </div>

            {/* 审核操作 */}
            {showActions ? (
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <FormGroup label="审核备注（拒绝时必填）">
                    <TextInput
                      value={reviewNote[item.id] || ''}
                      onChange={v => setReviewNote(prev => ({ ...prev, [item.id]: v }))}
                      multiline
                      rows={2}
                    />
                  </FormGroup>
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleReject(item)}
                    style={{ background: 'rgba(224,96,96,0.15)', border: '1px solid rgba(224,96,96,0.3)', borderRadius: '6px', color: '#e06060', fontSize: '12px', padding: '6px 14px', cursor: 'pointer' }}
                  >
                    拒绝
                  </button>
                  <button
                    onClick={() => handleApprove(item)}
                    style={{ background: 'rgba(156,186,138,0.15)', border: '1px solid rgba(156,186,138,0.3)', borderRadius: '6px', color: '#9cba8a', fontSize: '12px', padding: '6px 14px', cursor: 'pointer' }}
                  >
                    通过
                  </button>
                </div>
              </div>
            ) : (
              item.reviewNote && (
                <div style={{ color: 'rgba(248,246,240,0.4)', fontSize: '11px', padding: '6px 10px', background: 'rgba(212,184,120,0.05)', borderRadius: '4px' }}>
                  审核备注：{item.reviewNote}
                </div>
              )
            )}
          </div>
        ))}
      </div>
    )
  }

  const pendingCount = pending.length
  const approvedCount = approved.length
  const rejectedCount = rejected.length

  return (
    <div>
      <h3 style={{ color: '#d4b878', fontSize: '14px', marginBottom: '16px' }}>生贺组应聘审核</h3>

      {/* 统计 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(212,184,120,0.06)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ color: '#d4b878', fontSize: '20px', fontWeight: 700 }}>{pendingCount}</div>
          <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px' }}>待审核</div>
        </div>
        <div style={{ background: 'rgba(156,186,138,0.06)', border: '1px solid rgba(156,186,138,0.15)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ color: '#9cba8a', fontSize: '20px', fontWeight: 700 }}>{approvedCount}</div>
          <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px' }}>已通过</div>
        </div>
        <div style={{ background: 'rgba(224,96,96,0.06)', border: '1px solid rgba(224,96,96,0.15)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ color: '#e06060', fontSize: '20px', fontWeight: 700 }}>{rejectedCount}</div>
          <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px' }}>已拒绝</div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {([
          { key: 'pending', label: `待审核 (${pendingCount})`, color: '#d4b878' },
          { key: 'approved', label: `已通过 (${approvedCount})`, color: '#9cba8a' },
          { key: 'rejected', label: `已拒绝 (${rejectedCount})`, color: '#e06060' },
        ] as { key: 'pending' | 'approved' | 'rejected'; label: string; color: string }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '6px 14px', fontSize: '12px', borderRadius: '6px', cursor: 'pointer',
              background: activeTab === tab.key ? 'rgba(212,184,120,0.15)' : 'transparent',
              border: '1px solid ' + (activeTab === tab.key ? `rgba(${tab.color},0.4)` : 'rgba(212,184,120,0.15)'),
              color: activeTab === tab.key ? tab.color : 'rgba(248,246,240,0.5)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 列表 */}
      {activeTab === 'pending' && renderList(pending, true)}
      {activeTab === 'approved' && renderList(approved, false)}
      {activeTab === 'rejected' && renderList(rejected, false)}
    </div>
  )
}
