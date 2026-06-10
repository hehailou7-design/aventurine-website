import { useState, useEffect, useRef } from 'react'
import { useContent } from '../context/ContentContext'
import type { MaterialItem } from '../context/ContentContext'

// Generate a stable key for comments storage
function commentKey(item: MaterialItem): string {
  const raw = `${item.title}_${item.tag}`
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i)
    hash |= 0
  }
  return `aventurine_comment_${Math.abs(hash)}`
}

interface Comment {
  name: string
  text: string
  time: string
}

function loadComments(item: MaterialItem): Comment[] {
  try {
    return JSON.parse(localStorage.getItem(commentKey(item)) || '[]')
  } catch { return [] }
}

function saveComments(item: MaterialItem, comments: Comment[]) {
  localStorage.setItem(commentKey(item), JSON.stringify(comments))
}

// ============ Cute Decoration ============
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
        
        <text x="120" y="45" fontSize="8" fill="#d4b878">✦</text>
        <text x="300" y="48" fontSize="7" fill="#d4b878">✦</text>
        <text x="160" y="42" fontSize="5" fill="#e898b8">♥</text>
        <text x="380" y="45" fontSize="6" fill="#e898b8">♥</text>
      </svg>
    </div>
  )
}

// ============ Detail Page Overlay ============
function DetailPage({ item, onClose, allItems, onSwitchItem }: { item: MaterialItem; onClose: () => void; allItems: MaterialItem[]; onSwitchItem?: (item: MaterialItem) => void }) {
  const [comments, setComments] = useState<Comment[]>(() => loadComments(item))
  const [newName, setNewName] = useState('')
  const [newText, setNewText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const commentsEndRef = useRef<HTMLDivElement>(null)

  // Reload comments when item changes
  useEffect(() => {
    setComments(loadComments(item))
    setSubmitted(false)
    setNewName('')
    setNewText('')
  }, [item])

  const handleAddComment = () => {
    if (!newName.trim() || !newText.trim()) return
    const now = new Date()
    const comment: Comment = {
      name: newName.trim(),
      text: newText.trim(),
      time: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
    }
    const updated = [comment, ...comments]
    setComments(updated)
    saveComments(item, updated)
    setNewName('')
    setNewText('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  const handleDeleteComment = (idx: number) => {
    const updated = comments.filter((_, i) => i !== idx)
    setComments(updated)
    saveComments(item, updated)
  }

  const handleDownload = async () => {
    if (!item.image) return
    try {
      const resp = await fetch(item.image)
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = item.title + (item.image.split('.').pop() ? '.' + item.image.split('.').pop()!.split('?')[0] : '.png')
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.open(item.image, '_blank')
    }
  }

  const displayDesc = item.detailDesc || item.desc
  const relatedItems = allItems.filter(i => i.title !== item.title && i.tag === item.tag)

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      zIndex: 1000, overflow: 'auto',
    }}>
      {/* Close Button — fixed top-right */}
      <button onClick={onClose} style={{
        position: 'fixed', top: '16px', right: '16px', zIndex: 1010,
        background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '50%', width: '40px', height: '40px',
        color: '#f8f6f0', fontSize: '18px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}>✕</button>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px 80px' }}>
        
        {/* ====== Image ====== */}
        <div style={{
          width: '100%', borderRadius: '16px', overflow: 'hidden',
          marginBottom: '24px', background: 'linear-gradient(135deg, rgba(212,184,120,0.06), rgba(180,150,100,0.03))',
          border: '1px solid rgba(212,184,120,0.15)',
          minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {item.image ? (
            <img src={item.image} alt={item.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />
          ) : (
            <div style={{ textAlign: 'center', opacity: 0.15, padding: '60px 0' }}>
              <span style={{ fontSize: '80px', display: 'block' }}>◆</span>
              <span style={{ color: '#d4b878', fontSize: '14px', marginTop: '12px', display: 'block' }}>图片待更新</span>
            </div>
          )}
          {/* Play button for video */}
          {item.clickAction === 'video' && (
            <div onClick={() => item.videoUrl && window.open(item.videoUrl, '_blank')} style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.7)', color: '#fff',
              fontSize: '40px', width: '80px', height: '80px', borderRadius: '50%',
              border: '2px solid rgba(212,184,120,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.3s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)' }}
            >▶</div>
          )}
        </div>

        {/* ====== Title + Meta ====== */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#d4b878', fontSize: '24px', fontWeight: 700, marginBottom: '10px' }}>{item.title}</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {item.date && <span style={{ color: 'rgba(248,246,240,0.45)', fontSize: '13px' }}>📅 {item.date}</span>}
            {item.tag && <span style={{ background: 'rgba(212,184,120,0.1)', color: '#d4b878', padding: '3px 12px', borderRadius: '8px', fontSize: '12px', border: '1px solid rgba(212,184,120,0.2)', fontWeight: 600 }}>{item.tag}</span>}
          </div>
        </div>

        {/* ====== Description ====== */}
        <div style={{
          color: 'rgba(248,246,240,0.8)', fontSize: '15px', lineHeight: '2',
          marginBottom: '28px', padding: '20px',
          background: 'rgba(255,255,255,0.02)', borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          {displayDesc}
        </div>

        {/* ====== Action Buttons ====== */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: relatedItems.length > 0 ? '28px' : '36px' }}>
          {/* Download image */}
          {item.image && (
            <button onClick={handleDownload} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(100,180,120,0.15), rgba(74,154,90,0.1))',
              border: '1px solid rgba(100,180,120,0.3)',
              color: '#8cba6a', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(100,180,120,0.25), rgba(74,154,90,0.18))' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(100,180,120,0.15), rgba(74,154,90,0.1))' }}
            >
              ⬇ 下载图片
            </button>
          )}
          {/* External link */}
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              background: 'rgba(212,184,120,0.1)',
              border: '1px solid rgba(212,184,120,0.3)',
              color: '#d4b878', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s',
            }}>🔗 查看原图/链接</a>
          )}
          {/* Video */}
          {item.clickAction === 'video' && item.videoUrl && (
            <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              background: 'rgba(224,112,112,0.1)',
              border: '1px solid rgba(224,112,112,0.3)',
              color: '#e07070', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s',
            }}>▶ 播放视频</a>
          )}
        </div>

        {/* ====== Related Items ====== */}
        {relatedItems.length > 0 && (
          <div style={{
            marginBottom: '36px', padding: '16px',
            background: 'rgba(255,255,255,0.01)', borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ color: 'rgba(248,246,240,0.45)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              📂 同分类更多内容（{relatedItems.length} 项）
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {relatedItems.slice(0, 8).map((ri, idx) => (
                <button
                  key={idx}
                  onClick={() => onSwitchItem?.(ri)}
                  style={{
                    background: 'rgba(212,184,120,0.05)',
                    border: '1px solid rgba(212,184,120,0.12)',
                    borderRadius: '6px', padding: '4px 10px',
                    color: 'rgba(248,246,240,0.55)', fontSize: '11px',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                  {ri.title.length > 20 ? ri.title.slice(0, 20) + '...' : ri.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ====== Comments Section ====== */}
        <div style={{
          padding: '24px',
          background: 'rgba(20,20,30,0.5)', borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h3 style={{ color: '#d4b878', fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>
            💬 留言板
          </h3>
          <p style={{ color: 'rgba(248,246,240,0.35)', fontSize: '12px', marginBottom: '20px' }}>
            说点什么吧～文明留言，友好交流 ✨
          </p>

          {/* Comment Form */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="你的昵称"
              maxLength={20}
              style={{
                flex: '1', minWidth: '100px', padding: '10px 14px',
                borderRadius: '10px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)', color: '#f8f6f0',
                fontSize: '13px', outline: 'none',
              }}
            />
            <button
              onClick={handleAddComment}
              disabled={!newName.trim() || !newText.trim()}
              style={{
                padding: '10px 24px', borderRadius: '10px',
                background: (!newName.trim() || !newText.trim())
                  ? 'rgba(255,255,255,0.04)'
                  : 'linear-gradient(135deg, #d4b878, #c4a060)',
                border: 'none', color: (!newName.trim() || !newText.trim()) ? 'rgba(248,246,240,0.3)' : '#121212',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {submitted ? '✅ 已发送' : '发送留言'}
            </button>
          </div>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="写下你的留言..."
            rows={3}
            maxLength={500}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#f8f6f0', fontSize: '13px', outline: 'none',
              resize: 'vertical', fontFamily: 'inherit',
              marginBottom: '20px', boxSizing: 'border-box',
            }}
          />

          {/* Comments List */}
          {comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(248,246,240,0.25)', fontSize: '13px' }}>
              🌟 还没有留言，快来抢沙发吧
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comments.map((c, idx) => (
                <div key={idx} style={{
                  padding: '12px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: `hsl(${(idx * 55) % 360}, 40%, 35%)`,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '12px', fontWeight: 700,
                        flexShrink: 0,
                      }}>{c.name.charAt(0).toUpperCase()}</span>
                      <span style={{ color: '#f8f6f0', fontSize: '13px', fontWeight: 600 }}>{c.name}</span>
                      <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>{c.time}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(idx)}
                      style={{
                        background: 'transparent', border: 'none',
                        color: 'rgba(248,246,240,0.2)', fontSize: '14px',
                        cursor: 'pointer', padding: '2px 6px',
                      }}
                      title="删除"
                    >✕</button>
                  </div>
                  <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '14px', lineHeight: '1.6', paddingLeft: '38px' }}>
                    {c.text}
                  </div>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// ============ Main Page ============
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

        {/* Detail Page Overlay */}
        {selectedItem && (
          <DetailPage
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            allItems={[...official, ...offline]}
            onSwitchItem={(item) => setSelectedItem(item)}
          />
        )}

        {/* Cute decoration */}
        <MaterialsDecor />
      </div>
    </div>
  )
}
