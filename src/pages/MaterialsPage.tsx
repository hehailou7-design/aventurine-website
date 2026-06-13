import { useState, useEffect, useRef, useMemo } from 'react'
import { useContent } from '../context/ContentContext'
import type { MaterialItem, CalendarEvent } from '../context/ContentContext'
import { fetchCloudData, saveCloudData } from '../services/CloudDataService'

function hashForItem(item: MaterialItem): string {
  const raw = `${item.title}_${item.tag}`; let hash = 0
  for (let i = 0; i < raw.length; i++) { hash = ((hash << 5) - hash) + raw.charCodeAt(i); hash |= 0 }
  return String(Math.abs(hash))
}

function commentKey(item: MaterialItem): string {
  return `aventurine_comment_${hashForItem(item)}`
}

interface Comment { name: string; text: string; time: string }
function loadComments(item: MaterialItem): Comment[] {
  try { 
    const raw = localStorage.getItem(commentKey(item))
    return raw ? JSON.parse(raw) : [] 
  } catch { return [] }
}
function saveComments(item: MaterialItem, comments: Comment[]) {
  localStorage.setItem(commentKey(item), JSON.stringify(comments));
  // 同步到云端
  (async () => {
    try {
      const cloud = await fetchCloudData()
      if (!cloud.materialComments) cloud.materialComments = {}
      cloud.materialComments[hashForItem(item)] = comments
      await saveCloudData(cloud)
    } catch {}
  })()
}

function DetailPage({ item, onClose, allItems, onSwitchItem }: { item: MaterialItem; onClose: () => void; allItems: MaterialItem[]; onSwitchItem?: (item: MaterialItem) => void }) {
  const [comments, setComments] = useState<Comment[]>(() => loadComments(item))
  const [newName, setNewName] = useState(''); const [newText, setNewText] = useState(''); const [submitted, setSubmitted] = useState(false)

  useEffect(() => { setComments(loadComments(item)); setSubmitted(false); setNewName(''); setNewText('') }, [item])

  const handleAddComment = () => {
    if (!newName.trim() || !newText.trim()) return
    const now = new Date()
    const c: Comment = { name: newName.trim(), text: newText.trim(), time: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}` }
    const updated = [c, ...comments]; setComments(updated); saveComments(item, updated); setNewName(''); setNewText(''); setSubmitted(true); setTimeout(() => setSubmitted(false), 2000)
  }

  const handleDeleteComment = (idx: number) => { const updated = comments.filter((_, i) => i !== idx); setComments(updated); saveComments(item, updated) }

  const displayDesc = item.detailDesc || item.desc
  const relatedItems = allItems.filter(i => i.title !== item.title && i.tag === item.tag)

  // 锁定 body 滚动，防止详情页打开时背景页面滚动
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = originalOverflow }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, overflow: 'auto' }}>
      <button onClick={onClose} style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 1010, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '40px', height: '40px', color: '#f8f6f0', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>✕</button>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px 80px' }}>
        <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(212,184,120,0.06), rgba(180,150,100,0.03))', border: '1px solid rgba(212,184,120,0.15)', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {item.image ? <img src={item.image} alt={item.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} /> : <div style={{ textAlign: 'center', opacity: 0.15 }}><span style={{ fontSize: '80px' }}>◆</span></div>}
          {item.clickAction === 'video' && <div onClick={() => item.videoUrl && window.open(item.videoUrl, '_blank')} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '40px', width: '80px', height: '80px', borderRadius: '50%', border: '2px solid rgba(212,184,120,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>▶</div>}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#d4b878', fontSize: '24px', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {item.date && <span style={{ color: 'rgba(248,246,240,0.45)', fontSize: '13px' }}>📅 {item.date}</span>}
            {item.tag && <span style={{ background: 'rgba(212,184,120,0.1)', color: '#d4b878', padding: '3px 12px', borderRadius: '8px', fontSize: '12px', border: '1px solid rgba(212,184,120,0.2)', fontWeight: 600 }}>{item.tag}</span>}
          </div>
        </div>
        <div style={{ color: 'rgba(248,246,240,0.8)', fontSize: '15px', lineHeight: '2', marginBottom: '28px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>{displayDesc}</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {item.image && <button onClick={async () => { try { const resp = await fetch(item.image); const blob = await resp.blob(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = item.title + '.png'; a.click(); URL.revokeObjectURL(url) } catch { window.open(item.image, '_blank') } }} style={{ padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(100,180,120,0.15), rgba(74,154,90,0.1))', border: '1px solid rgba(100,180,120,0.3)', color: '#8cba6a', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>⬇ 下载图片</button>}
          {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ padding: '12px 24px', borderRadius: '12px', background: 'rgba(212,184,120,0.1)', border: '1px solid rgba(212,184,120,0.3)', color: '#d4b878', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>🔗 查看链接</a>}
        </div>

        {relatedItems.length > 0 && (
          <div style={{ marginBottom: '36px', padding: '16px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ color: 'rgba(248,246,240,0.45)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>📂 同分类更多（{relatedItems.length} 项）</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {relatedItems.slice(0, 8).map((ri, idx) => (
                <button key={idx} onClick={() => onSwitchItem?.(ri)} style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.12)', borderRadius: '6px', padding: '4px 10px', color: 'rgba(248,246,240,0.55)', fontSize: '11px', cursor: 'pointer', textAlign: 'left' }}>{ri.title.length > 20 ? ri.title.slice(0,20)+'...' : ri.title}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: '24px', background: 'rgba(20,20,30,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ color: '#d4b878', fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>💬 留言板</h3>
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="你的昵称" maxLength={20} style={{ flex: '1', minWidth: '100px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8f6f0', fontSize: '13px', outline: 'none', marginBottom: '10px', width: '100%', boxSizing: 'border-box' }} />
          <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="写下留言..." rows={3} maxLength={500} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8f6f0', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: '10px', boxSizing: 'border-box' }} />
          <button onClick={handleAddComment} disabled={!newName.trim() || !newText.trim()} style={{ padding: '10px 24px', borderRadius: '10px', background: (!newName.trim() || !newText.trim()) ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #d4b878, #c4a060)', border: 'none', color: (!newName.trim() || !newText.trim()) ? 'rgba(248,246,240,0.3)' : '#121212', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>{submitted ? '✅ 已发送' : '发送留言'}</button>
          {comments.length === 0 ? <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(248,246,240,0.25)', fontSize: '13px' }}>🌟 还没有留言</div> :
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {comments.map((c, idx) => (
                <div key={idx} style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: `hsl(${(idx*55)%360}, 40%, 35%)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>{c.name.charAt(0).toUpperCase()}</span>
                      <span style={{ color: '#f8f6f0', fontSize: '13px', fontWeight: 600 }}>{c.name}</span>
                      <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>{c.time}</span>
                    </div>
                    <button onClick={() => handleDeleteComment(idx)} style={{ background: 'transparent', border: 'none', color: 'rgba(248,246,240,0.2)', fontSize: '14px', cursor: 'pointer' }}>✕</button>
                  </div>
                  <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '14px', lineHeight: '1.6', paddingLeft: '38px' }}>{c.text}</div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

// ============ Calendar ============
function MaterialsCalendar({ events }: { events: CalendarEvent[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()

  const getEventsForDay = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return events.filter(e => e.date === `${monthStr}-${dayStr}`)
  }

  const monthEvents = events.filter(e => e.date.startsWith(String(currentMonth+1).padStart(2,'0')))

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,210,230,0.1), rgba(232,152,184,0.06), rgba(255,180,200,0.04))',
      border: '2px solid rgba(232,152,184,0.25)',
      borderRadius: '24px',
      padding: '28px', maxWidth: '620px', margin: '0 auto',
      boxShadow: '0 8px 32px rgba(232,152,184,0.08)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative corner */}
      <div style={{ position: 'absolute', top: '-30px', right: '-20px', fontSize: '80px', opacity: 0.04, pointerEvents: 'none' }}>🌸</div>
      <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', fontSize: '60px', opacity: 0.03, pointerEvents: 'none' }}>🎀</div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y-1) } else setCurrentMonth(m => m-1) }}
          style={{ background: 'rgba(232,152,184,0.1)', border: '1px solid rgba(232,152,184,0.25)', borderRadius: '10px', padding: '8px 16px', color: '#e898b8', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,152,184,0.2)'; e.currentTarget.style.transform = 'scale(1.05)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,152,184,0.1)'; e.currentTarget.style.transform = 'scale(1)' }}
        >◀</button>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#e898b8', fontSize: '20px', fontWeight: 700, margin: 0, textShadow: '0 0 12px rgba(232,152,184,0.3)' }}>
            🌸 {currentYear}年{months[currentMonth]}
          </h3>
          <div style={{ color: 'rgba(232,152,184,0.4)', fontSize: '11px', marginTop: '4px' }}>
            {monthEvents.length > 0 ? `🌸 ${monthEvents.length} 个事件` : '✨ 美好的月份'}
          </div>
        </div>
        <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y+1) } else setCurrentMonth(m => m+1) }}
          style={{ background: 'rgba(232,152,184,0.1)', border: '1px solid rgba(232,152,184,0.25)', borderRadius: '10px', padding: '8px 16px', color: '#e898b8', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,152,184,0.2)'; e.currentTarget.style.transform = 'scale(1.05)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,152,184,0.1)'; e.currentTarget.style.transform = 'scale(1)' }}
        >▶</button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '8px' }}>
        {['日', '一', '二', '三', '四', '五', '六'].map((d, i) => (
          <div key={d} style={{
            textAlign: 'center', color: i === 0 || i === 6 ? 'rgba(232,152,184,0.4)' : 'rgba(232,152,184,0.3)',
            fontSize: '11px', fontWeight: 600, padding: '4px 0',
          }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
        {Array.from({ length: firstDay }).map((_, i) => <div key={'e'+i} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayEvents = getEventsForDay(day)
          const sticker = dayEvents.length > 0 ? dayEvents[0].sticker : null
          const isHovered = hoveredDay === day
          const isSpecial = dayEvents.length > 0
          // Special dates get extra styling
          const isMay5 = currentMonth === 4 && day === 5
          const isApr17 = currentMonth === 3 && day === 17
          const isSuperSpecial = isMay5 || isApr17

          return (
            <div key={day}
              onMouseEnter={() => dayEvents.length > 0 && setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              style={{
                textAlign: 'center', padding: '8px 2px', borderRadius: '12px',
                background: isSuperSpecial
                  ? 'linear-gradient(135deg, rgba(255,180,200,0.2), rgba(232,152,184,0.15))'
                  : isSpecial
                  ? 'rgba(232,152,184,0.1)'
                  : 'transparent',
                border: isSuperSpecial
                  ? '2px solid rgba(232,152,184,0.4)'
                  : isSpecial
                  ? '1px solid rgba(232,152,184,0.2)'
                  : '1px solid transparent',
                cursor: isSpecial ? 'pointer' : 'default',
                position: 'relative' as const,
                transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: isHovered ? 5 : 1,
                boxShadow: isHovered ? '0 4px 16px rgba(232,152,184,0.2)' : 'none',
              }}
              title={dayEvents.map(e => e.title + ': ' + e.desc).join('\n')}
            >
              <div style={{
                color: isSuperSpecial ? '#e87090' : isSpecial ? '#e898b8' : 'rgba(248,246,240,0.35)',
                fontSize: '13px', fontWeight: isSpecial ? 700 : 400,
              }}>
                {day}
              </div>
              {sticker && (
                <div style={{
                  fontSize: isHovered ? '20px' : '16px',
                  marginTop: '2px',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  animation: isSpecial ? 'bounce-cal 2s ease-in-out infinite' : 'none',
                }}>
                  {sticker}
                </div>
              )}
              {isHovered && dayEvents.length > 1 && (
                <div style={{ fontSize: '10px', color: 'rgba(232,152,184,0.6)', marginTop: '2px' }}>
                  +{dayEvents.length - 1}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Event list */}
      {monthEvents.length > 0 && (
        <div style={{
          marginTop: '20px', borderTop: '2px dashed rgba(232,152,184,0.15)',
          paddingTop: '14px', maxHeight: '160px', overflowY: 'auto',
        }}>
          {monthEvents.map(e => (
            <div key={e.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '6px 10px', borderRadius: '10px',
              background: 'rgba(232,152,184,0.04)',
              marginBottom: '4px',
              transition: 'all 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={el => { el.currentTarget.style.background = 'rgba(232,152,184,0.1)' }}
            onMouseLeave={el => { el.currentTarget.style.background = 'rgba(232,152,184,0.04)' }}
            >
              <span style={{ fontSize: '22px', flexShrink: 0 }}>{e.sticker || '🌸'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#e898b8', fontWeight: 600, fontSize: '13px' }}>{e.title}</div>
                <div style={{ color: 'rgba(248,246,240,0.35)', fontSize: '11px', marginTop: '1px' }}>{e.desc}</div>
              </div>
              <span style={{ color: 'rgba(232,152,184,0.4)', fontFamily: 'monospace', fontSize: '11px', flexShrink: 0 }}>
                {e.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============ Main Page ============
export default function MaterialsPage() {
  const { content } = useContent()
  const { official, offline, officialTitle, offlineTitle } = content.materials
  const calendarEvents = content.calendar?.events || []
  const materialTable = content.materialTable
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'calendar'>('cards')

  // —— 自动同步：表格视图自动合并 materialTable + official + offline ——
  const combinedTableData = useMemo(() => {
    const result: Record<string, any[]> = {}
    // 1. 先加入 materialTable 已有的数据
    if (materialTable) {
      for (const y of ['2024', '2025', '2026']) {
        result[y] = [...(materialTable[`year${y}`] || [])]
      }
    }
    // 2. 自动将 official 和 offline 中有日期的项同步到对应年份
    const syncItems = (source: MaterialItem[]) => {
      source.forEach(item => {
        if (!item.title) return
        // 从日期中提取年份（支持 YYYY.MM.DD 或 YYYY-MM-DD 格式）
        const yearMatch = item.date ? item.date.match(/^(\d{4})/) : null
        if (!yearMatch) return
        const year = yearMatch[1]
        if (!result[year]) result[year] = []
        // 避免重复（按 title 去重）
        const exists = result[year].some((r: any) => r.title === item.title)
        if (!exists) {
          result[year].push({
            date: item.date || '',
            title: item.title,
            image: item.image || '',
            link: item.link || '',
            tag: item.tag || '',
          })
        }
      })
    }
    syncItems(official)
    syncItems(offline)
    return result
  }, [materialTable, official, offline])

  // —— 自动同步：日历视图自动合并 calendar.events + official + offline ——
  const combinedCalendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [...(calendarEvents || [])]
    const existingKeys = new Set(events.map(e => `${e.date}_${e.title}`))
    const syncToCalendar = (source: MaterialItem[]) => {
      source.forEach(item => {
        if (!item.date || !item.title) return
        // 将 YYYY.MM.DD 或 YYYY-MM-DD 转换为 MM-DD
        let mmdd = ''
        const parts = item.date.split(/[.\-]/)
        if (parts.length >= 3) {
          mmdd = `${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
        }
        if (!mmdd) return
        const key = `${mmdd}_${item.title}`
        if (existingKeys.has(key)) return
        events.push({
          id: `auto_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          date: mmdd,
          title: item.title,
          desc: item.desc || '',
          sticker: item.tag ? '◆' : '🌸',
        })
        existingKeys.add(key)
      })
    }
    syncToCalendar(official)
    syncToCalendar(offline)
    return events
  }, [calendarEvents, official, offline])

  // 云端同步：每 8 秒从云端拉取物料评论并合并到本地
  useEffect(() => {
    const sync = async () => {
      try {
        const cloud = await fetchCloudData()
        if (cloud.materialComments) {
          for (const [hashKey, cloudComments] of Object.entries(cloud.materialComments)) {
            if (!Array.isArray(cloudComments) || cloudComments.length === 0) continue
            const localKey = `aventurine_comment_${hashKey}`
            try {
              const local = JSON.parse(localStorage.getItem(localKey) || '[]')
              const cloudIds = new Set(cloudComments.map((c: any) => c.time + c.name + c.text))
              const uniqueLocal = local.filter((c: any) => !cloudIds.has(c.time + c.name + c.text))
              localStorage.setItem(localKey, JSON.stringify([...cloudComments, ...uniqueLocal]))
            } catch {}
          }
        }
      } catch {}
    }
    sync()
    const interval = setInterval(sync, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ padding: '40px 0 100px', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0', marginBottom: '24px' }}>
          {[
            { key: 'cards', icon: '🃏', label: '卡片' },
            { key: 'table', icon: '📋', label: '表格' },
            { key: 'calendar', icon: '📅', label: '日历' },
          ].map(m => (
            <button key={m.key} onClick={() => setViewMode(m.key as any)} style={{
              padding: '8px 20px', border: '1px solid ' + (viewMode === m.key ? 'rgba(212,184,120,0.3)' : 'rgba(255,255,255,0.08)'),
              borderRadius: m.key === 'cards' ? '20px 0 0 20px' : m.key === 'calendar' ? '0 20px 20px 0' : '0',
              background: viewMode === m.key ? 'rgba(212,184,120,0.1)' : 'transparent',
              color: viewMode === m.key ? '#d4b878' : 'rgba(248,246,240,0.4)',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>{m.icon} {m.label}</button>
          ))}
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div style={{ marginBottom: '40px' }}>
            <h2 className="section-title">📅 砂金大事历</h2>
            <MaterialsCalendar events={combinedCalendarEvents} />
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div style={{ marginBottom: '40px' }}>
            {(['2024', '2025', '2026'] as const).map(year => {
              const items = combinedTableData[year] || []
              const yearColors: Record<string, string> = { '2024': '#88c8d8', '2025': '#d4b878', '2026': '#e898b8' }
              if (items.length === 0) return null
              return (
                <div key={year} style={{ marginBottom: '30px' }}>
                  <h3 style={{ color: yearColors[year], fontSize: '16px', fontWeight: 700, marginBottom: '12px', borderLeft: '3px solid ' + yearColors[year], paddingLeft: '12px' }}>
                    {year} 年
                  </h3>
                  <div style={{ overflow: 'auto', borderRadius: '12px', border: '1px solid rgba(212,184,120,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ background: 'rgba(212,184,120,0.06)' }}>
                          <th style={{ padding: '8px 14px', textAlign: 'left', color: '#d4b878', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>时间</th>
                          <th style={{ padding: '8px 14px', textAlign: 'left', color: '#d4b878', fontSize: '11px', fontWeight: 600 }}>标题</th>
                          <th style={{ padding: '8px 14px', textAlign: 'left', color: '#d4b878', fontSize: '11px', fontWeight: 600 }}>图片</th>
                          <th style={{ padding: '8px 14px', textAlign: 'center', color: '#d4b878', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>链接跳转</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(212,184,120,0.02)', borderTop: '1px solid rgba(212,184,120,0.06)' }}>
                            <td style={{ padding: '8px 14px', color: 'rgba(248,246,240,0.5)', fontSize: '11px', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{item.date}</td>
                            <td style={{ padding: '8px 14px', color: 'rgba(248,246,240,0.8)', fontSize: '12px' }}>
                              <div style={{ fontWeight: 600 }}>{item.title}</div>
                              {item.tag && <span style={{ fontSize: '10px', color: '#d4b878', background: 'rgba(212,184,120,0.08)', padding: '1px 6px', borderRadius: '4px' }}>{item.tag}</span>}
                            </td>
                            <td style={{ padding: '8px 14px' }}>
                              {item.image ? <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} /> : <span style={{ color: 'rgba(248,246,240,0.2)', fontSize: '18px' }}>◆</span>}
                            </td>
                            <td style={{ padding: '8px 14px', textAlign: 'center' }}>
                              {item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#d4b878', textDecoration: 'none', fontSize: '11px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(212,184,120,0.08)', border: '1px solid rgba(212,184,120,0.15)', whiteSpace: 'nowrap' }}>🔗 跳转</a> : <span style={{ color: 'rgba(248,246,240,0.2)', fontSize: '11px' }}>-</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Cards View (default) */}
        {(viewMode === 'cards' || !materialTable) && (
          <>
            <h2 className="section-title">{officialTitle || '官方原画'}</h2>
            <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px', marginBottom: '24px', marginTop: '-6px' }}>官方发布的砂金角色立绘、宣传图、壁纸等高清原画资源 · 点击卡片查看详情</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px', marginBottom: '60px' }}>
              {official.map((item, i) => (
                <div key={i} className="card-glass" style={{ borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid rgba(212,184,120,0.1)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.3)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.1)' }}
                  onClick={() => setSelectedItem(item)}>
                  <div style={{ height: '200px', background: item.image ? `url(${item.image}) center/cover` : `linear-gradient(${120+i*30}deg, rgba(212,184,120,0.06), rgba(232,152,184,0.04))`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {!item.image && <span style={{ fontSize: '40px', opacity: 0.15 }}>◆</span>}
                    {item.date && <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(212,184,120,0.2)', color: '#d4b878', fontSize: '10px', padding: '3px 10px', borderRadius: '6px' }}>{item.date}</span>}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ color: 'rgba(248,246,240,0.45)', fontSize: '12px', lineHeight: '1.5' }}>{item.desc.length > 50 ? item.desc.slice(0,50)+'...' : item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="section-title">{offlineTitle || '物料整理'}</h2>
            <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px', marginBottom: '24px', marginTop: '-6px' }}>粉丝应援物料汇总 · 点击卡片查看详情</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
              {offline.map((item, i) => (
                <div key={i} className="card-glass" style={{ borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid rgba(212,184,120,0.1)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.3)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.1)' }}
                  onClick={() => setSelectedItem(item)}>
                  <div style={{ height: '180px', background: item.image ? `url(${item.image}) center/cover` : 'linear-gradient(135deg, rgba(212,184,120,0.06), rgba(180,150,100,0.04))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {!item.image && <span style={{ fontSize: '36px', opacity: 0.15 }}>◇</span>}
                    {item.tag && <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(212,184,120,0.75)', color: '#121212', fontSize: '10px', padding: '3px 10px', borderRadius: '6px', fontWeight: 600 }}>{item.tag}</span>}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ color: 'rgba(248,246,240,0.45)', fontSize: '12px', lineHeight: '1.5' }}>{item.desc.length > 50 ? item.desc.slice(0,50)+'...' : item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedItem && (
          <DetailPage item={selectedItem} onClose={() => setSelectedItem(null)} allItems={[...official, ...offline]} onSwitchItem={(item) => setSelectedItem(item)} />
        )}
      </div>
    </div>
  )
}
