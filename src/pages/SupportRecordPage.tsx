import { useState, useMemo, useEffect } from 'react'
import { useContent } from '../context/ContentContext'
import { useLang } from '../context/LanguageContext'
import { fetchCloudData, saveCloudData, type CloudData } from '../services/CloudDataService'

const joinOptions = [
  { key: 'screen', icon: '🖥️', labelKey: 'join_support_1', color: '#f0c060' },
  { key: 'freebie', icon: '🎁', labelKey: 'join_support_2', color: '#e898b8' },
  { key: 'venue', icon: '🏠', labelKey: 'join_support_3', color: '#88c8d8' },
  { key: 'fund', icon: '💰', labelKey: 'join_support_4', color: '#b8d888' },
  { key: 'relay', icon: '🎨', labelKey: 'join_support_5', color: '#d4a8e8' },
  { key: 'online', icon: '🎉', labelKey: 'join_support_6', color: '#f0a060' },
  { key: 'cafe', icon: '☕', labelKey: 'join_support_7', color: '#c8a080' },
]

function CuteDecor() {
  return (
    <div style={{ position: 'absolute', bottom: -80, left: '50%', transform: 'translateX(-50%)', opacity: 0.08, pointerEvents: 'none', userSelect: 'none' }}>
      <svg width="280" height="120" viewBox="0 0 280 120">
        <ellipse cx="60" cy="95" rx="30" ry="18" fill="#d4b878"/>
        <ellipse cx="45" cy="78" rx="16" ry="14" fill="#d4b878"/>
        <polygon points="37,68 40,55 46,65" fill="#c4a868"/>
        <polygon points="53,68 50,55 44,65" fill="#c4a868"/>
        <circle cx="40" cy="75" r="3" fill="#121212"/>
        <circle cx="50" cy="75" r="3" fill="#121212"/>
        <ellipse cx="45" cy="80" rx="2" ry="1.5" fill="#121212"/>
        <path d="M42,86 Q45,82 48,86" stroke="#121212" strokeWidth="0.8" fill="none"/>
        <ellipse cx="60" cy="100" rx="5" ry="3" fill="#121212"/>
        <path d="M33,90 Q28,70 20,65" stroke="#d4b878" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="140" cy="85" r="15" fill="#f2e8d0"/>
        <circle cx="135" cy="82" r="2" fill="#121212"/>
        <circle cx="145" cy="82" r="2" fill="#121212"/>
        <path d="M138,90 Q140,93 142,90" stroke="#121212" strokeWidth="1" fill="none"/>
        <rect x="130" y="97" width="20" height="15" rx="4" fill="#d4b878"/>
        <circle cx="135" cy="70" r="8" fill="#d4b878" opacity="0.5"/>
        <circle cx="145" cy="72" r="6" fill="#d4b878" opacity="0.5"/>
        <ellipse cx="220" cy="95" rx="20" ry="14" fill="#f2e8d0"/>
        <ellipse cx="210" cy="72" rx="12" ry="14" fill="#f2e8d0"/>
        <ellipse cx="205" cy="58" rx="4" ry="10" fill="#f2e8d0"/>
        <ellipse cx="215" cy="58" rx="4" ry="10" fill="#f2e8d0"/>
        <ellipse cx="205" cy="56" rx="2.5" ry="6" fill="#f0c8d0"/>
        <ellipse cx="215" cy="56" rx="2.5" ry="6" fill="#f0c8d0"/>
        <circle cx="207" cy="70" r="2" fill="#121212"/>
        <circle cx="213" cy="70" r="2" fill="#121212"/>
        <ellipse cx="210" cy="75" rx="1.5" ry="1" fill="#e898b8"/>
        <text x="80" y="50" fontSize="10" fill="#d4b878">✦</text>
        <text x="160" y="45" fontSize="8" fill="#d4b878">✦</text>
        <text x="180" y="55" fontSize="6" fill="#d4b878">✧</text>
        <text x="100" y="40" fontSize="6" fill="#d4b878">✧</text>
        <text x="250" y="65" fontSize="8" fill="#d4b878">✦</text>
        <text x="120" y="55" fontSize="5" fill="#e898b8">♥</text>
        <text x="195" y="48" fontSize="5" fill="#e898b8">♥</text>
      </svg>
    </div>
  )
}

// China map coordinates mapping
const chinaCities: Record<string, { x: number; y: number }> = {
  '上海': { x: 730, y: 420 },
  '北京': { x: 650, y: 180 },
  '广州': { x: 600, y: 500 },
  '深圳': { x: 620, y: 520 },
  '成都': { x: 450, y: 380 },
  '杭州': { x: 680, y: 400 },
  '南京': { x: 660, y: 350 },
  '武汉': { x: 600, y: 370 },
  '重庆': { x: 470, y: 390 },
  '西安': { x: 520, y: 280 },
  '长沙': { x: 570, y: 430 },
  '南昌': { x: 620, y: 450 },
  '酒泉': { x: 430, y: 120 },
  '全国': { x: 500, y: 300 },
  '线上': { x: 80, y: 80 },
}

function ChinaMap({ markers }: { markers: { id: string; city: string; title: string; lat: number; lng: number; desc: string }[] }) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
      <svg viewBox="0 0 800 600" style={{ width: '100%', height: 'auto' }}>
        {/* Simplified China outline */}
        <path d="M700,180 Q720,160 740,170 Q760,180 750,200 Q740,220 720,210 Q700,200 700,180Z" fill="rgba(212,184,120,0.03)" stroke="rgba(212,184,120,0.15)" strokeWidth="1"/>
        <path d="M600,120 Q680,100 720,130 Q760,160 750,200 Q740,250 700,280 Q660,300 620,290 Q580,280 560,250 Q540,220 550,180 Q560,140 600,120Z" fill="rgba(212,184,120,0.05)" stroke="rgba(212,184,120,0.2)" strokeWidth="1.5"/>
        <path d="M620,290 Q650,310 680,350 Q720,380 740,420 Q740,470 700,500 Q660,520 600,500 Q560,480 540,440 Q520,400 540,360 Q560,320 600,300 Q610,295 620,290Z" fill="rgba(212,184,120,0.04)" stroke="rgba(212,184,120,0.15)" strokeWidth="1"/>
        <path d="M540,360 Q500,380 470,410 Q450,430 440,460 Q430,490 450,510 Q470,530 510,520 Q540,510 560,480 Q570,460 560,430 Q550,400 540,360Z" fill="rgba(212,184,120,0.04)" stroke="rgba(212,184,120,0.15)" strokeWidth="1"/>
        <path d="M550,180 Q520,220 480,250 Q440,280 430,320 Q420,360 440,410 Q450,430 470,410 Q500,380 540,360 Q560,300 550,180Z" fill="rgba(212,184,120,0.04)" stroke="rgba(212,184,120,0.15)" strokeWidth="1"/>
        <path d="M480,250 Q440,230 410,220 Q380,210 360,230 Q340,250 350,280 Q360,310 380,330 Q400,350 430,320 Q440,280 480,250Z" fill="rgba(212,184,120,0.03)" stroke="rgba(212,184,120,0.12)" strokeWidth="1"/>
        <path d="M600,120 Q560,100 520,110 Q480,120 460,140 Q440,160 440,190 Q430,180 410,220 Q380,210 360,230 Q350,250 350,280 Q340,300 320,320 Q300,340 320,360 Q340,380 360,370 Q380,350 380,330 Q400,350 430,320 Q440,360 470,410 Q460,430 470,450 Q480,470 500,480 Q520,490 510,520 Q470,530 450,510 Q430,490 440,460 Q450,430 470,410 Q500,380 540,360 Q560,300 550,180 Q560,140 600,120Z" fill="rgba(212,184,120,0.03)" stroke="rgba(212,184,120,0.1)" strokeWidth="0.5"/>

        {/* Grid lines */}
        <defs>
          <pattern id="mapGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(212,184,120,0.04)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#mapGrid)"/>

        {/* City markers */}
        {markers.filter(m => m.city !== '线上').map(marker => {
          const pos = chinaCities[marker.city]
          if (!pos) return null
          const isHovered = hovered === marker.id
          return (
            <g key={marker.id}
              onMouseEnter={() => setHovered(marker.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={pos.x} cy={pos.y} r={isHovered ? 10 : 6}
                fill={isHovered ? '#e898b8' : 'rgba(232,152,184,0.4)'}
                stroke={isHovered ? '#e898b8' : 'rgba(232,152,184,0.6)'}
                strokeWidth="2"
              />
              <circle cx={pos.x} cy={pos.y} r={isHovered ? 20 : 0}
                fill="none" stroke="rgba(232,152,184,0.3)" strokeWidth="1.5"
                style={{ transition: 'r 0.3s' }}
              />
              <text x={pos.x + (isHovered ? 0 : 0)} y={pos.y - 10}
                textAnchor="middle" fill={isHovered ? '#e898b8' : 'rgba(232,152,184,0.5)'}
                fontSize={isHovered ? '12' : '10'} fontWeight={isHovered ? 700 : 400}
              >{marker.city}</text>
              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect x={pos.x - 60} y={pos.y - 60} width="120" height="40" rx="8"
                    fill="rgba(20,20,30,0.95)" stroke="rgba(232,152,184,0.3)" strokeWidth="1"/>
                  <text x={pos.x} y={pos.y - 42} textAnchor="middle" fill="#e898b8" fontSize="11" fontWeight={600}>
                    {marker.title.length > 14 ? marker.title.slice(0,14)+'...' : marker.title}
                  </text>
                  <text x={pos.x} y={pos.y - 28} textAnchor="middle" fill="rgba(248,246,240,0.5)" fontSize="10">
                    {marker.desc.length > 16 ? marker.desc.slice(0,16)+'...' : marker.desc}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function SupportRecordPage() {
  const { content } = useContent()
  const { t } = useLang()
  const records = content.supportRecord?.records || []
  const pageTitle = content.supportRecord?.pageTitle || '眠于金色夏夜的过往 · 生贺应援'
  const screens = content.supportRecord?.screens || []
  const mapMarkers2024 = content.supportRecord?.mapMarkers2024 || []
  const mapMarkers2025 = content.supportRecord?.mapMarkers2025 || []
  const mapMarkers2026 = content.supportRecord?.mapMarkers2026 || []

  const [activeYear, setActiveYear] = useState<'2024' | '2025' | '2026'>('2026')
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const [joinForm, setJoinForm] = useState({ name: '', contact: '', supportTypes: [] as string[], note: '' })
  const [joinSubmitted, setJoinSubmitted] = useState(false)
  const [searchCity, setSearchCity] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [showMap, setShowMap] = useState(false)
  const [offlineFeedback, setOfflineFeedback] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('aventurine_offline_feedback') || '[]') }
    catch { return [] }
  })
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({ nickname: '', imageUrl: '', desc: '' })
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
  const [feedbackSubmitMsg, setFeedbackSubmitMsg] = useState('')
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle')
  const [lastSynced, setLastSynced] = useState('')

  // 云端同步：从云端加载线下返图数据
  useEffect(() => {
    const syncWithCloud = async () => {
      setCloudSyncStatus('syncing')
      try {
        const cloudData = await fetchCloudData()
        if (cloudData.offlineFeedback && cloudData.offlineFeedback.length > 0) {
          setOfflineFeedback(cloudData.offlineFeedback)
          localStorage.setItem('aventurine_offline_feedback', JSON.stringify(cloudData.offlineFeedback))
          setLastSynced(new Date().toLocaleTimeString())
        }
        setCloudSyncStatus('idle')
      } catch (error) {
        console.error('从云端加载失败:', error)
        setCloudSyncStatus('error')
      }
    }

    syncWithCloud()
    
    // 每30秒同步一次
    const interval = setInterval(syncWithCloud, 8000)
    return () => clearInterval(interval)
  }, [])

  // 同步到云端
  const syncFeedbackToCloud = async (data: any[]) => {
    try {
      const cloudData = await fetchCloudData()
      cloudData.offlineFeedback = data
      await saveCloudData(cloudData)
      setLastSynced(new Date().toLocaleTimeString())
      setCloudSyncStatus('idle')
    } catch (error) {
      console.error('同步到云端失败:', error)
      setCloudSyncStatus('error')
    }
  }

  const handleFeedbackSubmit = async () => {
    if (!feedbackForm.imageUrl.trim()) return
    setFeedbackSubmitting(true)
    try {
      const next = [
        { id: 'fb_' + Date.now().toString(36), ...feedbackForm, submittedAt: new Date().toISOString() },
        ...offlineFeedback,
      ]
      localStorage.setItem('aventurine_offline_feedback', JSON.stringify(next))
      setOfflineFeedback(next)
      setFeedbackSubmitMsg('✅ 提交成功！感谢你的返图～')
      
      // 同步到云端
      await syncFeedbackToCloud(next)
      
      setTimeout(() => { setFeedbackModalOpen(false); setFeedbackSubmitMsg(''); setFeedbackForm({ nickname: '', imageUrl: '', desc: '' }) }, 1500)
    } catch {
      setFeedbackSubmitMsg('❌ 提交失败，请重试')
    }
    setFeedbackSubmitting(false)
  }

  const yearMap: Record<string, any> = { '2024': mapMarkers2024, '2025': mapMarkers2025, '2026': mapMarkers2026 }
  const yearSummaries: Record<string, string> = {
    '2024': content.supportRecord?.year2024Summary || '',
    '2025': content.supportRecord?.year2025Summary || '',
    '2026': content.supportRecord?.year2026Summary || '',
  }
  const yearColors: Record<string, string> = { '2024': '#88c8d8', '2025': '#d4b878', '2026': '#e898b8' }

  const handleJoinSubmit = () => {
    if (!joinForm.name.trim() || !joinForm.contact.trim() || joinForm.supportTypes.length === 0) return
    try {
      const existing = JSON.parse(localStorage.getItem('aventurine_join_requests') || '[]')
      existing.push({ ...joinForm, submittedAt: new Date().toISOString() })
      localStorage.setItem('aventurine_join_requests', JSON.stringify(existing))
      setJoinSubmitted(true)
    } catch { /* ignore */ }
  }

  const resetJoinForm = () => { setJoinForm({ name: '', contact: '', supportTypes: [], note: '' }); setJoinSubmitted(false); setJoinModalOpen(false) }
  const toggleSupportType = (key: string) => {
    setJoinForm(prev => ({ ...prev, supportTypes: prev.supportTypes.includes(key) ? prev.supportTypes.filter(k => k !== key) : [...prev.supportTypes, key] }))
  }

  const cities = useMemo(() => {
    const set = new Set<string>(); records.forEach((r: any) => { if (r.city) set.add(r.city) }); return Array.from(set).sort()
  }, [records])

  const filteredRecords = useMemo(() => {
    if (!searchCity) return records
    return records.filter((r: any) => r.city && r.city.toLowerCase().includes(searchCity.toLowerCase()))
  }, [records, searchCity])

  return (
    <div style={{ padding: '40px 0 120px', minHeight: '100vh', position: 'relative' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8" style={{ position: 'relative' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 className="section-title" style={{ fontSize: '28px', marginBottom: '8px' }}>{t('page_title_support')}</h2>
          <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px' }}>{t('page_subtitle_support')}</p>
        </div>

        {/* Year Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '20px' }}>
          {(['2024', '2025', '2026'] as const).map(year => (
            <button key={year} onClick={() => setActiveYear(year)} style={{
              padding: '10px 28px', border: '1px solid ' + (activeYear === year ? yearColors[year]+'40' : 'rgba(255,255,255,0.08)'),
              borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 700,
              background: activeYear === year ? yearColors[year]+'15' : 'transparent',
              color: activeYear === year ? yearColors[year] : 'rgba(248,246,240,0.4)',
              transition: 'all 0.3s',
            }}>
              {year === '2024' ? '🆕' : year === '2025' ? '🎂' : '🎉'} {year}年
            </button>
          ))}
        </div>

        {/* Year Summary */}
        {yearSummaries[activeYear] && (
          <div style={{
            background: 'linear-gradient(135deg, ' + yearColors[activeYear] + '10, rgba(20,20,30,0.5))',
            border: '1px solid ' + yearColors[activeYear] + '20', borderRadius: '16px',
            padding: '20px 24px', marginBottom: '24px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '80px', opacity: 0.04, color: yearColors[activeYear], pointerEvents: 'none', userSelect: 'none' }}>{activeYear}</div>
            <h3 style={{ color: yearColors[activeYear], fontSize: '17px', fontWeight: 700, marginBottom: '12px' }}>
              {activeYear === '2024' ? '🆕' : activeYear === '2025' ? '🎂' : '🎉'} {activeYear} 砂金{activeYear === '2024' ? '正式上线' : activeYear === '2025' ? '一周年' : '二周年'}应援
            </h3>
            <div style={{ color: 'rgba(248,246,240,0.75)', fontSize: '13px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
              {yearSummaries[activeYear]}
            </div>
          </div>
        )}

        {/* China Map Toggle */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button onClick={() => setShowMap(!showMap)} style={{
            background: yearColors[activeYear]+'10', border: '1px solid ' + yearColors[activeYear]+'25',
            borderRadius: '20px', padding: '8px 24px', color: yearColors[activeYear],
            fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
          }}>{showMap ? '📋 收起地图' : '🗺️ 查看' + activeYear + '年应援地图'}</button>
        </div>

        {showMap && (
          <div className="card-glass" style={{ borderRadius: '16px', padding: '20px', marginBottom: '28px', border: '1px solid ' + yearColors[activeYear] + '15' }}>
            <ChinaMap markers={yearMap[activeYear] || []} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
              {(yearMap[activeYear] || []).filter(m => m.city !== '线上').map(m => (
                <span key={m.id} style={{
                  background: yearColors[activeYear]+'08', border: '1px solid ' + yearColors[activeYear]+'15',
                  borderRadius: '12px', padding: '4px 12px', fontSize: '11px',
                  color: 'rgba(248,246,240,0.6)',
                }}>📍 {m.city} · {m.title}</span>
              ))}
            </div>
          </div>
        )}

        {/* Big Screen Unlock Table */}
        {screens.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ color: '#d4b878', fontSize: '15px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
              📺 大屏解锁进度
            </h3>
            <div style={{ overflow: 'auto', borderRadius: '12px', border: '1px solid rgba(212,184,120,0.12)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'rgba(212,184,120,0.08)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: '#d4b878', fontWeight: 600, fontSize: '12px' }}>大屏地址</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: '#d4b878', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap' }}>解锁时限</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: '#d4b878', fontWeight: 600, fontSize: '12px' }}>解锁条件</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', color: '#d4b878', fontWeight: 600, fontSize: '12px' }}>跳转</th>
                  </tr>
                </thead>
                <tbody>
                  {screens.map((s, i) => (
                    <tr key={i} style={{
                      background: i % 2 === 0 ? 'transparent' : 'rgba(212,184,120,0.02)',
                      borderTop: '1px solid rgba(212,184,120,0.06)',
                    }}>
                      <td style={{ padding: '10px 14px', color: 'rgba(248,246,240,0.7)', fontSize: '12px' }}>
                        {s.city && <span style={{ color: '#e898b8', marginRight: '6px', fontSize: '10px' }}>📍{s.city}</span>}
                        {s.address}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'rgba(248,246,240,0.5)', fontSize: '12px', whiteSpace: 'nowrap' }}>{s.deadline}</td>
                      <td style={{ padding: '10px 14px', color: '#9cba8a', fontSize: '12px' }}>{s.unlockCondition}</td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <a href={s.link} target="_blank" rel="noopener noreferrer" style={{
                          color: '#d4b878', textDecoration: 'none', fontSize: '12px',
                          padding: '4px 12px', borderRadius: '6px',
                          background: 'rgba(212,184,120,0.08)', border: '1px solid rgba(212,184,120,0.15)',
                          display: 'inline-block', whiteSpace: 'nowrap',
                        }}>🔗 跳转</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* 线下返图板块 */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ color: '#e898b8', fontSize: '15px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
            📸 线下返图
          </h3>
          <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', textAlign: 'center', marginBottom: '16px' }}>
            上传你在砂金应援现场的实拍截图，让更多人看到我们的热爱 ✨
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {/* 上传按钮 */}
            <div onClick={() => { setFeedbackModalOpen(true); setFeedbackForm({ nickname: '', imageUrl: '', desc: '' }) }}
              style={{
                border: '2px dashed rgba(232,152,184,0.25)', borderRadius: '12px', padding: '32px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s', minHeight: '160px',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,152,184,0.5)'; e.currentTarget.style.background = 'rgba(232,152,184,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,152,184,0.25)'; e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px', color: 'rgba(232,152,184,0.5)' }}>+</div>
              <div style={{ color: 'rgba(232,152,184,0.6)', fontSize: '12px' }}>上传返图</div>
            </div>
            {/* 已上传的返图 */}
            {offlineFeedback.map((item: any, idx: number) => (
              <div key={item.id || idx} className="card-glass" style={{ borderRadius: '12px', overflow: 'hidden', padding: 0 }}>
                {item.imageUrl && (
                  <div style={{ height: '140px', overflow: 'hidden' }}>
                    <img src={item.imageUrl} alt={item.desc || '返图'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '4px' }}>{item.nickname || '匿名'}</div>
                  {item.desc && <div style={{ color: 'rgba(248,246,240,0.65)', fontSize: '12px', lineHeight: 1.5 }}>{item.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 返图上传弹窗 */}
        {feedbackModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={e => { if (e.target === e.currentTarget) setFeedbackModalOpen(false) }}
          >
            <div className="card-glass" style={{ padding: '28px', borderRadius: '16px', maxWidth: '440px', width: '100%', position: 'relative' }}>
              <button onClick={() => setFeedbackModalOpen(false)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: 'rgba(248,246,240,0.4)', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
              <h3 style={{ color: '#e898b8', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>📸 上传线下返图</h3>
              <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '20px' }}>你的每一张返图，都是应援的记忆</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ color: 'rgba(232,152,184,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>称呼（选填）</label>
                  <input type="text" value={feedbackForm.nickname} onChange={e => setFeedbackForm(f => ({ ...f, nickname: e.target.value }))} placeholder="怎么称呼你？"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(14,14,14,0.8)', border: '1px solid rgba(232,152,184,0.25)', color: '#f2e8d0', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ color: 'rgba(232,152,184,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>图片链接 *</label>
                  <input type="text" value={feedbackForm.imageUrl} onChange={e => setFeedbackForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="粘贴图片链接（建议使用图床）"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(14,14,14,0.8)', border: '1px solid ' + (feedbackForm.imageUrl.trim() ? 'rgba(232,152,184,0.3)' : 'rgba(224,96,96,0.3)'), color: '#f2e8d0', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                  <div style={{ color: 'rgba(248,246,240,0.25)', fontSize: '10px', marginTop: '4px' }}>💡 可使用图床（如 postimg.cc）上传后获取链接</div>
                </div>
                <div>
                  <label style={{ color: 'rgba(232,152,184,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>描述（选填）</label>
                  <textarea value={feedbackForm.desc} onChange={e => setFeedbackForm(f => ({ ...f, desc: e.target.value }))} placeholder="简单描述一下这张返图..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(14,14,14,0.8)', border: '1px solid rgba(232,152,184,0.25)', color: '#f2e8d0', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', minHeight: '60px', resize: 'vertical' }}
                  />
                </div>
                {feedbackSubmitMsg && (
                  <div style={{ color: feedbackSubmitMsg.includes('成功') ? '#8cba6a' : '#e06060', fontSize: '12px', textAlign: 'center' }}>{feedbackSubmitMsg}</div>
                )}
                <button onClick={handleFeedbackSubmit}
                  disabled={!feedbackForm.imageUrl.trim() || feedbackSubmitting}
                  style={{
                    width: '100%', padding: '11px', borderRadius: '10px', border: 'none',
                    background: feedbackForm.imageUrl.trim() && !feedbackSubmitting ? 'linear-gradient(135deg, #e898b8, #d070a0)' : 'rgba(255,255,255,0.05)',
                    color: feedbackForm.imageUrl.trim() && !feedbackSubmitting ? '#121212' : 'rgba(248,246,240,0.3)',
                    fontSize: '14px', fontWeight: 700, cursor: feedbackForm.imageUrl.trim() && !feedbackSubmitting ? 'pointer' : 'default', fontFamily: 'inherit', transition: 'all 0.2s',
                  }}
                >{feedbackSubmitting ? '提交中...' : '提交返图'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Join Support Section */}
        <div style={{
          background: 'rgba(255,240,210,0.04)', border: '1px solid rgba(212,184,120,0.2)',
          borderRadius: '16px', marginBottom: '28px', padding: '20px 24px', textAlign: 'center',
        }}>
          <p style={{ color: 'rgba(248,246,240,0.6)', fontSize: '13px', marginBottom: '14px', lineHeight: '1.6' }}>
            想要参与砂金生贺应援？无论你是想提供大屏资源、制作无料、还是组织线下活动，<br/>都欢迎加入我们，一起为砂金献上最好的生日祝福！
          </p>
          <button onClick={() => setJoinModalOpen(true)} style={{
            background: 'linear-gradient(135deg, #d4b878, #c4a060)',
            border: 'none', borderRadius: '24px', color: '#121212', fontSize: '15px', fontWeight: 700,
            padding: '12px 40px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 20px rgba(212,184,120,0.25)',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(212,184,120,0.35)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,184,120,0.25)' }}
          >🎂 {t('join_support_title')} ✨</button>
        </div>

        {/* Join Support Modal */}
        {joinModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}
            onClick={(e) => { if (e.target === e.currentTarget) resetJoinForm() }}>
            <div style={{ background: 'linear-gradient(180deg, #1a1a2e, #16213e)', border: '1px solid rgba(212,184,120,0.25)', borderRadius: '20px', padding: '32px', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              <button onClick={resetJoinForm} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '32px', height: '32px', color: '#f8f6f0', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
              {joinSubmitted ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                  <h3 style={{ color: '#d4b878', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>提交成功！</h3>
                  <p style={{ color: 'rgba(248,246,240,0.6)', fontSize: '13px', lineHeight: '1.8', marginBottom: '24px' }}>感谢你的热情参与！<br/>我们会尽快联系你 💛</p>
                  <button onClick={resetJoinForm} style={{ background: 'linear-gradient(135deg, #64b878, #4a9a5a)', border: 'none', borderRadius: '20px', color: '#121212', fontSize: '14px', fontWeight: 600, padding: '10px 32px', cursor: 'pointer' }}>关闭</button>
                </div>
              ) : (
                <>
                  <h3 style={{ color: '#d4b878', fontSize: '19px', fontWeight: 700, marginBottom: '6px', textAlign: 'center' }}>🎂 加入应援</h3>
                  <p style={{ color: 'rgba(248,246,240,0.45)', fontSize: '12px', textAlign: 'center', marginBottom: '24px' }}>填写你的信息，让我们一起为砂金庆生</p>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>你的昵称 <span style={{ color: '#e06060' }}>*</span></label>
                    <input type="text" value={joinForm.name} onChange={(e) => setJoinForm(p => ({ ...p, name: e.target.value }))} placeholder="怎么称呼你？" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(20,20,20,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8f6f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>联系方式 <span style={{ color: '#e06060' }}>*</span></label>
                    <input type="text" value={joinForm.contact} onChange={(e) => setJoinForm(p => ({ ...p, contact: e.target.value }))} placeholder="微信 / QQ / 邮箱" style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(20,20,20,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8f6f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>我能提供什么 <span style={{ color: '#e06060' }}>*</span>（可多选）</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                      {joinOptions.map((opt) => {
                        const selected = joinForm.supportTypes.includes(opt.key)
                        return (
                          <button key={opt.key} onClick={() => toggleSupportType(opt.key)} style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '10px',
                            background: selected ? `${opt.color}20` : 'rgba(255,255,255,0.03)',
                            border: selected ? `1px solid ${opt.color}60` : '1px solid rgba(255,255,255,0.08)',
                            color: selected ? opt.color : 'rgba(248,246,240,0.6)', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' as const, fontFamily: 'inherit',
                          }}>
                            <span style={{ fontSize: '16px' }}>{opt.icon}</span><span>{t(opt.labelKey)}</span>
                            {selected && <span style={{ marginLeft: 'auto', fontSize: '14px' }}>✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>备注（选填）</label>
                    <textarea value={joinForm.note} onChange={(e) => setJoinForm(p => ({ ...p, note: e.target.value }))} placeholder="还有什么想告诉我们的？" rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(20,20,20,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8f6f0', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>
                  <button onClick={handleJoinSubmit} disabled={!joinForm.name.trim() || !joinForm.contact.trim() || joinForm.supportTypes.length === 0}
                    style={{ width: '100%', padding: '12px', borderRadius: '20px', background: (!joinForm.name.trim() || !joinForm.contact.trim() || joinForm.supportTypes.length === 0) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #d4b878, #c4a060)', border: 'none', color: (!joinForm.name.trim() || !joinForm.contact.trim() || joinForm.supportTypes.length === 0) ? 'rgba(248,246,240,0.3)' : '#121212', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}
                    onMouseEnter={(e) => { if (joinForm.name.trim() && joinForm.contact.trim() && joinForm.supportTypes.length > 0) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,184,120,0.3)' } }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                  >✨ 提交报名</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* City Search Filter */}
        <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '220px', position: 'relative' }}>
            <input type="text" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} placeholder={t('search_city')}
              style={{ width: '100%', padding: '10px 16px', background: 'rgba(255,240,210,0.04)', border: '1px solid rgba(212,184,120,0.2)', borderRadius: '12px', color: '#f8f6f0', fontSize: '13px', outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,184,120,0.5)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,184,120,0.2)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button onClick={() => setSearchCity('')} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', background: !searchCity ? 'rgba(212,184,120,0.2)' : 'rgba(212,184,120,0.05)', border: `1px solid ${!searchCity ? '#d4b878' : 'rgba(212,184,120,0.15)'}`, color: !searchCity ? '#d4b878' : 'rgba(248,246,240,0.5)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>{t('all_cities')}</button>
            {cities.slice(0, 6).map((city) => (
              <button key={city} onClick={() => setSearchCity(searchCity === city ? '' : city)} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', background: searchCity === city ? 'rgba(212,184,120,0.2)' : 'rgba(212,184,120,0.05)', border: `1px solid ${searchCity === city ? '#d4b878' : 'rgba(212,184,120,0.15)'}`, color: searchCity === city ? '#d4b878' : 'rgba(248,246,240,0.5)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>{city}</button>
            ))}
          </div>
        </div>

        {/* Records Grid */}
        {filteredRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(212,184,120,0.3)', fontSize: '14px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            {searchCity ? '该城市暂无应援记录' : '暂无应援记录，管理员可在后台添加'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredRecords.map((r: any, i: number) => (
              <div key={i} className="card-glass" style={{ borderRadius: '16px', overflow: 'hidden', cursor: r.lat && r.lng ? 'pointer' : 'default', transition: 'all 0.3s', border: '1px solid rgba(212,184,120,0.1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.1)' }}
                onClick={() => { if (r.lat && r.lng) setSelectedRecord(r) }}
              >
                <div style={{ height: '180px', overflow: 'hidden', background: r.image ? `url(${r.image}) center/cover` : 'linear-gradient(135deg, rgba(212,184,120,0.1), rgba(180,150,100,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {!r.image && <span style={{ fontSize: '40px', opacity: 0.3 }}>🎬</span>}
                  {r.tag && <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(212,184,120,0.85)', color: '#121212', padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600 }}>{r.tag}</span>}
                  {r.lat && r.lng && <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: '#f8f6f0', padding: '4px 10px', borderRadius: '8px', fontSize: '11px' }}>📍 查看地图</span>}
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ color: '#d4b878', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{r.title}</div>
                  <div style={{ color: 'rgba(248,246,240,0.45)', fontSize: '12px', marginBottom: '8px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>📅 {r.date}</span>{r.city && <span>📍 {r.city}</span>}
                  </div>
                  <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', lineHeight: '1.6' }}>{r.desc.length > 80 ? r.desc.slice(0, 80) + '...' : r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map Popup */}
        {selectedRecord && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedRecord(null)}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: '#1a1a1a', border: '2px solid rgba(212,184,120,0.3)', borderRadius: '20px', maxWidth: '500px', width: '100%', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(212,184,120,0.15), rgba(232,152,184,0.1))', padding: '20px 24px', textAlign: 'center', borderBottom: '1px solid rgba(212,184,120,0.15)' }}>
                <div style={{ fontSize: '32px', marginBottom: '4px' }}>🗺️</div>
                <div style={{ color: '#d4b878', fontSize: '16px', fontWeight: 600 }}>{selectedRecord.title}</div>
                <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginTop: '4px' }}>📍 {selectedRecord.city} · {selectedRecord.location}</div>
              </div>
              <div style={{ height: '260px', background: '#faf5e8', position: 'relative', overflow: 'hidden' }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  <defs>
                    <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(180,160,130,0.2)" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid2)"/>
                  <line x1="0" y1="130" x2="100%" y2="115" stroke="rgba(180,160,130,0.3)" strokeWidth="8" strokeLinecap="round"/>
                  <line x1="80" y1="0" x2="100" y2="100%" stroke="rgba(180,160,130,0.2)" strokeWidth="6" strokeLinecap="round"/>
                  <circle cx="80" cy="60" r="8" fill="#d4e8b0" opacity="0.6"/>
                  <circle cx="350" cy="180" r="10" fill="#d4e8b0" opacity="0.5"/>
                  <path d="M0,200 Q150,180 280,210 Q400,230 500,215" stroke="rgba(160,200,220,0.3)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                  <g transform="translate(250, 120)">
                    <path d="M0,-20 C-12,-20 -14,-8 -14,0 C-14,10 0,20 0,20 C0,20 14,10 14,0 C14,-8 12,-20 0,-20Z" fill="#e898b8"/>
                    <circle cx="0" cy="-3" r="3" fill="#fff"/>
                  </g>
                </svg>
              </div>
              <div style={{ padding: '16px 24px' }}>
                <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>{selectedRecord.desc}</div>
                {selectedRecord.howToJoin && (
                  <div style={{ background: 'rgba(156,186,138,0.08)', border: '1px solid rgba(156,186,138,0.2)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
                    <div style={{ color: '#9cba8a', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>💡 如何参加</div>
                    <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', lineHeight: '1.6' }}>{selectedRecord.howToJoin}</div>
                  </div>
                )}
                <button onClick={() => setSelectedRecord(null)} style={{ width: '100%', padding: '10px 0', background: 'rgba(212,184,120,0.1)', border: '1px solid rgba(212,184,120,0.2)', borderRadius: '10px', color: '#d4b878', fontSize: '13px', cursor: 'pointer' }}>关闭地图</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <CuteDecor />
    </div>
  )
}
