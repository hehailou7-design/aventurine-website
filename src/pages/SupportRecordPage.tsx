import { useState, useMemo } from 'react'
import { useContent } from '../context/ContentContext'
import { useLang } from '../context/LanguageContext'

const joinOptions = [
  { key: 'screen', icon: '🖥️', labelKey: 'join_support_1', color: '#f0c060' },
  { key: 'freebie', icon: '🎁', labelKey: 'join_support_2', color: '#e898b8' },
  { key: 'venue', icon: '🏠', labelKey: 'join_support_3', color: '#88c8d8' },
  { key: 'fund', icon: '💰', labelKey: 'join_support_4', color: '#b8d888' },
  { key: 'relay', icon: '🎨', labelKey: 'join_support_5', color: '#d4a8e8' },
  { key: 'online', icon: '🎉', labelKey: 'join_support_6', color: '#f0a060' },
  { key: 'cafe', icon: '☕', labelKey: 'join_support_7', color: '#c8a080' },
]

// Cute decoration component
function CuteDecor() {
  return (
    <div style={{ position: 'absolute', bottom: -80, left: '50%', transform: 'translateX(-50%)', opacity: 0.08, pointerEvents: 'none', userSelect: 'none' }}>
      <svg width="280" height="120" viewBox="0 0 280 120">
        {/* Cute cat */}
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
        
        {/* Small chibi character */}
        <circle cx="140" cy="85" r="15" fill="#f2e8d0"/>
        <circle cx="135" cy="82" r="2" fill="#121212"/>
        <circle cx="145" cy="82" r="2" fill="#121212"/>
        <path d="M138,90 Q140,93 142,90" stroke="#121212" strokeWidth="1" fill="none"/>
        <rect x="130" y="97" width="20" height="15" rx="4" fill="#d4b878"/>
        <circle cx="135" cy="70" r="8" fill="#d4b878" opacity="0.5"/>
        <circle cx="145" cy="72" r="6" fill="#d4b878" opacity="0.5"/>
        
        {/* Bunny */}
        <ellipse cx="220" cy="95" rx="20" ry="14" fill="#f2e8d0"/>
        <ellipse cx="210" cy="72" rx="12" ry="14" fill="#f2e8d0"/>
        <ellipse cx="205" cy="58" rx="4" ry="10" fill="#f2e8d0"/>
        <ellipse cx="215" cy="58" rx="4" ry="10" fill="#f2e8d0"/>
        <ellipse cx="205" cy="56" rx="2.5" ry="6" fill="#f0c8d0"/>
        <ellipse cx="215" cy="56" rx="2.5" ry="6" fill="#f0c8d0"/>
        <circle cx="207" cy="70" r="2" fill="#121212"/>
        <circle cx="213" cy="70" r="2" fill="#121212"/>
        <ellipse cx="210" cy="75" rx="1.5" ry="1" fill="#e898b8"/>
        
        {/* Stars */}
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

export default function SupportRecordPage() {
  const { content } = useContent()
  const { t } = useLang()
  const records = content.supportRecord?.records || []
  const pageTitle = content.supportRecord?.pageTitle || '眠于金色夏夜的过往 · 生贺应援'
  const year2025Summary = content.supportRecord?.year2025Summary || ''
  const year2026Summary = content.supportRecord?.year2026Summary || ''

  const [joinOpen, setJoinOpen] = useState(false)
  const [searchCity, setSearchCity] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  // Extract unique cities from records
  const cities = useMemo(() => {
    const set = new Set<string>()
    records.forEach((r: any) => { if (r.city) set.add(r.city) })
    return Array.from(set).sort()
  }, [records])

  // Filter records by city
  const filteredRecords = useMemo(() => {
    if (!searchCity) return records
    return records.filter((r: any) => 
      r.city && r.city.toLowerCase().includes(searchCity.toLowerCase())
    )
  }, [records, searchCity])

  return (
    <div style={{ padding: '40px 0 120px', minHeight: '100vh', position: 'relative' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8" style={{ position: 'relative' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 className="section-title" style={{ fontSize: '28px', marginBottom: '8px' }}>{t('page_title_support')}</h2>
          <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px' }}>{t('page_subtitle_support')}</p>
        </div>

        {/* Year Summaries */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          {/* 2025 Summary */}
          {year2025Summary && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(212,184,120,0.06), rgba(180,150,100,0.03))',
              border: '1px solid rgba(212,184,120,0.15)', borderRadius: '16px',
              padding: '20px 24px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -20, right: -20,
                fontSize: '80px', opacity: 0.04, color: '#d4b878',
                pointerEvents: 'none', userSelect: 'none',
              }}>2025</div>
              <h3 style={{
                color: '#d4b878', fontSize: '17px', fontWeight: 700,
                marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                🎂 2025 砂金一周年生贺应援
              </h3>
              <div style={{ color: 'rgba(248,246,240,0.75)', fontSize: '13px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {year2025Summary}
              </div>
            </div>
          )}
          {/* 2026 Summary */}
          {year2026Summary && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(232,152,184,0.06), rgba(212,184,120,0.03))',
              border: '1px solid rgba(232,152,184,0.15)', borderRadius: '16px',
              padding: '20px 24px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -20, right: -20,
                fontSize: '80px', opacity: 0.04, color: '#e898b8',
                pointerEvents: 'none', userSelect: 'none',
              }}>2026</div>
              <h3 style={{
                color: '#e898b8', fontSize: '17px', fontWeight: 700,
                marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                🎉 2026 砂金二周年生贺应援
              </h3>
              <div style={{ color: 'rgba(248,246,240,0.75)', fontSize: '13px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {year2026Summary}
              </div>
            </div>
          )}
        </div>

        {/* Join Support Section */}
        <div style={{
          background: 'rgba(255,240,210,0.04)', 
          border: '1px solid rgba(212,184,120,0.2)', 
          borderRadius: '16px',
          marginBottom: '28px',
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setJoinOpen(!joinOpen)}
            style={{
              width: '100%', background: 'transparent', border: 'none',
              color: '#d4b878', fontSize: '16px', fontWeight: 600,
              padding: '16px 24px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'all 0.3s',
            }}
          >
            <span>{t('join_support_title')}</span>
            <span style={{ 
              transform: joinOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
              transition: 'transform 0.3s',
              fontSize: '12px',
            }}>▼</span>
          </button>
          {joinOpen && (
            <div style={{ padding: '0 24px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {joinOptions.map((opt) => (
                <div key={opt.key} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px',
                  background: 'rgba(212,184,120,0.05)',
                  border: `1px solid ${opt.color}22`,
                  borderRadius: '10px',
                  fontSize: '13px', color: '#f8f6f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,184,120,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212,184,120,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <span style={{ fontSize: '20px' }}>{opt.icon}</span>
                  <span>{t(opt.labelKey)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* City Search Filter */}
        <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <div style={{ 
            flex: '1', minWidth: '220px', position: 'relative',
          }}>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder={t('search_city')}
              style={{
                width: '100%', padding: '10px 16px',
                background: 'rgba(255,240,210,0.04)',
                border: '1px solid rgba(212,184,120,0.2)',
                borderRadius: '12px',
                color: '#f8f6f0', fontSize: '13px',
                outline: 'none',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(212,184,120,0.5)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,184,120,0.2)' }}
            />
          </div>
          {/* Quick city chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSearchCity('')}
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
                background: !searchCity ? 'rgba(212,184,120,0.2)' : 'rgba(212,184,120,0.05)',
                border: `1px solid ${!searchCity ? '#d4b878' : 'rgba(212,184,120,0.15)'}`,
                color: !searchCity ? '#d4b878' : 'rgba(248,246,240,0.5)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {t('all_cities')}
            </button>
            {cities.slice(0, 6).map((city) => (
              <button
                key={city}
                onClick={() => setSearchCity(searchCity === city ? '' : city)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
                  background: searchCity === city ? 'rgba(212,184,120,0.2)' : 'rgba(212,184,120,0.05)',
                  border: `1px solid ${searchCity === city ? '#d4b878' : 'rgba(212,184,120,0.15)'}`,
                  color: searchCity === city ? '#d4b878' : 'rgba(248,246,240,0.5)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Records Grid */}
        {filteredRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(212,184,120,0.3)', fontSize: '14px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            {searchCity ? '该城市暂无应援记录，可以联系生贺组组织哦~' : '暂无应援记录，管理员可在后台添加'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredRecords.map((r: any, i: number) => (
              <div
                key={i}
                className="card-glass"
                style={{
                  borderRadius: '16px', overflow: 'hidden',
                  cursor: r.lat && r.lng ? 'pointer' : 'default',
                  transition: 'all 0.3s',
                  border: '1px solid rgba(212,184,120,0.1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.1)' }}
                onClick={() => { if (r.lat && r.lng) setSelectedRecord(r) }}
              >
                {/* Image */}
                <div style={{
                  height: '180px', overflow: 'hidden',
                  background: r.image ? `url(${r.image}) center/cover` : 'linear-gradient(135deg, rgba(212,184,120,0.1), rgba(180,150,100,0.05))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  {!r.image && <span style={{ fontSize: '40px', opacity: 0.3 }}>🎬</span>}
                  {/* Tag badge */}
                  {r.tag && (
                    <span style={{
                      position: 'absolute', top: '12px', left: '12px',
                      background: 'rgba(212,184,120,0.85)', color: '#121212',
                      padding: '3px 10px', borderRadius: '8px',
                      fontSize: '11px', fontWeight: 600,
                    }}>
                      {r.tag}
                    </span>
                  )}
                  {/* Map pin indicator */}
                  {r.lat && r.lng && (
                    <span style={{
                      position: 'absolute', bottom: '12px', right: '12px',
                      background: 'rgba(0,0,0,0.6)', color: '#f8f6f0',
                      padding: '4px 10px', borderRadius: '8px',
                      fontSize: '11px',
                    }}>
                      📍 查看地图
                    </span>
                  )}
                </div>
                {/* Content */}
                <div style={{ padding: '16px' }}>
                  <div style={{ color: '#d4b878', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{r.title}</div>
                  <div style={{ color: 'rgba(248,246,240,0.45)', fontSize: '12px', marginBottom: '8px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>📅 {r.date}</span>
                    {r.city && <span>📍 {r.city}</span>}
                  </div>
                  <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', lineHeight: '1.6', marginBottom: r.howToJoin ? '10px' : '0' }}>
                    {r.desc.length > 80 ? r.desc.slice(0, 80) + '...' : r.desc}
                  </div>
                  {r.howToJoin && (
                    <div style={{
                      background: 'rgba(156,186,138,0.06)',
                      border: '1px solid rgba(156,186,138,0.15)',
                      borderRadius: '8px', padding: '8px 12px',
                      fontSize: '12px', color: '#9cba8a',
                      display: 'flex', alignItems: 'flex-start', gap: '6px',
                    }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>💡</span>
                      <span>{r.howToJoin.length > 60 ? r.howToJoin.slice(0, 60) + '...' : r.howToJoin}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map Popup */}
        {selectedRecord && (
          <div 
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setSelectedRecord(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#1a1a1a', border: '2px solid rgba(212,184,120,0.3)',
                borderRadius: '20px', maxWidth: '500px', width: '100%',
                overflow: 'hidden',
              }}
            >
              {/* Cute map header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(212,184,120,0.15), rgba(232,152,184,0.1))',
                padding: '20px 24px', textAlign: 'center',
                borderBottom: '1px solid rgba(212,184,120,0.15)',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '4px' }}>🗺️</div>
                <div style={{ color: '#d4b878', fontSize: '16px', fontWeight: 600 }}>{selectedRecord.title}</div>
                <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginTop: '4px' }}>
                  📍 {selectedRecord.city} · {selectedRecord.location}
                </div>
              </div>
              
              {/* Cute map */}
              <div style={{
                height: '260px', background: '#faf5e8',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Grid lines */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(180,160,130,0.2)" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)"/>
                  {/* Roads */}
                  <line x1="0" y1="130" x2="100%" y2="115" stroke="rgba(180,160,130,0.3)" strokeWidth="8" strokeLinecap="round"/>
                  <line x1="80" y1="0" x2="100" y2="100%" stroke="rgba(180,160,130,0.2)" strokeWidth="6" strokeLinecap="round"/>
                  <line x1="300" y1="260" x2="380" y2="0" stroke="rgba(180,160,130,0.15)" strokeWidth="5" strokeLinecap="round"/>
                  
                  {/* Cute decorations on map */}
                  <circle cx="80" cy="60" r="8" fill="#d4e8b0" opacity="0.6"/>
                  <circle cx="90" cy="55" r="5" fill="#c8e0a0" opacity="0.6"/>
                  <circle cx="350" cy="180" r="10" fill="#d4e8b0" opacity="0.5"/>
                  <circle cx="200" cy="200" r="6" fill="#e8d4b0" opacity="0.5"/>
                  <circle cx="150" cy="50" r="7" fill="#d4e8b0" opacity="0.4"/>
                  <circle cx="400" cy="100" r="5" fill="#e8d4b0" opacity="0.4"/>
                  
                  {/* Small buildings */}
                  <rect x="60" y="85" width="12" height="12" rx="1" fill="#d4c4a8" opacity="0.5"/>
                  <rect x="340" y="170" width="10" height="14" rx="1" fill="#c4b898" opacity="0.5"/>
                  <rect x="355" y="175" width="8" height="9" rx="1" fill="#d4c4a8" opacity="0.5"/>
                  
                  {/* River */}
                  <path d="M0,200 Q150,180 280,210 Q400,230 500,215" stroke="rgba(160,200,220,0.3)" strokeWidth="12" fill="none" strokeLinecap="round"/>
                  
                  {/* Cute pin marker */}
                  <g transform="translate(250, 120)">
                    <circle cx="0" cy="-20" r="14" fill="#e898b8" opacity="0.15"/>
                    <path d="M0,-20 C-12,-20 -14,-8 -14,0 C-14,10 0,20 0,20 C0,20 14,10 14,0 C14,-8 12,-20 0,-20Z" fill="#e898b8"/>
                    <circle cx="0" cy="-3" r="3" fill="#fff"/>
                    <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="2s" repeatCount="indefinite"/>
                  </g>
                  
                  {/* Cute path trace to pin */}
                  <path d="M400,50 Q350,80 280,100 Q260,105 258,110" stroke="#e898b8" strokeWidth="1.5" fill="none" strokeDasharray="3,4" opacity="0.4"/>
                </svg>
                
                {/* Coordinates display */}
                <div style={{
                  position: 'absolute', bottom: '10px', right: '12px',
                  background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.6)',
                  padding: '4px 10px', borderRadius: '8px',
                  fontSize: '10px', fontFamily: 'monospace',
                }}>
                  {selectedRecord.lat?.toFixed(4)}, {selectedRecord.lng?.toFixed(4)}
                </div>
              </div>

              {/* Info + Close */}
              <div style={{ padding: '16px 24px' }}>
                <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                  {selectedRecord.desc}
                </div>
                {selectedRecord.howToJoin && (
                  <div style={{
                    background: 'rgba(156,186,138,0.08)',
                    border: '1px solid rgba(156,186,138,0.2)',
                    borderRadius: '10px', padding: '12px 16px',
                    marginBottom: '16px',
                  }}>
                    <div style={{ color: '#9cba8a', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>💡 如何参加</div>
                    <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', lineHeight: '1.6' }}>
                      {selectedRecord.howToJoin}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setSelectedRecord(null)}
                  style={{
                    width: '100%', padding: '10px 0',
                    background: 'rgba(212,184,120,0.1)', border: '1px solid rgba(212,184,120,0.2)',
                    borderRadius: '10px', color: '#d4b878', fontSize: '13px',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,184,120,0.2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212,184,120,0.1)' }}
                >
                  关闭地图
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cute bottom decoration */}
      <CuteDecor />
    </div>
  )
}
