import { useState, useRef, useEffect } from 'react'
import { useContent, defaultContent } from '../context/ContentContext'
import ProfileBoxEditor from '../components/ProfileBoxEditor'
import ImagePicker from '../components/ImagePicker'
import CollaborationEditor from '../components/CollaborationEditor'
import FeedbackReview from '../components/FeedbackReview'
import SponsorshipReview from '../components/SponsorshipReview'
import ContentUpdateReview from '../components/ContentUpdateReview'
import BlackMudReview from '../components/BlackMudReview'
import SupportRecordEditor from '../components/SupportRecordEditor'
import PageBuilder from '../components/pageBuilder/PageBuilder'

// —— 类型 ———
type PageSection =
  | 'home' | 'character' | 'profileBoxes' | 'materials' | 'collaboration'
  | 'chronicle' | 'blackMud' | 'submit' | 'account'
  | 'profile' | 'blessings' | 'images' | 'admins'
  | 'feedbackReview' | 'sponsorshipReview' | 'blackMudReview' | 'contentUpdateReview'
  | 'supportRecord' | 'theme'
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
        fields={[{ key: 'title', label: '标题' }, { key: 'desc', label: '描述' }, { key: 'image', label: '图片', type: 'image' }, { key: 'date', label: '日期' }, { key: 'link', label: '链接' }]}
        onAdd={() => onUpdate('materials.official', [...content.official, { title: '', desc: '', tag: '', image: '', date: '', link: '', clickAction: 'none' }])}
      />
      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>线下物料</h3>
      <ArrayEditor title="线下物料" items={content.offline} onChange={v => onUpdate('materials.offline', v)}
        fields={[{ key: 'title', label: '标题' }, { key: 'desc', label: '描述' }, { key: 'image', label: '图片', type: 'image' }, { key: 'date', label: '日期' }]}
        onAdd={() => onUpdate('materials.offline', [...content.offline, { title: '', desc: '', tag: '', image: '', date: '' }])}
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

// —— 主组件 ———
export default function AdminPage({ onLogout }: { onLogout?: () => void }) {
  const { content, updateContent, resetContent, isDirty } = useContent()
  const [activeSection, setActiveSection] = useState<PageSection>('home')
  const [saved, setSaved] = useState(false)

  const handleUpdate = (path: string, value: any) => {
    updateContent(path, value)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections: { key: PageSection; label: string; icon: string }[] = [
    { key: 'home', label: '首页', icon: '◈' },
    { key: 'character', label: '角色设定', icon: '◆' },
    { key: 'profileBoxes', label: '角色设定框', icon: '◈' },
    { key: 'materials', label: '角色物料', icon: '◇' },
    { key: 'collaboration', label: '官方联动', icon: '★' },
    { key: 'chronicle', label: '编年史', icon: '◈' },
    // 审核板块
    { key: 'feedbackReview', label: '意见反馈审核', icon: '📝' },
    { key: 'sponsorshipReview', label: '生贺组应聘审核', icon: '🎉' },
    { key: 'contentUpdateReview', label: '板块更新审核', icon: '📋' },
    { key: 'blackMudReview', label: '黑泥区审核', icon: '🔒' },
    // 应援记录
    { key: 'supportRecord', label: '应援记录', icon: '📼' },
    // 页面构建器
    { key: 'pageBuilder', label: '页面构建器', icon: '🎨' },
  ]

  const section = (() => {
    switch (activeSection) {
      case 'home': return content.home
      case 'character': return content.character
      case 'profileBoxes': return content.character
      case 'materials': return content.materials
      case 'collaboration': return content.collaboration
      case 'chronicle': return content.chronicle
      default: return content.home
    }
  })()

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: '#d4b878', fontSize: '20px', fontWeight: 700 }}>后台管理</h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              onClick={() => {
                // 返回前台网站
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
            <button 
              onClick={() => {
                // 手动触发保存（实际上ContentContext已经自动保存）
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
                alert('✓ 所有更改已保存到本地存储！')
              }} 
              style={{ 
                background: 'linear-gradient(135deg, #d4b878, #a8893a)', 
                border: 'none', 
                borderRadius: '6px', 
                color: '#121212', 
                fontSize: '12px', 
                padding: '6px 16px', 
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(212, 184, 120, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              💾 保存更改
            </button>
            {saved && <span style={{ color: '#9cba8a', fontSize: '12px' }}>✓ 已保存</span>}
            {isDirty && <button onClick={() => { resetContent(); setSaved(true); setTimeout(() => setSaved(false), 2000) }} style={{ background: 'rgba(212,184,120,0.15)', border: '1px solid rgba(212,184,120,0.3)', borderRadius: '6px', color: '#d4b878', fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}>恢复默认</button>}
            <button onClick={onLogout || (() => window.location.reload())} style={{ background: 'rgba(224,96,96,0.15)', border: '1px solid rgba(224,96,96,0.3)', borderRadius: '6px', color: '#e06060', fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}>退出登录</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
          {/* 侧边栏 */}
          <div style={{ background: 'rgba(26,26,26,0.6)', border: '1px solid rgba(212,184,120,0.1)', borderRadius: '12px', padding: '12px' }}>
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
          <div style={{ background: 'rgba(26,26,26,0.4)', border: '1px solid rgba(212,184,120,0.1)', borderRadius: '12px', padding: '20px' }}>
            {activeSection === 'home' && <HomeEditor content={content.home} onUpdate={handleUpdate} />}
            {activeSection === 'character' && <CharacterEditor content={content.character} onUpdate={handleUpdate} />}
            {activeSection === 'profileBoxes' && <ProfileBoxEditor onUpdate={handleUpdate} />}
            {activeSection === 'materials' && <MaterialsEditor content={content.materials} onUpdate={handleUpdate} />}
            {activeSection === 'collaboration' && <CollaborationEditor content={content.collaboration} onUpdate={handleUpdate} />}
            {activeSection === 'chronicle' && <ChronicleEditor content={content.chronicle} onUpdate={handleUpdate} />}
            {activeSection === 'feedbackReview' && <FeedbackReview />}
            {activeSection === 'sponsorshipReview' && <SponsorshipReview />}
            {activeSection === 'contentUpdateReview' && <ContentUpdateReview />}
            {activeSection === 'blackMudReview' && <BlackMudReview />}
            {activeSection === 'supportRecord' && <SupportRecordEditor content={content.supportRecord} onUpdate={handleUpdate} />}
            {activeSection === 'pageBuilder' && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
