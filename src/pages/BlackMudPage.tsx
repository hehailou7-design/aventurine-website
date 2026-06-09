import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'

// ============ 类型定义 ============
interface BlackmudUser {
  id: string
  nickname: string
  uid: string
  xiaohongshu: string
  weibo: string
  purchaseProof: string  // 周边购买记录描述
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewNote?: string
}

interface BlackmudPost {
  id: string
  user: string
  nickname: string
  text: string
  tag: string
  time: string
  likes: number
  createdAt: string
}

// ============ 本地存储工具 ============
function loadPendingUsers(): BlackmudUser[] {
  try { return JSON.parse(localStorage.getItem('aventurine_blackmud_pending') || '[]') }
  catch { return [] }
}
function savePendingUsers(users: BlackmudUser[]) {
  localStorage.setItem('aventurine_blackmud_pending', JSON.stringify(users))
}
function loadApprovedUsers(): BlackmudUser[] {
  try { return JSON.parse(localStorage.getItem('aventurine_blackmud_approved') || '[]') }
  catch { return [] }
}
function loadPosts(): BlackmudPost[] {
  try { return JSON.parse(localStorage.getItem('aventurine_blackmud_posts') || '[]') }
  catch { return [] }
}
function savePosts(posts: BlackmudPost[]) {
  localStorage.setItem('aventurine_blackmud_posts', JSON.stringify(posts))
}

// ============ 初始帖子 ============
const initialPosts: BlackmudPost[] = [
  { id: '1', user: 'verified_理性旅人', nickname: '理性旅人', text: '3.3复刻的时机好差，和旁边的角色冲突严重，存星石的玩家太难了', time: '1小时前', likes: 56, tag: '抽卡', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', user: 'verified_石里克的信徒', nickname: '石里克的信徒', text: '为什么线下活动都在一线城市，其他地区的粉丝也很心疼的好吗', time: '3小时前', likes: 48, tag: '线下', createdAt: new Date(Date.now() - 10800000).toISOString() },
  { id: '3', user: 'verified_骰子折千', nickname: '骰子折千', text: '官方周边质量倒退了，这次马克杯的印刷有问题，色差很明显', time: '5小时前', likes: 31, tag: '周边', createdAt: new Date(Date.now() - 18000000).toISOString() },
  { id: '4', user: 'verified_匹诺康尼来客', nickname: '匹诺康尼来客', text: '剧情里砂金那段结局太催泪了，当时真的哭惨了，官方出实体小说的话我会买', time: '6小时前', likes: 72, tag: '剧情', createdAt: new Date(Date.now() - 21600000).toISOString() },
]

const tags = ['全部', '抽卡', '线下', '周边', '剧情', '游戏']

// ============ 主组件 ============
export default function BlackMudPage() {
  const { t } = useLang()

  // 审核状态
  const [isVerified, setIsVerified] = useState(false)
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [showVerifyForm, setShowVerifyForm] = useState(false)

  // 帖子
  const [posts, setPosts] = useState<BlackmudPost[]>([])
  const [newText, setNewText] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [activeFilter, setActiveFilter] = useState('全部')

  // 审核表单
  const [verifyForm, setVerifyForm] = useState({
    nickname: '',
    uid: '',
    xiaohongshu: '',
    weibo: '',
    purchaseProof: '',
  })
  const [verifySubmitting, setVerifySubmitting] = useState(false)
  const [verifyMsg, setVerifyMsg] = useState('')

  // 初始化
  useEffect(() => {
    const saved = loadPosts()
    if (saved.length > 0) {
      setPosts(saved)
    } else {
      setPosts(initialPosts)
      savePosts(initialPosts)
    }
    // 检查当前浏览器是否已经审核通过
    const approved = loadApprovedUsers()
    const clientId = localStorage.getItem('aventurine_client_id') || ''
    const found = approved.find(u => u.id === clientId && u.status === 'approved')
    if (found) setIsVerified(true)
  }, [])

  const filtered = activeFilter === '全部' ? posts : posts.filter(p => p.tag === activeFilter)

  // 提交审核申请
  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!verifyForm.nickname.trim() || !verifyForm.uid.trim()) {
      setVerifyMsg('昵称和游戏UID为必填项')
      return
    }
    setVerifySubmitting(true)
    const clientId = localStorage.getItem('aventurine_client_id') || 'client_' + Math.random().toString(36).slice(2, 10)
    localStorage.setItem('aventurine_client_id', clientId)
    const pending = loadPendingUsers()
    pending.push({
      id: clientId,
      nickname: verifyForm.nickname.trim(),
      uid: verifyForm.uid.trim(),
      xiaohongshu: verifyForm.xiaohongshu.trim(),
      weibo: verifyForm.weibo.trim(),
      purchaseProof: verifyForm.purchaseProof.trim(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    })
    savePendingUsers(pending)
    setVerifySubmitting(false)
    setShowVerifyForm(false)
    setVerifyMsg('')
    setPendingUserId(clientId)
    setVerifyForm({ nickname: '', uid: '', xiaohongshu: '', weibo: '', purchaseProof: '' })
  }

  // 发帖
  const handlePost = () => {
    if (!newText.trim()) return
    const clientId = localStorage.getItem('aventurine_client_id') || ''
    const approved = loadApprovedUsers()
    const user = approved.find(u => u.id === clientId)
    const newPost: BlackmudPost = {
      id: 'post_' + Date.now().toString(36),
      user: 'verified_' + (user?.nickname || '访客'),
      nickname: user?.nickname || '访客',
      text: newText.trim(),
      tag: selectedTag || '其他',
      time: '刚刚',
      likes: 0,
      createdAt: new Date().toISOString(),
    }
    const next = [newPost, ...posts]
    setPosts(next)
    savePosts(next)
    setNewText('')
    setSelectedTag('')
  }

  // 点赞
  const handleLike = (postId: string) => {
    const next = posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p)
    setPosts(next)
    savePosts(next)
  }

  // 未审核通过：显示审核说明和申请表单
  if (!isVerified) {
    return (
      <div style={{ padding: '40px 0', minHeight: '100vh' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="section-title">{t('vent_board')}</h2>
          <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '24px', marginTop: '-8px' }}>
            本板块需要审核通过后才能查看他人发言和发布留言
          </p>

          {pendingUserId ? (
            /* 等待审核 */
            <div className="card-glass" style={{ padding: '32px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <div style={{ color: '#d4b878', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                审核申请已提交
              </div>
              <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '13px', lineHeight: '1.8', maxWidth: '420px', margin: '0 auto' }}>
                管理员会在3个工作日内审核你的申请。<br/>
                审核条件：游戏UID + 小红书/微博账号（至少填一个）+ 周边购买记录说明。<br/>
                审核通过后刷新页面即可进入黑泥区。
              </div>
            </div>
          ) : showVerifyForm ? (
            /* 审核申请表单 */
            <div className="card-glass" style={{ padding: '28px', borderRadius: '12px' }}>
              <h3 style={{ color: '#d4b878', fontSize: '15px', marginBottom: '16px' }}>黑泥区进入审核</h3>
              <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '20px', lineHeight: '1.6' }}>
                填写以下信息，管理员审核通过后即可进入黑泥区查看他人发言并发布留言。<br/>
                <span style={{ color: '#e0c060' }}>必填：昵称、游戏UID。选填：小红书账号、微博账号、周边购买记录。</span>
              </p>
              {verifyMsg && (
                <div style={{ color: '#e07070', fontSize: '12px', marginBottom: '12px', padding: '8px 12px', background: 'rgba(255,100,100,0.08)', borderRadius: '6px' }}>
                  {verifyMsg}
                </div>
              )}
              <form onSubmit={handleVerifySubmit}>
                {/* 昵称 */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                    昵称 / 称呼 <span style={{ color: '#e07070' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={verifyForm.nickname}
                    onChange={e => setVerifyForm(f => ({ ...f, nickname: e.target.value }))}
                    placeholder="你的昵称或称呼"
                    required
                    style={{
                      width: '100%', background: 'rgba(14,14,14,0.8)',
                      border: '1px solid rgba(212,184,120,0.3)', borderRadius: '8px',
                      padding: '10px 14px', color: '#f2e8d0', fontSize: '13px',
                      outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* 游戏UID */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                    游戏UID <span style={{ color: '#e07070' }}>*</span>
                    <span style={{ color: 'rgba(248,246,240,0.3)', fontWeight: 400, fontSize: '11px', marginLeft: '6px' }}>
                      （米哈游通行证UID，用于核实账号真实性）
                    </span>
                  </label>
                  <input
                    type="text"
                    value={verifyForm.uid}
                    onChange={e => setVerifyForm(f => ({ ...f, uid: e.target.value }))}
                    placeholder="例：100200300"
                    required
                    style={{
                      width: '100%', background: 'rgba(14,14,14,0.8)',
                      border: '1px solid rgba(212,184,120,0.3)', borderRadius: '8px',
                      padding: '10px 14px', color: '#f2e8d0', fontSize: '13px',
                      outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* 小红书账号 */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                    小红书账号 <span style={{ color: 'rgba(248,246,240,0.4)' }}>(选填，和微博至少填一个)</span>
                  </label>
                  <input
                    type="text"
                    value={verifyForm.xiaohongshu}
                    onChange={e => setVerifyForm(f => ({ ...f, xiaohongshu: e.target.value }))}
                    placeholder="小红书主页链接或@用户名"
                    style={{
                      width: '100%', background: 'rgba(14,14,14,0.8)',
                      border: '1px solid rgba(212,184,120,0.3)', borderRadius: '8px',
                      padding: '10px 14px', color: '#f2e8d0', fontSize: '13px',
                      outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* 微博账号 */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                    微博账号 <span style={{ color: 'rgba(248,246,240,0.4)' }}>(选填，和小红书至少填一个)</span>
                  </label>
                  <input
                    type="text"
                    value={verifyForm.weibo}
                    onChange={e => setVerifyForm(f => ({ ...f, weibo: e.target.value }))}
                    placeholder="微博主页链接或@用户名"
                    style={{
                      width: '100%', background: 'rgba(14,14,14,0.8)',
                      border: '1px solid rgba(212,184,120,0.3)', borderRadius: '8px',
                      padding: '10px 14px', color: '#f2e8d0', fontSize: '13px',
                      outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* 周边购买记录 */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                    周边购买记录说明 <span style={{ color: 'rgba(248,246,240,0.4)' }}>(选填，但填写有助于提高通过率)</span>
                  </label>
                  <textarea
                    value={verifyForm.purchaseProof}
                    onChange={e => setVerifyForm(f => ({ ...f, purchaseProof: e.target.value }))}
                    placeholder="请描述你购买过的砂金周边（名称、渠道、时间等），无需提供截图，描述清楚即可。"
                    style={{
                      width: '100%', minHeight: '80px',
                      background: 'rgba(14,14,14,0.8)',
                      border: '1px solid rgba(212,184,120,0.3)', borderRadius: '8px',
                      padding: '10px 14px', color: '#f2e8d0', fontSize: '13px',
                      resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                  <div style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px', marginTop: '4px' }}>
                    💡 周边购买记录仅用于核实粉丝身份，不会公开显示。
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    disabled={verifySubmitting}
                    className="btn-gold"
                    style={{ flex: 1, padding: '11px', fontSize: '13px', letterSpacing: '0.05em' }}
                  >
                    {verifySubmitting ? '提交中...' : '提交审核申请'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowVerifyForm(false)}
                    style={{
                      padding: '11px 20px', fontSize: '13px',
                      background: 'transparent', border: '1px solid rgba(212,184,120,0.3)',
                      borderRadius: '8px', color: 'rgba(248,246,240,0.5)',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* 审核说明页 */
            <div className="card-glass" style={{ padding: '32px', borderRadius: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <div style={{ background: 'rgba(212,184,120,0.06)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '20px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>①</div>
                  <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>提交审核信息</div>
                  <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', lineHeight: '1.6' }}>
                    填写游戏UID（必填）、小红书和/或微博账号（至少填一个）、周边购买记录（选填）
                  </div>
                </div>
                <div style={{ background: 'rgba(212,184,120,0.06)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '20px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>②</div>
                  <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>管理员审核</div>
                  <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', lineHeight: '1.6' }}>
                    管理员会在3个工作日内审核，通过后会通知（刷新页面即可进入）
                  </div>
                </div>
                <div style={{ background: 'rgba(212,184,120,0.06)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '20px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>③</div>
                  <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>进入黑泥区</div>
                  <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', lineHeight: '1.6' }}>
                    审核通过后即可查看他人发言，并发布你自己的理性吐槽
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(212,184,120,0.06)', border: '1px solid rgba(212,184,120,0.2)',
                borderRadius: '10px', padding: '20px', marginBottom: '24px',
              }}>
                <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>审核需提供：</div>
                <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', lineHeight: '1.8' }}>
                  <div>✅ <span style={{ color: 'rgba(212,184,120,0.8)' }}>游戏UID</span>（必填）—— 用于核实账号真实性</div>
                  <div>✅ <span style={{ color: 'rgba(212,184,120,0.8)' }}>小红书 或 微博账号</span>（至少填一个）—— 证明你是真实粉丝</div>
                  <div>✅ <span style={{ color: 'rgba(212,184,120,0.8)' }}>周边购买记录</span>（选填，但填写有助于提高通过率）</div>
                </div>
              </div>

              <button
                onClick={() => setShowVerifyForm(true)}
                className="btn-gold"
                style={{ width: '100%', padding: '13px', fontSize: '14px', letterSpacing: '0.08em' }}
              >
                开始审核申请 →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // 已审核通过：显示黑泥区内容
  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 className="section-title">{t('vent_board')}</h2>
          <div style={{
            background: 'rgba(212,184,120,0.06)',
            border: '1px solid rgba(212,184,120,0.2)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ color: '#d4b878', fontSize: '16px' }}>✅</span>
            <span style={{ color: 'rgba(248,246,240,0.7)', fontSize: '12px', lineHeight: '1.6' }}>
              {t('vent_notice')} · 你已通过审核，可以正常发言和查看他人留言。
            </span>
          </div>
        </div>

        {/* Post input */}
        <div className="card-glass" style={{ padding: '20px', marginBottom: '24px', borderRadius: '10px' }}>
          <div style={{ color: '#d4b878', fontSize: '13px', marginBottom: '12px', fontWeight: 500 }}>
            有话要说？
          </div>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="理性吐槽，建设性意见优先..."
            style={{
              width: '100%', minHeight: '80px',
              background: 'rgba(14,14,14,0.8)',
              border: '1px solid rgba(212,184,120,0.25)',
              borderRadius: '8px', padding: '12px',
              color: '#f2e8d0', fontSize: '13px',
              resize: 'vertical', outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {tags.filter(t => t !== '全部').map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  style={{
                    padding: '4px 10px', fontSize: '11px',
                    borderRadius: '12px', cursor: 'pointer',
                    background: selectedTag === tag ? 'rgba(212,184,120,0.15)' : 'transparent',
                    border: '1px solid ' + (selectedTag === tag ? 'rgba(212,184,120,0.4)' : 'rgba(212,184,120,0.15)'),
                    color: selectedTag === tag ? '#d4b878' : 'rgba(248,246,240,0.5)',
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <button onClick={handlePost} className="btn-gold" style={{ fontSize: '12px', padding: '8px 18px' }}>
              发布
            </button>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              style={{
                padding: '5px 14px', fontSize: '12px',
                borderRadius: '20px', cursor: 'pointer',
                background: activeFilter === tag ? 'rgba(212,184,120,0.15)' : 'transparent',
                border: '1px solid ' + (activeFilter === tag ? 'rgba(212,184,120,0.4)' : 'rgba(212,184,120,0.15)'),
                color: activeFilter === tag ? '#d4b878' : 'rgba(248,246,240,0.5)',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((post, i) => (
            <div key={post.id || i} className="card-glass" style={{ padding: '16px 20px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(212,184,120,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#d4b878', fontSize: '12px',
                  }}>
                    {post.nickname[0]}
                  </div>
                  <span style={{ color: '#d4b878', fontSize: '13px', fontWeight: 500 }}>{post.nickname}</span>
                  <span style={{
                    background: 'rgba(212,184,120,0.08)',
                    color: 'rgba(248,246,240,0.5)',
                    fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                  }}>
                    #{post.tag}
                  </span>
                </div>
                <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>{post.time}</span>
              </div>
              <p style={{ color: 'rgba(242,232,208,0.8)', fontSize: '13px', lineHeight: '1.8', margin: 0, marginBottom: '10px' }}>
                {post.text}
              </p>
              <div
                onClick={() => handleLike(post.id)}
                style={{ color: 'rgba(212,184,120,0.4)', fontSize: '11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                ♡ {post.likes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
