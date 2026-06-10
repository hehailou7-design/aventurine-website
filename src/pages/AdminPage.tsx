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
  | 'supportRecord' | 'offlineFeedback' | 'theme'
  | 'siteConfig'
  | 'pageBuilder'
  | 'calendar' | 'sashaSay' | 'materialTable' | 'countdown'

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
        <span style={{ color: '#d4b878' }}>提示：</span>修改后点击底部「保存并发布到全站」按钮，所有人都能看到。
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

// —— 砂金日历编辑器 ———
function CalendarEditor({ content, onUpdate }: { content: any; onUpdate: (path: string, v: any) => void }) {
  const events: any[] = content.calendar?.events || []
  const ANIMAL_STICKERS = ['🐱', '🐰', '🐼', '🐨', '🦊', '🐸', '🐻', '🐶', '🐭', '🐹', '🐯', '🦁', '🐮', '🐷', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄', '🐝', '🐞', '🦋', '🐌', '🐙', '🦀', '🐠', '🐳', '🦕', '🌟', '💫', '✨', '🎀', '💎', '🍀', '🌸', '🌺', '🌻', '🍓', '🍰']
  return (
    <div>
      <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '16px', lineHeight: '1.6' }}>
        编辑砂金日历上的事件。选择可爱的动物贴纸来标记特别的日子。<br/>
        <span style={{ color: '#e898b8' }}>提示：</span>日期格式为 MM-DD（如 05-05 表示5月5日）。
      </p>
      <h3 style={{ color: '#e898b8', fontSize: '14px', marginBottom: '12px', marginTop: '24px' }}>
        📅 日历事件（{events.length} 个）
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {events.map((event: any, idx: number) => (
          <div key={event.id || idx} style={{
            background: 'rgba(232,152,184,0.05)', border: '1px solid rgba(232,152,184,0.15)',
            borderRadius: '12px', padding: '14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#e898b8', fontSize: '13px', fontWeight: 600 }}>
                {event.sticker || '📅'} {event.title || '未命名事件'}
              </span>
              <button onClick={() => {
                const next = events.filter((_, i) => i !== idx)
                onUpdate('calendar.events', next)
              }} style={{ background: 'rgba(224,96,96,0.15)', border: '1px solid rgba(224,96,96,0.3)', borderRadius: '6px', color: '#e06060', fontSize: '11px', padding: '2px 8px', cursor: 'pointer' }}>
                ✕ 删除
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <FormGroup label="日期 (MM-DD)">
                <TextInput value={event.date || ''} onChange={v => {
                  const next = [...events]; next[idx] = { ...next[idx], date: v }; onUpdate('calendar.events', next)
                }} />
              </FormGroup>
              <FormGroup label="贴纸">
                <select value={event.sticker || ''} onChange={e => {
                  const next = [...events]; next[idx] = { ...next[idx], sticker: e.target.value }; onUpdate('calendar.events', next)
                }} style={{ width: '100%', background: '#121212', border: '1px solid rgba(232,152,184,0.3)', borderRadius: '6px', padding: '6px 8px', color: '#f2e8d0', fontSize: '16px', cursor: 'pointer' }}>
                  <option value="">无贴纸</option>
                  {ANIMAL_STICKERS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormGroup>
              <FormGroup label="标题">
                <TextInput value={event.title || ''} onChange={v => {
                  const next = [...events]; next[idx] = { ...next[idx], title: v }; onUpdate('calendar.events', next)
                }} />
              </FormGroup>
              <FormGroup label="描述">
                <TextInput value={event.desc || ''} onChange={v => {
                  const next = [...events]; next[idx] = { ...next[idx], desc: v }; onUpdate('calendar.events', next)
                }} />
              </FormGroup>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => {
        const next = [...events, { id: 'e' + Date.now(), date: '', title: '', desc: '', sticker: '🐱' }]
        onUpdate('calendar.events', next)
      }} style={{
        marginTop: '12px', width: '100%',
        background: 'rgba(232,152,184,0.1)', border: '1px dashed rgba(232,152,184,0.3)',
        borderRadius: '8px', padding: '10px', color: '#e898b8', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
      }}>
        + 添加事件
      </button>
    </div>
  )
}

// —— 砂砂想说编辑器 ———
function SashaSayEditor({ content, onUpdate }: { content: any; onUpdate: (path: string, v: any) => void }) {
  const sashaSay = content.sashaSay || { knowledge: [], gachaQuotes: [], pageTitle: '砂砂想说', subtitle: '', gachaTitle: '扭蛋预言' }
  return (
    <div>
      <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '16px', lineHeight: '1.6' }}>
        编辑砂砂想说板块：冷知识和扭蛋预言。<br/>
        <span style={{ color: '#d4b878' }}>提示：</span>冷知识以云词形式展现，预言稀有度影响扭出概率。
      </p>
      <FormGroup label="页面标题">
        <TextInput value={sashaSay.pageTitle || ''} onChange={v => onUpdate('sashaSay.pageTitle', v)} />
      </FormGroup>
      <FormGroup label="副标题">
        <TextInput value={sashaSay.subtitle || ''} onChange={v => onUpdate('sashaSay.subtitle', v)} />
      </FormGroup>

      {/* 冷知识 */}
      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>
        🧊 冷知识（{sashaSay.knowledge?.length || 0} 条）
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(sashaSay.knowledge || []).map((item: any, idx: number) => (
          <div key={idx} style={{
            background: 'rgba(136,200,216,0.05)', border: '1px solid rgba(136,200,216,0.15)',
            borderRadius: '8px', padding: '10px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#88c8d8', fontSize: '12px', fontWeight: 600 }}>#{idx + 1}</span>
              <button onClick={() => {
                const next = [...sashaSay.knowledge]; next.splice(idx, 1); onUpdate('sashaSay.knowledge', next)
              }} style={{ background: 'rgba(224,96,96,0.1)', border: 'none', borderRadius: '4px', color: '#e06060', fontSize: '11px', cursor: 'pointer', padding: '2px 6px' }}>✕</button>
            </div>
            <FormGroup label="内容">
              <TextInput multiline value={item.text || ''} onChange={v => {
                const next = [...sashaSay.knowledge]; next[idx] = { ...next[idx], text: v }; onUpdate('sashaSay.knowledge', next)
              }} />
            </FormGroup>
            <FormGroup label="来源（选填）">
              <TextInput value={item.source || ''} onChange={v => {
                const next = [...sashaSay.knowledge]; next[idx] = { ...next[idx], source: v }; onUpdate('sashaSay.knowledge', next)
              }} />
            </FormGroup>
          </div>
        ))}
      </div>
      <button onClick={() => {
        const next = [...(sashaSay.knowledge || []), { text: '', source: '' }]
        onUpdate('sashaSay.knowledge', next)
      }} style={{
        marginTop: '8px', width: '100%',
        background: 'rgba(136,200,216,0.1)', border: '1px dashed rgba(136,200,216,0.3)',
        borderRadius: '8px', padding: '10px', color: '#88c8d8', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
      }}>
        + 添加冷知识
      </button>

      {/* 扭蛋预言 */}
      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>
        🎰 扭蛋预言（{sashaSay.gachaQuotes?.length || 0} 条）
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(sashaSay.gachaQuotes || []).map((q: any, idx: number) => (
          <div key={q.id || idx} style={{
            background: q.rarity === 'UR' ? 'rgba(212,184,120,0.08)' : q.rarity === 'SSR' ? 'rgba(212,168,232,0.08)' : 'rgba(136,200,216,0.05)',
            border: `1px solid ${q.rarity === 'UR' ? 'rgba(212,184,120,0.2)' : q.rarity === 'SSR' ? 'rgba(212,168,232,0.2)' : 'rgba(136,200,216,0.15)'}`,
            borderRadius: '8px', padding: '10px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{
                color: q.rarity === 'UR' ? '#d4b878' : q.rarity === 'SSR' ? '#d4a8e8' : '#88c8d8',
                fontSize: '12px', fontWeight: 600,
              }}>{q.rarity} · #{idx + 1}</span>
              <button onClick={() => {
                const next = [...sashaSay.gachaQuotes]; next.splice(idx, 1); onUpdate('sashaSay.gachaQuotes', next)
              }} style={{ background: 'rgba(224,96,96,0.1)', border: 'none', borderRadius: '4px', color: '#e06060', fontSize: '11px', cursor: 'pointer', padding: '2px 6px' }}>✕</button>
            </div>
            <FormGroup label="预言内容">
              <TextInput multiline value={q.text || ''} onChange={v => {
                const next = [...sashaSay.gachaQuotes]; next[idx] = { ...next[idx], text: v }; onUpdate('sashaSay.gachaQuotes', next)
              }} />
            </FormGroup>
            <FormGroup label="稀有度">
              <select value={q.rarity || 'SR'} onChange={e => {
                const next = [...sashaSay.gachaQuotes]; next[idx] = { ...next[idx], rarity: e.target.value }; onUpdate('sashaSay.gachaQuotes', next)
              }} style={{ width: '100%', background: '#121212', border: '1px solid rgba(212,184,120,0.3)', borderRadius: '6px', padding: '6px 8px', color: '#f2e8d0', fontSize: '13px', cursor: 'pointer' }}>
                <option value="SR">SR — 普通（60%）</option>
                <option value="SSR">SSR — 稀有（30%）</option>
                <option value="UR">UR — 极品（10%）</option>
              </select>
            </FormGroup>
          </div>
        ))}
      </div>
      <button onClick={() => {
        const next = [...(sashaSay.gachaQuotes || []), { id: 'q' + Date.now(), text: '', rarity: 'SR' }]
        onUpdate('sashaSay.gachaQuotes', next)
      }} style={{
        marginTop: '8px', width: '100%',
        background: 'rgba(212,184,120,0.1)', border: '1px dashed rgba(212,184,120,0.3)',
        borderRadius: '8px', padding: '10px', color: '#d4b878', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
      }}>
        + 添加预言
      </button>
    </div>
  )
}

// —— 物料表格编辑器 ———
function MaterialTableEditor({ content, onUpdate }: { content: any; onUpdate: (path: string, v: any) => void }) {
  const mt = content.materialTable || { year2024: [], year2025: [], year2026: [] }
  const years = [
    { key: 'year2024', label: '2024 年', color: '#88c8d8' },
    { key: 'year2025', label: '2025 年', color: '#d4b878' },
    { key: 'year2026', label: '2026 年', color: '#e898b8' },
  ]
  return (
    <div>
      <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '16px', lineHeight: '1.6' }}>
        编辑角色物料表格，按年份分组。表格显示：时间、标题、图片、链接。<br/>
        <span style={{ color: '#d4b878' }}>提示：</span>修改后前端表格视图自动更新。
      </p>
      {years.map(year => {
        const items = mt[year.key] || []
        return (
          <div key={year.key} style={{ marginBottom: '20px' }}>
            <h3 style={{ color: year.color, fontSize: '14px', marginBottom: '10px', marginTop: '12px' }}>
              📊 {year.label}（{items.length} 条）
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {items.map((item: any, idx: number) => (
                <div key={idx} style={{
                  background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(${year.color === '#88c8d8' ? '136,200,216' : year.color === '#d4b878' ? '212,184,120' : '232,152,184'},0.15)`,
                  borderRadius: '8px', padding: '10px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: year.color, fontSize: '12px', fontWeight: 600 }}>#{idx + 1}</span>
                    <button onClick={() => {
                      const next = [...items]; next.splice(idx, 1); onUpdate(`materialTable.${year.key}`, next)
                    }} style={{ background: 'rgba(224,96,96,0.1)', border: 'none', borderRadius: '4px', color: '#e06060', fontSize: '11px', cursor: 'pointer', padding: '2px 6px' }}>✕</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <FormGroup label="日期">
                      <TextInput value={item.date || ''} onChange={v => {
                        const next = [...items]; next[idx] = { ...next[idx], date: v }; onUpdate(`materialTable.${year.key}`, next)
                      }} />
                    </FormGroup>
                    <FormGroup label="标签">
                      <TextInput value={item.tag || ''} onChange={v => {
                        const next = [...items]; next[idx] = { ...next[idx], tag: v }; onUpdate(`materialTable.${year.key}`, next)
                      }} />
                    </FormGroup>
                    <FormGroup label="标题">
                      <TextInput value={item.title || ''} onChange={v => {
                        const next = [...items]; next[idx] = { ...next[idx], title: v }; onUpdate(`materialTable.${year.key}`, next)
                      }} />
                    </FormGroup>
                    <FormGroup label="链接">
                      <TextInput value={item.link || ''} onChange={v => {
                        const next = [...items]; next[idx] = { ...next[idx], link: v }; onUpdate(`materialTable.${year.key}`, next)
                      }} />
                    </FormGroup>
                  </div>
                  <FormGroup label="图片">
                    <ImagePicker value={item.image || ''} onChange={v => {
                      const next = [...items]; next[idx] = { ...next[idx], image: v }; onUpdate(`materialTable.${year.key}`, next)
                    }} />
                  </FormGroup>
                </div>
              ))}
            </div>
            <button onClick={() => {
              const next = [...items, { date: '', title: '', image: '', link: '', tag: '' }]
              onUpdate(`materialTable.${year.key}`, next)
            }} style={{
              marginTop: '6px', width: '100%',
              background: `rgba(${year.color === '#88c8d8' ? '136,200,216' : year.color === '#d4b878' ? '212,184,120' : '232,152,184'},0.1)`,
              border: `1px dashed rgba(${year.color === '#88c8d8' ? '136,200,216' : year.color === '#d4b878' ? '212,184,120' : '232,152,184'},0.3)`,
              borderRadius: '8px', padding: '8px', color: year.color, fontSize: '12px', cursor: 'pointer', fontWeight: 600,
            }}>
              + 添加 {year.label} 物料
            </button>
          </div>
        )
      })}
    </div>
  )
}

// —— 倒计时编辑器 ———
function CountdownEditor({ content, onUpdate }: { content: any; onUpdate: (path: string, v: any) => void }) {
  const cd = content.countdown || { birthday: '05-05', debutDate: '04-17' }
  return (
    <div>
      <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '16px', lineHeight: '1.6' }}>
        编辑首页倒计时日期。修改后首页倒计时将自动使用新日期计算。<br/>
        <span style={{ color: '#d4b878' }}>提示：</span>日期格式为 MM-DD。
      </p>
      <div style={{
        background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)',
        borderRadius: '12px', padding: '20px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <FormGroup label="🎂 生日 (MM-DD)">
              <TextInput value={cd.birthday || ''} onChange={v => onUpdate('countdown.birthday', v)} />
            </FormGroup>
            <div style={{ color: 'rgba(232,152,184,0.6)', fontSize: '11px', marginTop: '4px' }}>
              当前：{cd.birthday || '05-05'}（砂金生日 5月5日）
            </div>
          </div>
          <div>
            <FormGroup label="🚀 入池日 (MM-DD)">
              <TextInput value={cd.debutDate || ''} onChange={v => onUpdate('countdown.debutDate', v)} />
            </FormGroup>
            <div style={{ color: 'rgba(136,200,216,0.6)', fontSize: '11px', marginTop: '4px' }}>
              当前：{cd.debutDate || '04-17'}（砂金入池日 4月17日）
            </div>
          </div>
        </div>
      </div>
      <div style={{
        marginTop: '16px',
        background: 'rgba(100,180,120,0.08)', border: '1px solid rgba(100,180,120,0.15)',
        borderRadius: '8px', padding: '12px', color: '#8cba6a', fontSize: '12px', lineHeight: '1.6',
      }}>
        ✅ 倒计时会自动计算距离下一个日期的天、时、分、秒。<br/>
        📅 修改后首页的生日倒计时和入池日倒计时将同步更新。
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

  const handleSyncAndPublish = async () => {
    syncToSite()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
    { key: 'offlineFeedback', label: '线下返图', icon: '📸' },
    // 更多内容
    { key: 'materialTable', label: '物料表格', icon: '📊' },
    { key: 'calendar', label: '砂金日历', icon: '📅' },
    { key: 'sashaSay', label: '砂砂想说', icon: '💬' },
    { key: 'countdown', label: '倒计时', icon: '⏳' },
    // 页面构建器
    { key: 'pageBuilder', label: '页面构建器', icon: '🎨' },
  ]
  // ============ 线下返图管理 ============
  function OfflineFeedbackEditor() {
    const [items, setItems] = useState<any[]>(() => {
      try { return JSON.parse(localStorage.getItem('aventurine_offline_feedback') || '[]') }
      catch { return [] }
    })
    const handleDelete = (id: string) => {
      const next = items.filter(i => i.id !== id)
      setItems(next)
      localStorage.setItem('aventurine_offline_feedback', JSON.stringify(next))
    }
    return (
      <div>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '16px', lineHeight: '1.6' }}>
          管理用户上传的线下返图。删除后不可恢复。<br/>
          <span style={{ color: '#e898b8' }}>提示：</span>用户从应援页「线下返图」板块上传的截图会显示在这里。
        </p>
        {items.length === 0 ? (
          <div className="card-glass" style={{ padding: '32px 20px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
            <div style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px' }}>暂无返图，等待用户上传</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((item, idx) => (
              <div key={item.id || idx} style={{
                background: 'rgba(232,152,184,0.05)', border: '1px solid rgba(232,152,184,0.15)',
                borderRadius: '10px', padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
              }}>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="返图" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#e898b8', fontSize: '12px', fontWeight: 600 }}>{item.nickname || '匿名'}</div>
                  <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginTop: '2px' }}>{item.desc || '无描述'}</div>
                </div>
                <button onClick={() => handleDelete(item.id)} style={{
                  background: 'rgba(224,96,96,0.1)', border: '1px solid rgba(224,96,96,0.2)',
                  borderRadius: '6px', padding: '4px 10px', color: '#e06060',
                  fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit',
                }}>🗑️ 删除</button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  // =============================================

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
      case 'calendar': return <CalendarEditor content={content} onUpdate={handleUpdate} />
      case 'sashaSay': return <SashaSayEditor content={content} onUpdate={handleUpdate} />
      case 'materialTable': return <MaterialTableEditor content={content} onUpdate={handleUpdate} />
      case 'countdown': return <CountdownEditor content={content} onUpdate={handleUpdate} />
      case 'offlineFeedback': return <OfflineFeedbackEditor />
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

            {/* 保存并发布到全站 */}
            <button
              onClick={handleSyncAndPublish}
              disabled={isPublishing}
              style={{
                background: isPublishing ? 'rgba(212,184,120,0.1)' : 'linear-gradient(135deg, #d4b878, #c4a060)',
                border: 'none',
                borderRadius: '8px',
                color: isPublishing ? '#d4b878' : '#121212',
                fontSize: '13px', fontWeight: 700,
                padding: '8px 20px',
                cursor: isPublishing ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: isPublishing ? 'none' : '0 2px 12px rgba(212,184,120,0.25)',
              }}
              onMouseEnter={(e) => {
                if (!isPublishing) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,184,120,0.35)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(212,184,120,0.25)'
              }}
            >
              {isPublishing ? '⏳ 发布中...' : '🚀 保存并发布到全站'}
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
            💡 <b>🚀 保存并发布到全站</b>：保存快照 + 推送到 GitHub → 自动部署 → 2 分钟后 aventurine0505.xyz 全站生效
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
