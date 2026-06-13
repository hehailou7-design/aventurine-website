import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'
import type { CollabStore, MerchItem } from '../context/ContentContext'

function StoreDetail({ store, onClose, allStores, onSwitchStore }: { store: CollabStore; onClose: () => void; allStores: CollabStore[]; onSwitchStore?: (store: CollabStore) => void }) {
  const sameCity = allStores.filter(s => s.name !== store.name && s.city === store.city)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
        zIndex: 1000, backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#1a1a1a', border: '2px solid rgba(212,184,120,0.25)',
          borderRadius: '20px', maxWidth: '700px', width: 'calc(100% - 40px)',
          maxHeight: '85vh', overflowY: 'auto',
          boxShadow: '0 16px 64px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,184,120,0.12), rgba(160,140,210,0.08))',
          padding: '20px 24px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', borderBottom: '1px solid rgba(212,184,120,0.12)',
          position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div>
            <div style={{ color: '#d4b878', fontSize: '18px', fontWeight: 600 }}>{store.name}</div>
            <div style={{ color: 'rgba(248,246,240,0.45)', fontSize: '12px', marginTop: '4px' }}>
              📍 {store.city} · 🕐 {store.time} · 🏷️ {store.category}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(248,246,240,0.1)', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', color: '#f8f6f0', fontSize: '16px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>✕</button>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{
            height: '280px',
            background: store.image ? `url(${store.image}) center/cover` : 'linear-gradient(135deg, rgba(212,184,120,0.06), #0a0a0a)',
            borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            {!store.image && (
              <div style={{ textAlign: 'center', opacity: 0.15 }}>
                <span style={{ fontSize: '64px', display: 'block' }}>★</span>
                <span style={{ color: '#d4b878', fontSize: '12px', marginTop: '8px', display: 'block' }}>门店图片待更新</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(212,184,120,0.1)', color: '#d4b878', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid rgba(212,184,120,0.2)' }}>🏙️ {store.city}</span>
              <span style={{ background: 'rgba(160,140,210,0.1)', color: '#b0a0d8', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid rgba(160,140,210,0.2)' }}>🕐 {store.time}</span>
              <span style={{ background: 'rgba(156,186,138,0.1)', color: '#9cba8a', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid rgba(156,186,138,0.2)' }}>🏷️ {store.category}</span>
          </div>
          <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '14px', lineHeight: '1.8' }}>
            欢迎来到 {store.name}！这里是砂金粉丝的线下联名空间，快来和志同道合的小伙伴一起打卡吧~ 位于{store.city}，活动时间{store.time}。具体参与方式请关注砂金生贺组公告。
          </div>
          
          {/* Same city stores */}
          {sameCity.length > 0 && (
            <div style={{
              marginTop: '20px', borderTop: '1px solid rgba(212,184,120,0.12)',
              paddingTop: '16px',
            }}>
              <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>
                🏙️ {store.city}更多门店
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {sameCity.slice(0, 4).map((s, idx) => (
                  <button key={idx}
                    onClick={() => onSwitchStore?.(s)}
                    style={{
                      background: 'rgba(212,184,120,0.05)',
                      border: '1px solid rgba(212,184,120,0.12)',
                      borderRadius: '6px', padding: '4px 10px',
                      color: 'rgba(248,246,240,0.55)', fontSize: '11px',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(212,184,120,0.4)'; e.currentTarget.style.color = '#d4b878' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212,184,120,0.12)'; e.currentTarget.style.color = 'rgba(248,246,240,0.55)' }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

function MerchDetail({ item, onClose, allMerch, onSwitchMerch }: { item: MerchItem; onClose: () => void; allMerch: MerchItem[]; onSwitchMerch?: (item: MerchItem) => void }) {
  const sameType = allMerch.filter(m => m.name !== item.name && m.type === item.type)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
        zIndex: 1000, backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#1a1a1a', border: '2px solid rgba(212,184,120,0.25)',
          borderRadius: '20px', maxWidth: '600px', width: 'calc(100% - 40px)',
          maxHeight: '85vh', overflowY: 'auto',
          boxShadow: '0 16px 64px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, rgba(232,152,184,0.1), rgba(212,184,120,0.08))',
          padding: '20px 24px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', borderBottom: '1px solid rgba(212,184,120,0.12)',
          position: 'sticky', top: 0, zIndex: 1,
        }}>
          <div>
            <div style={{ color: '#d4b878', fontSize: '18px', fontWeight: 600 }}>{item.name}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ background: 'rgba(212,184,120,0.1)', color: '#d4b878', padding: '2px 10px', borderRadius: '6px', fontSize: '11px', border: '1px solid rgba(212,184,120,0.2)' }}>{item.type}</span>
              <span style={{
                background: item.version.includes('限定') ? 'rgba(224,192,96,0.1)' : 'rgba(176,160,216,0.1)',
                color: item.version.includes('限定') ? '#e0c060' : '#b0a0d8',
                padding: '2px 10px', borderRadius: '6px', fontSize: '11px',
                border: `1px solid ${item.version.includes('限定') ? 'rgba(224,192,96,0.2)' : 'rgba(176,160,216,0.2)'}`,
              }}>{item.version}</span>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(248,246,240,0.1)', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', color: '#f8f6f0', fontSize: '16px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>✕</button>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ color: '#d4b878', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>{item.price}</div>
          
          {/* 淘宝链接跳转 */}
          {item.taobaoUrl && (
            <a
              href={item.taobaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #ff5000, #ff6a20)',
                color: '#fff', fontSize: '14px', fontWeight: 600,
                textDecoration: 'none', cursor: 'pointer',
                marginBottom: '12px', transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              🛒 去淘宝官方店购买
            </a>
          )}

          <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '13px', marginBottom: '16px' }}>
            以上价格仅供参考，具体以官方渠道实际售价为准
          </div>

          {/* Same type items */}
          {sameType.length > 0 && (
            <div style={{
              marginTop: '20px', borderTop: '1px solid rgba(212,184,120,0.12)',
              paddingTop: '16px',
            }}>
              <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>
                🛍️ 更多{item.type}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {sameType.slice(0, 4).map((m, idx) => (
                  <button key={idx}
                    onClick={() => onSwitchMerch?.(m)}
                    style={{
                      background: 'rgba(212,184,120,0.05)',
                      border: '1px solid rgba(212,184,120,0.12)',
                      borderRadius: '6px', padding: '4px 10px',
                      color: 'rgba(248,246,240,0.55)', fontSize: '11px',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(212,184,120,0.4)'; e.currentTarget.style.color = '#d4b878' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212,184,120,0.12)'; e.currentTarget.style.color = 'rgba(248,246,240,0.55)' }}
                  >
                    {m.name} {m.price}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function CollaborationPage() {
  const { t } = useLang()
  const { content } = useContent()
  const { stores, merch, storesTitle, merchTitle } = content.collaboration
  const [selectedStore, setSelectedStore] = useState<CollabStore | null>(null)
  const [selectedMerch, setSelectedMerch] = useState<MerchItem | null>(null)

  return (
    <div style={{ padding: '40px 0 100px', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">

        {/* Collab Stores */}
        <h2 className="section-title">{storesTitle || t('collab_store')}</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px', marginBottom: '24px', marginTop: '-6px' }}>
          点击卡片查看门店详细信息
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '18px',
          marginBottom: '56px',
        }}>
          {stores.map((store, i) => (
            <div key={i} className="card-glass" style={{
              padding: '0', borderRadius: '14px', overflow: 'hidden',
              cursor: 'pointer', transition: 'all 0.3s',
              border: '1px solid rgba(212,184,120,0.1)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.1)' }}
              onClick={() => setSelectedStore(store)}
            >
              <div style={{
                height: '160px',
                background: store.image ? `url(${store.image}) center/cover` : 'linear-gradient(135deg, rgba(212,184,120,0.06), rgba(124,92,191,0.06))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {!store.image && <span style={{ fontSize: '36px', opacity: 0.15 }}>★</span>}
              </div>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{
                    background: 'rgba(212,184,120,0.1)', color: '#d4b878',
                    fontSize: '11px', padding: '3px 10px', borderRadius: '6px',
                    border: '1px solid rgba(212,184,120,0.2)',
                  }}>{store.city}</span>
                  <span style={{ color: 'rgba(212,184,120,0.5)', fontSize: '11px' }}>{store.time}</span>
                </div>
                <div style={{ color: '#f2e8d0', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>{store.name}</div>
                <span style={{
                  background: 'rgba(212,184,120,0.06)', color: 'rgba(248,246,240,0.5)',
                  fontSize: '11px', padding: '3px 10px', borderRadius: '6px',
                }}>{store.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Merchandise Catalog */}
        <h2 className="section-title">{merchTitle || t('merch_catalog')}</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px', marginBottom: '24px', marginTop: '-6px' }}>
          点击卡片查看周边详细信息
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '18px',
        }}>
          {merch.map((item, i) => (
            <div key={i} className="card-glass" style={{
              borderRadius: '14px', overflow: 'hidden',
              cursor: 'pointer', transition: 'all 0.3s',
              border: '1px solid rgba(212,184,120,0.1)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,184,120,0.1)' }}
              onClick={() => setSelectedMerch(item)}
            >
              <div style={{
                height: '180px',
                background: item.image ? `url(${item.image}) center/cover` : `linear-gradient(${100 + i * 20}deg, rgba(212,184,120,0.06), rgba(124,92,191,0.06))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {!item.image && <span style={{ fontSize: '36px', opacity: 0.15 }}>★</span>}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                  <span style={{
                    background: 'rgba(212,184,120,0.1)', color: '#d4b878',
                    fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                  }}>{item.type}</span>
                  <span style={{
                    fontSize: '11px',
                    color: item.version.includes('限定') ? '#e0c060' : item.version.includes('收藏') ? '#b0a0d8' : 'rgba(248,246,240,0.4)',
                  }}>{item.version}</span>
                </div>
                <div style={{ color: '#f2e8d0', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>{item.name}</div>
                <div style={{ color: '#d4b878', fontSize: '14px', fontWeight: 600 }}>
                  {item.price}
                  {item.taobaoUrl && (
                    <span style={{ fontSize: '9px', marginLeft: '6px', color: '#ff5000' }}>🛒</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modals */}
        {selectedStore && <StoreDetail store={selectedStore} onClose={() => setSelectedStore(null)} allStores={stores} onSwitchStore={(s) => setSelectedStore(s)} />}
        {selectedMerch && <MerchDetail item={selectedMerch} onClose={() => setSelectedMerch(null)} allMerch={merch} onSwitchMerch={(m) => setSelectedMerch(m)} />}

        {/* Cute decoration */}
        <div style={{ position: 'relative', minHeight: '60px', marginTop: '20px', overflow: 'hidden' }}>
          <svg width="100%" height="80" viewBox="0 0 400 80" style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0.05, pointerEvents: 'none' }}>
            <ellipse cx="50" cy="68" rx="24" ry="14" fill="#d4b878"/>
            <circle cx="38" cy="55" rx="12" ry="11" fill="#d4b878"/>
            <circle cx="34" cy="52" r="2" fill="#121212"/>
            <circle cx="42" cy="52" r="2" fill="#121212"/>
            
            <circle cx="160" cy="62" r="12" fill="#f2e8d0"/>
            <circle cx="156" cy="60" r="1.5" fill="#121212"/>
            <circle cx="164" cy="60" r="1.5" fill="#121212"/>
            <polygon points="160,65 162,67 158,67" fill="#e0a060"/>
            
            <ellipse cx="270" cy="68" rx="18" ry="12" fill="#f0e8d8"/>
            <ellipse cx="262" cy="50" rx="12" ry="14" fill="#f0e8d8"/>
            <ellipse cx="257" cy="36" rx="4" ry="9" fill="#f0c8d0" opacity="0.6"/>
            <ellipse cx="267" cy="36" rx="4" ry="9" fill="#f0c8d0" opacity="0.6"/>
            
            <ellipse cx="370" cy="68" rx="16" ry="11" fill="#d4c8b0"/>
            <circle cx="366" cy="56" r="10" ry="9" fill="#d4c8b0"/>
            <circle cx="363" cy="54" r="1.5" fill="#121212"/>
            <circle cx="369" cy="54" r="1.5" fill="#121212"/>
            
            <text x="100" y="40" fontSize="7" fill="#d4b878">✦</text>
            <text x="220" y="35" fontSize="6" fill="#d4b878">✧</text>
            <text x="320" y="38" fontSize="7" fill="#d4b878">✦</text>
            <text x="140" y="38" fontSize="5" fill="#e898b8">♥</text>
            <text x="300" y="36" fontSize="5" fill="#e898b8">♥</text>
          </svg>
        </div>
      </div>
    </div>
  )
}
