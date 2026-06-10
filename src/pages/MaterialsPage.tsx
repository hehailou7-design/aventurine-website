import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import type { MaterialItem } from '../context/ContentContext'

// Cute bottom decoration
function MaterialsDecor() {
  return (
    <div style={{ position: 'relative', minHeight: '80px', overflow: 'hidden' }}>
      <svg width="100%" height="100" viewBox="0 0 400 100" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0.06, pointerEvents: 'none' }}>
        <ellipse cx="60" cy="80" rx="30" ry="16" fill="#d4b878"/>
        <circle cx="45" cy="65" r="14" fill="#d4b878"/>
        <circle cx="40" cy="60" r="2" fill="#121212"/>
        <circle cx="50" cy="60" r="2" fill="#121212"/>
        <path d="M43,66 Q45,63 47,66" stroke="#121212" strokeWidth="0.8" fill="none"/>
        <ellipse cx="60" cy="85" rx="4" ry="2.5" fill="#121212"/>
        
        <circle cx="150" cy="70" r="15" fill="#f2e8d0"/>
        <circle cx="145" cy="67" r="2" fill="#121212"/>
        <circle cx="155" cy="67" r="2" fill="#121212"/>
        <path d="M148,73 Q150,76 152,73" stroke="#121212" strokeWidth="0.8" fill="none"/>
        <rect x="140" y="82" width="20" height="14" rx="4" fill="#d4b878" opacity="0.5"/>
        
        <ellipse cx="250" cy="80" rx="22" ry="14" fill="#f2e8d0"/>
        <ellipse cx="240" cy="60" rx="14" ry="16" fill="#f2e8d0"/>
        <ellipse cx="235" cy="45" rx="5" ry="11" fill="#f0c8d0" opacity="0.6"/>
        <ellipse cx="245" cy="45" rx="5" ry="11" fill="#f0c8d0" opacity="0.6"/>
        <circle cx="237" cy="58" r="2" fill="#121212"/>
        <circle cx="243" cy="58" r="2" fill="#121212"/>
        
        <ellipse cx="350" cy="80" rx="18" ry="12" fill="#d4c8b0"/>
        <ellipse cx="345" cy="68" rx="12" ry="11" fill="#d4c8b0"/>
        <circle cx="341" cy="66" r="1.5" fill="#121212"/>
        <circle cx="349" cy="66" r="1.5" fill="#121212"/>
        <ellipse cx="350" cy="86" rx="4" ry="2" fill="#121212"/>
        
        <text x="120" y="45" fontSize="8" fill="#d4b878">✦</text>
        <text x="200" y="40" fontSize="6" fill="#d4b878">✧</text>
        <text x="300" y="48" fontSize="7" fill="#d4b878">✦</text>
        <text x="160" y="42" fontSize="5" fill="#e898b8">♥</text>
        <text x="270" y="42" fontSize="5" fill="#e898b8">♥</text>
        <text x="380" y="45" fontSize="6" fill="#e898b8">♥</text>
      </svg>
    </div>
  )
}

function DetailModal({ item, onClose, allItems }: { item: MaterialItem; onClose: () => void; allItems: MaterialItem[] }) {
  const relatedItems = allItems.filter(i => i.title !== item.title && i.tag === item.tag)
  
  return (
    <div 
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1a1a', border: '2px solid rgba(212,184,120,0.25)',
          borderRadius: '20px', maxWidth: '900px', width: '100%', maxHeight: '90vh',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,184,120,0.12), rgba(232,152,184,0.08))',
          padding: '20px 24px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderBottom: '1px solid rgba(212,184,120,0.12)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ color: '#d4b878', fontSize: '18px', fontWeight: 600 }}>{item.title}</div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              {item.date && <span style={{ color: 'rgba(248,246,240,0.45)', fontSize: '12px' }}>📅 {item.date}</span>}
              {item.tag && <span style={{ background: 'rgba(212,184,120,0.1)', color: '#d4b878', padding: '2px 10px', borderRadius: '6px', fontSize: '11px', border: '1px solid rgba(212,184,120,0.2)' }}>🏷️ {item.tag}</span>}
            </div>
          </div>
          <button onClick={onClose} style={{ 
            background: 'rgba(248,246,240,0.1)', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', color: '#f8f6f0', fontSize: '16px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>✕</button>
        </div>
        
        <div style={{ flex: '1', overflow: 'auto' }}>
          {/* Image Section */}
          <div style={{
            minHeight: item.clickAction === 'video' ? '350px' : '300px',
            background: item.image ? `url(${item.image}) center/contain no-repeat` : 'linear-gradient(135deg, rgba(212,184,120,0.08), #0a0a0a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            {!item.image && (
              <div style={{ textAlign: 'center', opacity: 0.2 }}>
                <span style={{ fontSize: '64px', display: 'block' }}>◆</span>
                <span style={{ color: '#d4b878', fontSize: '13px', marginTop: '8px', display: 'block' }}>图片待更新</span>
              </div>
            )}
            
            {/* Play button for video */}
            {item.clickAction === 'video' && (
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0,0,0,0.7)', color: '#fff',
                fontSize: '48px', padding: '24px 30px', borderRadius: '50%',
                border: '2px solid rgba(212,184,120,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }} onClick={() => item.videoUrl && window.open(item.videoUrl, '_blank')}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'; e.currentTarget.style.borderColor = '#d4b878' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.5)' }}
              >
                ▶
              </div>
            )}
          </div>

          {/* Description + Actions */}
          <div style={{ padding: '24px' }}>
            <div style={{ color: 'rgba(248,246,240,0.85)', fontSize: '14px', lineHeight: '1.8', marginBottom: '20px' }}>
              {item.desc}
            </div>
            
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: relatedItems.length > 0 ? '24px' : '0' }}>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
                  padding: '10px 20px', background: 'rgba(212,184,120,0.1)',
                  border: '1px solid rgba(212,184,120,0.3)', borderRadius: '10px',
                  color: '#d4b878', fontSize: '13px', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.2s',
                }}>
                  🔗 查看原图
                </a>
              )}
              {item.clickAction === 'video' && item.videoUrl && (
                <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" style={{
                  padding: '10px 20px', background: 'rgba(224,112,112,0.1)',
                  border: '1px solid rgba(224,112,112,0.3)', borderRadius: '10px',
                  color: '#e07070', fontSize: '13px', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}>
                  ▶ 播放视频
                </a>
              )}
              {item.clickAction === 'interactive' && item.interactiveUrl && (
                <a href={item.interactiveUrl} target="_blank" rel="noopener noreferrer" style={{
                  padding: '10px 20px', background: 'rgba(156,186,138,0.1)',
                  border: '1px solid rgba(156,186,138,0.3)', borderRadius: '10px',
                  color: '#9cba8a', fontSize: '13px', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}>
                  ⚡ 打开交互
                </a>
              )}
            </div>

            {/* Related Items */}
            {relatedItems.length > 0 && (
              <div style={{
                borderTop: '1px solid rgba(212,184,120,0.12)',
                paddingTop: '16px',
              }}>
                <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginBottom: '10px', fontWeight: 600 }}>
                  📂 同分类更多内容
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {relatedItems.slice(0, 6).map((ri, idx) => (
                    <span key={idx} style={{
                      background: 'rgba(212,184,120,0.06)',
                      border: '1px solid rgba(212,184,120,0.12)',
                      borderRadius: '8px', padding: '6px 12px',
                      color: 'rgba(248,246,240,0.6)', fontSize: '12px',
                    }}>
                      {ri.title.length > 16 ? ri.title.slice(0, 16) + '...' : ri.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MaterialsPage() {
  const { content } = useContent()
  const { official, offline, officialTitle, offlineTitle } = content.materials
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null)

  return (
    <div style={{ padding: '40px 0 100px', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">

        {/* 官方原画 */}
        <h2 className="section-title">{officialTitle || '官方原画'}</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px', marginBottom: '24px', marginTop: '-6px' }}>
          官方发布的砂金角色立绘、宣传图、壁纸等高清原画资源 · 点击卡片查看详情
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '18px',
          marginBottom: '60px',
        }}>
          {official.map((item, i) => (
            <div key={i} className="card-glass" style={{
              borderRadius: '14px', overflow: 'hidden',
              cursor: 'pointer', transition: 'all 0.3s',
              border: '1px solid rgba(212,184,120,0.1)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.1)' }}
              onClick={() => setSelectedItem(item)}
            >
              <div style={{
                height: '200px',
                background: item.image ? `url(${item.image}) center/cover` : `linear-gradient(${120 + i * 30}deg, rgba(212,184,120,0.06), rgba(232,152,184,0.04))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {!item.image && <span style={{ fontSize: '40px', opacity: 0.15 }}>◆</span>}
                {item.date && (
                  <span style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: 'rgba(212,184,120,0.2)', color: '#d4b878',
                    fontSize: '10px', padding: '3px 10px', borderRadius: '6px',
                  }}>{item.date}</span>
                )}
                <div style={{
                  position: 'absolute', bottom: '10px', right: '10px',
                  background: 'rgba(0,0,0,0.6)', color: '#f8f6f0',
                  fontSize: '10px', padding: '4px 10px', borderRadius: '6px',
                  opacity: 0, transition: 'opacity 0.3s',
                }} className="hover-show">
                  点击查看详情 →
                </div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
                <div style={{ color: 'rgba(248,246,240,0.45)', fontSize: '12px', lineHeight: '1.5' }}>
                  {item.desc.length > 50 ? item.desc.slice(0, 50) + '...' : item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 物料整理 */}
        <h2 className="section-title">{offlineTitle || '物料整理'}</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px', marginBottom: '24px', marginTop: '-6px' }}>
          粉丝应援物料汇总 · 点击卡片查看详情
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px',
        }}>
          {offline.map((item, i) => (
            <div key={i} className="card-glass" style={{
              borderRadius: '14px', overflow: 'hidden',
              cursor: 'pointer', transition: 'all 0.3s',
              border: '1px solid rgba(212,184,120,0.1)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.1)' }}
              onClick={() => setSelectedItem(item)}
            >
              <div style={{
                height: '180px',
                background: item.image ? `url(${item.image}) center/cover` : 'linear-gradient(135deg, rgba(212,184,120,0.06), rgba(180,150,100,0.04))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {!item.image && <span style={{ fontSize: '36px', opacity: 0.15 }}>◇</span>}
                {item.tag && (
                  <span style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: 'rgba(212,184,120,0.75)', color: '#121212',
                    fontSize: '10px', padding: '3px 10px', borderRadius: '6px',
                    fontWeight: 600,
                  }}>{item.tag}</span>
                )}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
                <div style={{ color: 'rgba(248,246,240,0.45)', fontSize: '12px', lineHeight: '1.5' }}>
                  {item.desc.length > 50 ? item.desc.slice(0, 50) + '...' : item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} allItems={[...official, ...offline]} />}

        {/* Cute decoration */}
        <MaterialsDecor />
      </div>
    </div>
  )
}
