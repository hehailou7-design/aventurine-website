import { useState, useEffect } from 'react'
import { useContent } from '../context/ContentContext'

// ============ 通用组件 ============
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
interface PendingSubmit {
  name: string
  contact: string
  title: string
  content: string
  type: 'news' | 'photo'
  time: string
  status: 'pending'
}

interface ApprovedSubmit {
  name: string
  contact: string
  title: string
  content: string
  type: 'news' | 'photo'
  time: string
  status: 'approved'
  reviewNote?: string
  reviewedAt?: string
}

interface RejectedSubmit {
  name: string
  contact: string
  title: string
  content: string
  type: 'news' | 'photo'
  time: string
  status: 'rejected'
  reviewNote?: string
  reviewedAt?: string
}

type SubmitItem = PendingSubmit | ApprovedSubmit | RejectedSubmit

// ============ 存储键 ============
const PENDING_KEY = 'aventurine_pending_submits'
const APPROVED_KEY = 'aventurine_submits_approved'
const REJECTED_KEY = 'aventurine_submits_rejected'

function loadPending(): PendingSubmit[] {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]') }
  catch { return [] }
}

function loadApproved(): ApprovedSubmit[] {
  try { return JSON.parse(localStorage.getItem(APPROVED_KEY) || '[]') }
  catch { return [] }
}

function loadRejected(): RejectedSubmit[] {
  try { return JSON.parse(localStorage.getItem(REJECTED_KEY) || '[]') }
  catch { return [] }
}

function savePending(items: PendingSubmit[]) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(items))
}

function saveApproved(items: ApprovedSubmit[]) {
  localStorage.setItem(APPROVED_KEY, JSON.stringify(items))
}

function saveRejected(items: RejectedSubmit[]) {
  localStorage.setItem(REJECTED_KEY, JSON.stringify(items))
}

// ============ 组件 ============
export default function SubmitReview() {
  const { content, updateContent } = useContent()
  const [pending, setPending] = useState<PendingSubmit[]>([])
  const [approved, setApproved] = useState<ApprovedSubmit[]>([])
  const [rejected, setRejected] = useState<RejectedSubmit[]>([])
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({})

  useEffect(() => {
    setPending(loadPending())
    setApproved(loadApproved())
    setRejected(loadRejected())
  }, [])

  /** 审核通过：从 pending 移到 approved，并自动发布到首页动态 */
  const handleApprove = (item: PendingSubmit) => {
    const note = reviewNote[item.id] || ''
    const now = new Date().toISOString()
    const approvedItem: ApprovedSubmit = {
      ...item,
      status: 'approved',
      reviewNote: note,
      reviewedAt: now,
    }

    const nextPending = pending.filter(i => (i as any).id !== (item as any).id || i.time !== item.time)
    const nextApproved = [...approved, approvedItem]

    setPending(nextPending)
    setApproved(nextApproved)
    savePending(nextPending)
    saveApproved(nextApproved)
    setReviewNote(prev => { const n = { ...prev }; delete n[(item as any).id || item.time]; return n })

    // 自动发布到首页"最新动态"
    const tag = item.type === 'news' ? '动态' : '实拍'
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '.')
    const newUpdate = {
      date: dateStr,
      text: (item.title || item.content.slice(0, 40)) + (item.content.length > 40 ? '...' : ''),
      tag,
    }
    const currentUpdates = content.home.updates || []
    updateContent('home.updates', [newUpdate, ...currentUpdates])
  }

  /** 拒绝 */
  const handleReject = (item: PendingSubmit) => {
    if (!reviewNote[(item as any).id || item.time]) {
      alert('请填写拒绝理由')
      return
    }

    const note = reviewNote[(item as any).id || item.time]
    const rejectedItem: RejectedSubmit = {
      ...item,
      status: 'rejected',
      reviewNote: note,
      reviewedAt: new Date().toISOString(),
    }

    const nextPending = pending.filter(i => (i as any).id !== (item as any).id || i.time !== item.time)
    const nextRejected = [...rejected, rejectedItem]

    setPending(nextPending)
    setRejected(nextRejected)
    savePending(nextPending)
    saveRejected(nextRejected)
    setReviewNote(prev => { const n = { ...prev }; delete n[(item as any).id || item.time]; return n })
  }

  const renderList = (items: SubmitItem[], showActions: boolean) => {
    if (items.length === 0) {
      return (
        <div style={{ color: 'rgba(248,246,240,0.3)', fontSize: '12px', textAlign: 'center', padding: '32px 0' }}>
          暂无{activeTab === 'pending' ? '待审核' : activeTab === 'approved' ? '已通过' : '已拒绝'}的投稿
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item, idx) => {
          const itemId = (item as any).id || item.time
          return (
            <div key={itemId || idx} style={{ background: 'rgba(212,184,120,0.03)', border: '1px solid rgba(212,184,120,0.1)', borderRadius: '8px', padding: '16px' }}>
              {/* 头部信息 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: item.type === 'news' ? 'rgba(176,160,216,0.12)' : 'rgba(212,184,120,0.12)',
                    border: `1px solid ${item.type === 'news' ? 'rgba(176,160,216,0.3)' : 'rgba(212,184,120,0.3)'}`,
                    borderRadius: '4px', padding: '2px 8px',
                    color: item.type === 'news' ? '#b0a0d8' : '#d4b878',
                    fontSize: '11px',
                  }}>
                    {item.type === 'news' ? '📰 动态' : '📷 实拍'}
                  </span>
                  <span style={{ color: '#d4b878', fontSize: '13px', fontWeight: 500 }}>{item.name || '匿名'}</span>
                  {item.contact && <span style={{ color: 'rgba(248,246,240,0.4)', fontSize: '11px' }}>{item.contact}</span>}
                </div>
                <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '10px' }}>
                  {new Date(item.time).toLocaleString('zh-CN')}
                </span>
              </div>

              {/* 标题 */}
              {item.title && (
                <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                  {item.title}
                </div>
              )}

              {/* 内容 */}
              <div style={{ color: 'rgba(242,232,208,0.8)', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px', padding: '10px 12px', background: 'rgba(14,14,14,0.4)', borderRadius: '6px' }}>
                {item.content}
              </div>

              {/* 审核操作 */}
              {showActions ? (
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <FormGroup label="审核备注（拒绝时必填）">
                      <TextInput
                        value={reviewNote[itemId] || ''}
                        onChange={v => setReviewNote(prev => ({ ...prev, [itemId]: v }))}
                        multiline
                        rows={2}
                      />
                    </FormGroup>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleReject(item as PendingSubmit)}
                      style={{ background: 'rgba(224,96,96,0.15)', border: '1px solid rgba(224,96,96,0.3)', borderRadius: '6px', color: '#e06060', fontSize: '12px', padding: '6px 14px', cursor: 'pointer' }}
                    >
                      拒绝
                    </button>
                    <button
                      onClick={() => handleApprove(item as PendingSubmit)}
                      style={{ background: 'rgba(156,186,138,0.15)', border: '1px solid rgba(156,186,138,0.3)', borderRadius: '6px', color: '#9cba8a', fontSize: '12px', padding: '6px 14px', cursor: 'pointer' }}
                    >
                      通过并发布
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
          )
        })}
      </div>
    )
  }

  const pendingCount = pending.length
  const approvedCount = approved.length
  const rejectedCount = rejected.length

  return (
    <div>
      <h3 style={{ color: '#d4b878', fontSize: '14px', marginBottom: '6px' }}>动态/实拍投稿审核</h3>
      <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '16px', lineHeight: '1.6' }}>
        审核通过后，投稿将自动更新到首页「最新动态」板块，所有访问者可见。
      </p>

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
