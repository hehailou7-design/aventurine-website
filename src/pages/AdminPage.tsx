import { useState, useRef, useEffect, useCallback } from 'react'
import { useContent, defaultContent } from '../context/ContentContext'
import ProfileBoxEditor from '../components/ProfileBoxEditor'
import ImagePicker from '../components/ImagePicker'
import CollaborationEditor from '../components/CollaborationEditor'
import FeedbackReview from '../components/FeedbackReview'
import SponsorshipReview from '../components/SponsorshipReview'
import ContentUpdateReview from '../components/ContentUpdateReview'
import BlackMudReview from '../components/BlackMudReview'
import JoinReview from '../components/JoinReview'
import SubmitReview from '../components/SubmitReview'
import SupportRecordEditor from '../components/SupportRecordEditor'
import PageBuilder from '../components/pageBuilder/PageBuilder'
import ImageCropper from '../components/ImageCropper'
import { getGitHubToken, setGitHubToken } from '../lib/github-publish'

// —— 类型 ———
type PageSection =
  | 'home' | 'character' | 'profileBoxes' | 'materials' | 'collaboration'
  | 'chronicle' | 'blackMud' | 'submit' | 'account'
  | 'profile' | 'blessings' | 'images' | 'admins'
  | 'feedbackReview' | 'sponsorshipReview' | 'blackMudReview' | 'contentUpdateReview'
  | 'joinReview' | 'submitReview'
  | 'supportRecord' | 'theme'
  | 'siteConfig'
  | 'pageBuilder'

// —— 通用组件 ———
export function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '4px' }}>{label}</div>
      {children}
    </div>
  )
}

export function TextInput({ value, onChange, multiline, rows }: {
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

export function ArrayEditor<T>({
  title, items, onChange, fields, onAdd,
}: {
  title: string; items: T[]; onChange: (items: T[]) => void;
  fields: { key: keyof T; label: string; multiline?: boolean; type?: string }[];
  onAdd: () => void;
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ color: '#d4b878', fontSize: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{title}（{items.length}）</span>
        <button onClick={onAdd} style={{ background: 'rgba(212,184,120,0.15)', border: '1px solid rgba(212,184,120,0.3)', borderRadius: '4px', color: '#d4b878', fontSize: '11px', padding: '2px 8px', cursor: 'pointer' }}>+ 添加</button>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ marginBottom: '8px', padding: '8px', background: 'rgba(212,184,120,0.03)', border: '1px solid rgba(212,184,120,0.1)', borderRadius: '6px' }}>
          <div style={{ color: 'rgba(248,246,240,0.4)', fontSize: '10px', marginBottom: '4px' }}>#{i + 1}</div>
          {fields.map(f => (
            <FormGroup key={String(f.key)} label={f.label}>
              {f.type === 'image' ? (
                <ImagePicker
                  value={(item[f.key] as unknown as string) || ''}
                  onChange={v => { const next = [...items]; (next[i] as any)[f.key] = v; onChange(next) }}
                />
              ) : (
                <TextInput value={(item[f.key] as unknown as string) || ''} onChange={v => { const next = [...items]; (next[i] as any)[f.key] = v; onChange(next) }} multiline={f.multiline} />
              )}
            </FormGroup>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: 'rgba(224,96,96,0.15)', border: '1px solid rgba(224,96,96,0.3)', borderRadius: '4px', color: '#e06060', fontSize: '10px', padding: '2px 6px', cursor: 'pointer' }}>删除</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// —— 各板块编辑器 ———
function HomeEditor({ content, onUpdate }: { content: typeof defaultContent.home; onUpdate: (path: string, v: any) => void }) {
  return (
    <div>
      <h3 style={{ color: '#d4b878', fontSize: '14px', marginBottom: '12px' }}>横幅幻灯片</h3>
      <ArrayEditor title="横幅" items={content.bannerSlides} onChange={v => onUpdate('home.bannerSlides', v)}
        fields={[{ key: 'tagline', label: '标题' }, { key: 'subtitle', label: '副标题' }, { key: 'accent', label: '强调色' }, { key: 'image', label: '图片', type: 'image' }]}
        onAdd={() => onUpdate('home.bannerSlides', [...content.bannerSlides, { tagline: '', subtitle: '', accent: '#d4b878', image: '' }])}
      />
      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>导航卡片</h3>
      <ArrayEditor title="导航卡片" items={content.navCards} onChange={v => onUpdate('home.navCards', v)}
        fields={[{ key: 'label', label: '标签' }, { key: 'desc', label: '描述' }]}
        onAdd={() => onUpdate('home.navCards', [...content.navCards, { key: '', icon: '', label: '', desc: '', color: '#d4b878' }])}
      />
    </div>
  )
}

function CharacterEditor({ content, onUpdate }: { content: typeof defaultContent.character; onUpdate: (path: string, v: any) => void }) {
  return (
    <div>
      <FormGroup label="角色介绍">
        <TextInput value={content.intro} onChange={v => onUpdate('character.intro', v)} multiline rows={3} />
      </FormGroup>
      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>技能列表</h3>
      <ArrayEditor title="技能" items={content.skills || []} onChange={v => onUpdate('character.skills', v)}
        fields={[{ key: 'name_zh', label: '中文名' }, { key: 'type', label: '类型' }, { key: 'desc_zh', label: '描述', multiline: true }]}
        onAdd={() => onUpdate('character.skills', [...(content.skills || []), { key: '', name_zh: '', name_en: '', type: '', desc_zh: '', desc_en: '', icon: '' }])}
      />
    </div>
  )
}

function MaterialsEditor({ content, onUpdate }: { content: typeof defaultContent.materials; onUpdate: (path: string, v: any) => void }) {
  return (
    <div>
      <h3 style={{ color: '#d4b878', fontSize: '14px', marginBottom: '12px' }}>官方原画</h3>
      <ArrayEditor title="官方物料" items={content.official} onChange={v => onUpdate('materials.official', v)}
        fields={[
          { key: 'title', label: '标题' },
          { key: 'desc', label: '卡片描述' },
          { key: 'detailDesc', label: '详情页描述（支持长文本）', multiline: true },
          { key: 'image', label: '图片', type: 'image' },
          { key: 'date', label: '日期' },
          { key: 'link', label: '外部链接' },
        ]}
        onAdd={() => onUpdate('materials.official', [...content.official, { title: '', desc: '', detailDesc: '', tag: '', image: '', date: '', link: '', clickAction: 'none' }])}
      />
      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>线下物料</h3>
      <ArrayEditor title="线下物料" items={content.offline} onChange={v => onUpdate('materials.offline', v)}
        fields={[
          { key: 'title', label: '标题' },
          { key: 'desc', label: '卡片描述' },
          { key: 'detailDesc', label: '详情页描述（支持长文本）', multiline: true },
          { key: 'image', label: '图片', type: 'image' },
          { key: 'date', label: '日期' },
        ]}
        onAdd={() => onUpdate('materials.offline', [...content.offline, { title: '', desc: '', detailDesc: '', tag: '', image: '', date: '' }])}
      />
    </div>
  )
}

function ChronicleEditor({ content, onUpdate }: { content: typeof defaultContent.chronicle; onUpdate: (path: string, v: any) => void }) {
  return (
    <div>
      <FormGroup label="时间线标题">
        <TextInput value={content.timelineTitle} onChange={v => onUpdate('chronicle.timelineTitle', v)} />
      </FormGroup>
      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>事件列表</h3>
      <ArrayEditor title="事件" items={content.events} onChange={v => onUpdate('chronicle.events', v)}
        fields={[{ key: 'date', label: '日期' }, { key: 'title', label: '标题' }, { key: 'desc', label: '描述' }, { key: 'image', label: '图片', type: 'image' }]}
        onAdd={() => onUpdate('chronicle.events', [...content.events, { date: '', title: '', desc: '', image: '' }])}
      />
    </div>
  )
}

// —— 网站外观设置 ———
function SiteConfigEditor({ content, onUpdate }: { content: any; onUpdate: (path: string, v: any) => void }) {
  const sc = content.siteConfig || {}
  return (
    <div>
      <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '16px', lineHeight: '1.6' }}>
        在这里自定义网站的外观：标题、副标题、Logo 和页头背景图。<br/>
        <span style={{ color: '#d4b878' }}>提示：</span>修改后点击底部「发布到全站」按钮，所有人都能看到。
      </p>

      <FormGroup label="网站标题">
        <TextInput value={sc.siteTitle || ''} onChange={v => onUpdate('siteConfig.siteTitle', v)} />
      </FormGroup>
      <FormGroup label="网站副标题">
        <TextInput value={sc.siteSubtitle || ''} onChange={v => onUpdate('siteConfig.siteSubtitle', v)} />
      </FormGroup>

      <FormGroup label="网站 Logo（图片 URL 或上传）">
        <ImagePicker
          value={sc.logoUrl || ''}
          onChange={v => onUpdate('siteConfig.logoUrl', v)}
          label="上传 Logo（建议 200×60px）"
        />
      </FormGroup>

      <FormGroup label="页头背景图（图片 URL 或上传）">
        <ImagePicker
          value={sc.headerImage || ''}
          onChange={v => onUpdate('siteConfig.headerImage', v)}
          label="上传页头背景图（建议 1920×400px）"
        />
      </FormGroup>

      <FormGroup label="Favicon（浏览器标签页图标）">
        <ImagePicker
          value={sc.favicon || ''}
          onChange={v => onUpdate('siteConfig.favicon', v)}
          label="上传 Favicon（建议 64×64px）"
        />
      </FormGroup>

      {/* 预览 */}
      <div style={{
        marginTop: '20px', padding: '16px',
        background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '12px',
      }}>
        <div style={{ color: '#d4b878', fontSize: '12px', marginBottom: '8px' }}>📱 预览</div>
        <div style={{
          background: sc.headerImage ? `url(${sc.headerImage}) center/cover` : 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
          borderRadius: '8px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
          minHeight: '60px',
        }}>
          {sc.logoUrl && (
            <img src={sc.logoUrl} alt="logo" style={{ height: '36px', width: 'auto', borderRadius: '4px' }} />
          )}
          <div>
            <div style={{ color: '#d4b878', fontSize: '14px', fontWeight: 600 }}>{sc.siteTitle || '砂金全球应援站'}</div>
            <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px' }}>{sc.siteSubtitle || '我们终将在卡卡瓦的极光下重逢'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// —— 主组件 ———
export default function AdminPage({ onLogout }: { onLogout?: () => void }) {
  const { content, updateContent, resetContent, isDirty, publishContent, isPublishing, syncToSite, lastPublishResult } = useContent()
  const [activeSection, setActiveSection] = useState<PageSection>('home')
  const [saved, setSaved] = useState(false)
  const [publishMsg, setPublishMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [ghToken, setGhToken] = useState(() => getGitHubToken())
  const [showTokenInput, setShowTokenInput] = useState(false)

  const handleSyncToSite = () => {
    syncToSite()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handlePublish = async () => {
    setPublishMsg(null)
    const result = await publishContent()
    setPublishMsg({
      type: result.success ? 'success' : 'error',
      text: result.message,
    })
  }

  const handleUpdate = (path: string, value: any) => {
    updateContent(path, value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const fullData = JSON.stringify(content, null, 2)
    const blob = new Blob([fullData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aventurine-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string
        const data = JSON.parse(text)
        const saveData = computeDiffForImport(data)
        localStorage.setItem('aventurine_site_content', JSON.stringify(saveData))
        alert('✅ 导入成功！页面将刷新以加载新数据。')
        window.location.reload()
      } catch {
        alert('❌ 文件格式无效，请确保上传的是正确的备份文件。')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const computeDiffForImport = (fullData: any): Record<string, unknown> => {
    const diff: Record<string, unknown> = {}
    for (const key of Object.keys(defaultContent)) {
      const dv = (defaultContent as any)[key]
      const fv = fullData[key]
      if (fv === undefined || fv === null) continue
      if (JSON.stringify(dv) !== JSON.stringify(fv)) {
        diff[key] = fv
      }
    }
    return diff
  }

  const sections: { key: PageSection; label: string; icon: string }[] = [
    { key: 'home', label: '首页', icon: '◈' },
    { key: 'character', label: '角色设定', icon: '◆' },
    { key: 'profileBoxes', label: '角色设定框', icon: '◈' },
    { key: 'materials', label: '角色物料', icon: '◇' },
    { key: 'collaboration', label: '官方联动', icon: '★' },
    { key: 'chronicle', label: '编年史', icon: '◈' },
    { key: 'siteConfig', label: '网站外观', icon: '🎨' },
    { key: 'theme', label: '主题设置', icon: '🎨' },
    // 审核板块
    { key: 'feedbackReview', label: '意见反馈审核', icon: '📝' },
    { key: 'sponsorshipReview', label: '生贺组应聘审核', icon: '🎉' },
    { key: 'contentUpdateReview', label: '板块更新审核', icon: '📋' },
    { key: 'blackMudReview', label: '黑泥区审核', icon: '🔒' },
    { key: 'joinReview', label: '应援报名审核', icon: '✋' },
    { key: 'submitReview', label: '动态投稿审核', icon: '📰' },
    // 应援记录
    { key: 'supportRecord', label: '生贺应援', icon: '📼' },
    // 页面构建器
    { key: 'pageBuilder', label: '页面构建器', icon: '🎨' },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <HomeEditor content={content.home} onUpdate={handleUpdate} />
      case 'character': return <CharacterEditor content={content.character} onUpdate={handleUpdate} />
      case 'profileBoxes': return <ProfileBoxEditor onUpdate={handleUpdate} />
      case 'materials': return <MaterialsEditor content={content.materials} onUpdate={handleUpdate} />
      case 'collaboration': return <CollaborationEditor content={content.collaboration} onUpdate={handleUpdate} />
      case 'chronicle': return <ChronicleEditor content={content.chronicle} onUpdate={handleUpdate} />
      case 'siteConfig': return <SiteConfigEditor content={content} onUpdate={handleUpdate} />
      case 'feedbackReview': return <FeedbackReview />
      case 'sponsorshipReview': return <SponsorshipReview />
      case 'contentUpdateReview': return <ContentUpdateReview />
      case 'blackMudReview': return <BlackMudReview />
      case 'joinReview': return <JoinReview />
      case 'submitReview': return <SubmitReview />
      case 'supportRecord': return <SupportRecordEditor content={content.supportRecord} onUpdate={handleUpdate} />
      case 'pageBuilder': return (
        <PageBuilder
          pageId="custom-page"
          pageName="自定义页面"
          onSave={(data) => {
            updateContent('pageBuilder', data)
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
          }}
          initialData={content.pageBuilder || null}
        />
      )
      default: return <HomeEditor content={content.home} onUpdate={handleUpdate} />
    }
  }

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
          <h1 style={{ color: '#d4b878', fontSize: '20px', fontWeight: 700 }}>后台管理</h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                if (onLogout) onLogout()
                else window.location.href = '/'
              }}
              style={{
                background: 'rgba(212,184,120,0.15)',
                border: '1px solid rgba(212,184,120,0.3)',
                borderRadius: '6px',
                color: '#d4b878',
                fontSize: '12px',
                padding: '6px 16px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.background = 'rgba(212,184,120,0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.background = 'rgba(212,184,120,0.15)'
              }}
            >
              ← 返回网站
            </button>

            {/* Token 设置 & 发布按钮 */}
            {!ghToken && (
              <button
                onClick={() => setShowTokenInput(!showTokenInput)}
                style={{
                  background: 'rgba(224,180,80,0.15)', border: '1px solid rgba(224,180,80,0.3)',
                  borderRadius: '6px', color: '#e0b450', fontSize: '12px',
                  padding: '6px 12px', cursor: 'pointer', fontWeight: 600,
                }}
              >
                🔑 设置 Token
              </button>
            )}
            {ghToken && (
              <button
                onClick={() => setShowTokenInput(!showTokenInput)}
                style={{
                  background: 'rgba(100,180,120,0.15)', border: '1px solid rgba(100,180,120,0.3)',
                  borderRadius: '6px', color: '#8cba6a', fontSize: '12px',
                  padding: '6px 12px', cursor: 'pointer', fontWeight: 600,
                }}
              >
                ✅ Token 已配置
              </button>
            )}

            {/* 同步到全站 & 发布按钮 */}
            <button
              onClick={handleSyncToSite}
              style={{
                background: isDirty ? 'linear-gradient(135deg, #64b878, #4a9a5a)' : 'rgba(100,180,120,0.15)',
                border: '1px solid rgba(100,180,120,0.3)',
                borderRadius: '6px',
                color: isDirty ? '#121212' : '#8cba6a',
                fontSize: '12px',
                padding: '6px 16px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(100,184,120,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              🔄 同步到全站
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              style={{
                background: isPublishing ? 'rgba(100,180,120,0.1)' : 'linear-gradient(135deg, #64b878, #4a9a5a)',
                border: 'none',
                borderRadius: '6px',
                color: isPublishing ? '#8cba8a' : '#121212',
                fontSize: '12px',
                padding: '6px 16px',
                cursor: isPublishing ? 'default' : 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}
              onMouseEnter={(e) => {
                if (!isPublishing) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(100,184,120,0.4)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {isPublishing ? '⏳ 发布中...' : '🚀 发布到全站'}
            </button>

            {saved && <span style={{ color: '#9cba8a', fontSize: '12px' }}>✓ 已保存</span>}
            {isDirty && <button onClick={() => { resetContent(); setSaved(true); setTimeout(() => setSaved(false), 2000) }} style={{ background: 'rgba(212,184,120,0.15)', border: '1px solid rgba(212,184,120,0.3)', borderRadius: '6px', color: '#d4b878', fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}>恢复默认</button>}
            <button onClick={handleExport} style={{ background: 'rgba(100,180,120,0.15)', border: '1px solid rgba(100,180,120,0.3)', borderRadius: '6px', color: '#8cba6a', fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}>
              📥 导出数据
            </button>
            <button onClick={handleImport} style={{ background: 'rgba(160,140,210,0.15)', border: '1px solid rgba(160,140,210,0.3)', borderRadius: '6px', color: '#b0a0d8', fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}>
              📤 导入数据
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
            <button onClick={onLogout || (() => window.location.reload())} style={{ background: 'rgba(224,96,96,0.15)', border: '1px solid rgba(224,96,96,0.3)', borderRadius: '6px', color: '#e06060', fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}>退出登录</button>
          </div>
        </div>

        {/* 同步说明 */}
        {!isDirty && (
          <div style={{
            padding: '10px 16px', borderRadius: '8px', marginBottom: '16px',
            background: 'rgba(100,180,120,0.08)', border: '1px solid rgba(100,180,120,0.2)',
            color: '#8cba6a', fontSize: '13px',
          }}>
            💡 <b>🔄 同步到全站</b>：保存快照，本设备前台刷新即见<br />
            💡 <b>🚀 发布到全站</b>：一键推送到 GitHub → 自动部署 → 2 分钟后 aventurine0505.xyz 全站生效
          </div>
        )}

        {/* Token 设置面板 */}
        {showTokenInput && (
          <div style={{
            padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
            background: 'rgba(224,180,80,0.06)', border: '1px solid rgba(224,180,80,0.2)',
          }}>
            <div style={{ fontSize: '13px', color: '#e0b450', marginBottom: '8px' }}>
              🔑 GitHub Personal Access Token（一键发布必需）
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="password"
                value={ghToken}
                onChange={(e) => setGhToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: '6px',
                  background: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f8f6f0', fontSize: '13px', fontFamily: 'monospace',
                }}
              />
              <button
                onClick={() => {
                  setGitHubToken(ghToken)
                  setShowTokenInput(false)
                }}
                style={{
                  padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #64b878, #4a9a5a)',
                  border: 'none', color: '#121212', fontSize: '13px', fontWeight: 600,
                }}
              >
                保存
              </button>
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
              如何获取？访问 github.com → Settings → Developer settings → Personal access tokens → Tokens (classic) → 勾选 repo 权限
            </div>
          </div>
        )}

        {/* 发布结果消息 */}
        {publishMsg && (
          <div style={{
            padding: '10px 16px', borderRadius: '8px', marginBottom: '16px',
            background: publishMsg.type === 'success' ? 'rgba(100,180,120,0.08)' : 'rgba(224,96,96,0.08)',
            border: publishMsg.type === 'success' ? '1px solid rgba(100,180,120,0.2)' : '1px solid rgba(224,96,96,0.2)',
            color: publishMsg.type === 'success' ? '#8cba6a' : '#e06060',
            fontSize: '13px', whiteSpace: 'pre-line',
          }}>
            {publishMsg.type === 'success' ? '✅ ' : '❌ '}{publishMsg.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
          {/* 侧边栏 */}
          <div style={{ background: 'rgba(26,26,26,0.6)', border: '1px solid rgba(212,184,120,0.1)', borderRadius: '12px', padding: '12px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {sections.map(s => (
              <div key={s.key} onClick={() => setActiveSection(s.key)}
                style={{
                  padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '4px',
                  background: activeSection === s.key ? 'rgba(212,184,120,0.15)' : 'transparent',
                  color: activeSection === s.key ? '#d4b878' : 'rgba(248,246,240,0.5)',
                  fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* 内容区 */}
          <div style={{ background: 'rgba(26,26,26,0.4)', border: '1px solid rgba(212,184,120,0.1)', borderRadius: '12px', padding: '20px', minHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  )
}
