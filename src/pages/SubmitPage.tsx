import { useState } from 'react'

type SubmitType = 'news' | 'photo' | 'update' | 'feedback' | 'sponsorship'

// ============ localStorage keys ============
const FEEDBACK_PENDING_KEY = 'aventurine_feedback_pending'
const SPONSORSHIP_PENDING_KEY = 'aventurine_sponsorship_pending'
const CONTENT_UPDATE_PENDING_KEY = 'aventurine_content_update_pending'

export default function SubmitPage() {
  const [type, setType] = useState<SubmitType>('news')

  // 通用表单
  const [form, setForm] = useState({
    name: '',
    contact: '',
    title: '',
    content: '',
    reason: '',
    targetPage: '',
    rating: 5,
    experience: '',
    contribution: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.content.trim()) return

    if (type === 'feedback') {
      // 意见反馈
      const pending = JSON.parse(localStorage.getItem(FEEDBACK_PENDING_KEY) || '[]')
      pending.push({
        id: 'feedback_' + Date.now().toString(36),
        nickname: form.name || '匿名',
        email: form.contact || '',
        content: form.content,
        rating: form.rating || 5,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      })
      localStorage.setItem(FEEDBACK_PENDING_KEY, JSON.stringify(pending))
    } else if (type === 'sponsorship') {
      // 生贺组应聘
      const pending = JSON.parse(localStorage.getItem(SPONSORSHIP_PENDING_KEY) || '[]')
      pending.push({
        id: 'sponsorship_' + Date.now().toString(36),
        nickname: form.name || '匿名',
        contact: form.contact || '',
        experience: form.experience || '',
        contribution: form.contribution || '',
        submittedAt: new Date().toISOString(),
        status: 'pending',
      })
      localStorage.setItem(SPONSORSHIP_PENDING_KEY, JSON.stringify(pending))
    } else if (type === 'update') {
      // 板块更新
      const pending = JSON.parse(localStorage.getItem(CONTENT_UPDATE_PENDING_KEY) || '[]')
      pending.push({
        id: 'update_' + Date.now().toString(36),
        nickname: form.name || '匿名',
        section: form.targetPage,
        field: form.title || undefined,
        oldValue: '',  // 用户不知道原值，留空
        newValue: form.content,
        reason: form.reason || '',
        submittedAt: new Date().toISOString(),
        status: 'pending',
      })
      localStorage.setItem(CONTENT_UPDATE_PENDING_KEY, JSON.stringify(pending))
    } else {
      // 最新动态和线下实拍投稿（保留原有逻辑）
      const pending = JSON.parse(localStorage.getItem('aventurine_pending_submits') || '[]')
      pending.push({
        ...form,
        type,
        time: new Date().toISOString(),
        status: 'pending',
      })
      localStorage.setItem('aventurine_pending_submits', JSON.stringify(pending))
    }

    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setForm({ name: '', contact: '', title: '', content: '', reason: '', targetPage: '', rating: 5, experience: '', contribution: '' })
  }

  const renderNewsPhotoForm = () => (
    <>
      {/* 标题 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          标题（选填）
        </label>
        <input
          type="text"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder={type === 'news' ? '如：砂金新周边预售开启' : '如：上海IFC大屏应援实拍'}
          style={{
            width: '100%',
            background: 'rgba(14,14,14,0.8)',
            border: '1px solid rgba(212,184,120,0.3)',
            borderRadius: '8px', padding: '10px 14px',
            color: '#f2e8d0', fontSize: '13px',
            outline: 'none', fontFamily: 'inherit',
          }}
        />
      </div>

      {/* 内容描述 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          {type === 'news' ? '动态内容 *' : '活动描述 *'}
        </label>
        <textarea
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          placeholder={type === 'news' ? '请描述砂金相关的最新动态，包括来源链接更佳...' : '活动时间、地点、应援主题等描述...'}
          required
          style={{
            width: '100%', minHeight: '100px',
            background: 'rgba(14,14,14,0.8)',
            border: '1px solid rgba(212,184,120,0.3)',
            borderRadius: '8px', padding: '10px 14px',
            color: '#f2e8d0', fontSize: '13px',
            resize: 'vertical', outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </>
  )

  const renderFeedbackForm = () => (
    <>
      {/* 满意度评分 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          对网站的满意度
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map(r => (
            <span
              key={r}
              onClick={() => setForm(f => ({ ...f, rating: r }))}
              style={{ fontSize: '24px', cursor: 'pointer', color: r <= form.rating ? '#e0c060' : 'rgba(248,246,240,0.2)' }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* 反馈内容 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          意见反馈内容 *
        </label>
        <textarea
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          placeholder="请写下你对网站的意见、建议或反馈..."
          required
          style={{
            width: '100%', minHeight: '120px',
            background: 'rgba(14,14,14,0.8)',
            border: '1px solid rgba(212,184,120,0.3)',
            borderRadius: '8px', padding: '10px 14px',
            color: '#f2e8d0', fontSize: '13px',
            resize: 'vertical', outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </>
  )

  const renderSponsorshipForm = () => (
    <>
      {/* 相关经验 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          相关经验（选填）
        </label>
        <textarea
          value={form.experience}
          onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
          placeholder="请描述你参与过的应援活动、粉丝组织经验等..."
          style={{
            width: '100%', minHeight: '80px',
            background: 'rgba(14,14,14,0.8)',
            border: '1px solid rgba(212,184,120,0.3)',
            borderRadius: '8px', padding: '10px 14px',
            color: '#f2e8d0', fontSize: '13px',
            resize: 'vertical', outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* 可以贡献的内容 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          可以贡献的内容 *
        </label>
        <textarea
          value={form.contribution}
          onChange={e => setForm(f => ({ ...f, contribution: e.target.value }))}
          placeholder="请描述你可以为砂金生贺组贡献什么（如：绘图、视频剪辑、文案、线下组织等）..."
          required
          style={{
            width: '100%', minHeight: '100px',
            background: 'rgba(14,14,14,0.8)',
            border: '1px solid rgba(212,184,120,0.3)',
            borderRadius: '8px', padding: '10px 14px',
            color: '#f2e8d0', fontSize: '13px',
            resize: 'vertical', outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
    </>
  )

  const renderUpdateForm = () => (
    <>
      {/* 板块选择 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          选择要更新的板块 *
        </label>
        <select
          value={form.targetPage}
          onChange={e => setForm(f => ({ ...f, targetPage: e.target.value }))}
          required
          style={{
            width: '100%',
            background: 'rgba(14,14,14,0.8)',
            border: '1px solid rgba(212,184,120,0.3)',
            borderRadius: '8px', padding: '10px 14px',
            color: '#f2e8d0', fontSize: '13px',
            outline: 'none', fontFamily: 'inherit',
          }}
        >
          <option value="">-- 请选择板块 --</option>
          <option value="home">首页</option>
          <option value="character">角色设定</option>
          <option value="materials">角色物料</option>
          <option value="collaboration">官方联动</option>
          <option value="chronicle">编年史</option>
          <option value="strength">强度专区</option>
          <option value="blackMud">黑泥区</option>
          <option value="submit">投稿区</option>
          <option value="blessings">祝福区</option>
          <option value="supportRecord">应援记录</option>
        </select>
      </div>

      {/* 更新内容 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          更新内容 *
        </label>
        <textarea
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          placeholder="请填写要添加或更新的内容..."
          required
          style={{
            width: '100%', minHeight: '100px',
            background: 'rgba(14,14,14,0.8)',
            border: '1px solid rgba(212,184,120,0.3)',
            borderRadius: '8px', padding: '10px 14px',
            color: '#f2e8d0', fontSize: '13px',
            resize: 'vertical', outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* 修改理由 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
          修改理由 *
        </label>
        <input
          type="text"
          value={form.reason}
          onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
          placeholder="请说明为什么要更新此板块内容..."
          required
          style={{
            width: '100%',
            background: 'rgba(14,14,14,0.8)',
            border: '1px solid rgba(212,184,120,0.3)',
            borderRadius: '8px', padding: '10px 14px',
            color: '#f2e8d0', fontSize: '13px',
            outline: 'none', fontFamily: 'inherit',
          }}
        />
      </div>
    </>
  )

  const tabConfig = [
    { key: 'news' as SubmitType, label: '📰 最新动态', desc: '投稿砂金相关最新动态' },
    { key: 'photo' as SubmitType, label: '📷 线下实拍', desc: '上传线下应援活动照片' },
    { key: 'update' as SubmitType, label: '✏️ 板块更新', desc: '提交板块内容更新建议' },
    { key: 'feedback' as SubmitType, label: '📝 意见反馈', desc: '对网站的意见和建议' },
    { key: 'sponsorship' as SubmitType, label: '🎉 生贺组应聘', desc: '申请加入生日庆祝团队' },
  ]

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto px-4 md:px-8">
        <h2 className="section-title">投稿区</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '20px', marginTop: '-8px' }}>
          游客无需登录即可投稿，管理员审核通过后会展示在对应板块
        </p>

        {/* Type Toggle */}
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          background: 'rgba(26,26,26,0.8)',
          border: '1px solid rgba(212,184,120,0.2)',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '28px',
        }}>
          {tabConfig.map(t => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              style={{
                flex: 1, padding: '10px 6px',
                fontSize: '12px',
                borderRadius: '8px', border: 'none',
                background: type === t.key ? 'rgba(212,184,120,0.15)' : 'transparent',
                color: type === t.key ? '#d4b878' : 'rgba(248,246,240,0.5)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="card-glass" style={{ padding: '28px', borderRadius: '12px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              color: '#d4b878', fontSize: '11px',
              letterSpacing: '0.15em', marginBottom: '4px',
            }}>
              ● {tabConfig.find(t => t.key === type)?.desc || '投稿'}
            </div>
            <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
              {type === 'news' && '请描述砂金相关的最新动态，包括来源链接更佳。'}
              {type === 'photo' && '上传线下应援活动、大屏投放、线下聚会的现场实拍照片，记录每一个珍贵瞬间。'}
              {type === 'update' && '选择要更新的板块，填写新的内容，管理员审核通过后即生效。'}
              {type === 'feedback' && '你的意见对我们非常重要，帮助我们改进网站体验。'}
              {type === 'sponsorship' && '申请加入砂金生贺组，一起为砂金筹备生日庆祝活动。'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* 称呼/联系方式（所有类型共用） */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  称呼（选填）
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="怎么称呼你？"
                  style={{
                    width: '100%',
                    background: 'rgba(14,14,14,0.8)',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '8px', padding: '10px 14px',
                    color: '#f2e8d0', fontSize: '13px',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>
              <div>
                <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                  联系方式（选填）
                </label>
                <input
                  type="text"
                  value={form.contact}
                  onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                  placeholder="微信/QQ/邮箱"
                  style={{
                    width: '100%',
                    background: 'rgba(14,14,14,0.8)',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '8px', padding: '10px 14px',
                    color: '#f2e8d0', fontSize: '13px',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            {/* 渲染各类型专属表单 */}
            {type === 'news' || type === 'photo' ? renderNewsPhotoForm() : null}
            {type === 'feedback' ? renderFeedbackForm() : null}
            {type === 'sponsorship' ? renderSponsorshipForm() : null}
            {type === 'update' ? renderUpdateForm() : null}

            {/* Notice */}
            <div style={{
              background: 'rgba(212,184,120,0.04)',
              border: '1px solid rgba(212,184,120,0.15)',
              borderRadius: '8px', padding: '12px',
              marginBottom: '20px',
              color: 'rgba(248,246,240,0.4)', fontSize: '11px', lineHeight: '1.8',
            }}>
              投稿须知：① 请确保内容真实有效 ② 审核通过后将展示于对应板块 ③ 恶意虚假信息将被拒稿 ④ 游客无需登录即可投稿{type === 'update' ? ' ⑤ 板块更新需注明修改理由' : ''}
            </div>

            {/* Submit Button */}
            {submitted ? (
              <div style={{
                textAlign: 'center', padding: '12px',
                color: '#d4b878', fontSize: '14px',
                border: '1px solid rgba(212,184,120,0.3)',
                borderRadius: '8px', background: 'rgba(212,184,120,0.08)',
              }}>
                ✓ 投稿已提交，等待管理员审核
              </div>
            ) : (
              <button
                type="submit"
                className="btn-gold"
                style={{ width: '100%', padding: '12px', fontSize: '14px', letterSpacing: '0.1em' }}
              >
                提交投稿 ↗
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
