import { useState } from 'react'
import { useLang } from '../context/LanguageContext'

const myPosts = [
  { title: '极光下的砂金', type: '二创', date: '2026.05.12', status: '已审核', likes: 42 },
  { title: '上海IFC大屏实拍合集', type: '线下', date: '2026.06.09', status: '审核中', likes: 0 },
  { title: '骰子的命运', type: '二创', date: '2026.04.20', status: '已审核', likes: 88 },
]

const myFavorites = [
  { title: '匹诺康尼之夜', artist: 'AuroraDraw', date: '2026.05.01' },
  { title: '砂金与梅花', artist: '星穹画师', date: '2026.04.18' },
  { title: '赌徒的微笑', artist: 'IPC_Art', date: '2026.03.30' },
  { title: '命运的骰子', artist: 'GambleArt_', date: '2026.03.15' },
]

export default function ProfilePage() {
  const { t } = useLang()
  const [activeCard, setActiveCard] = useState<'posts' | 'favorites'>('posts')

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* User Info */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '20px',
          marginBottom: '32px', flexWrap: 'wrap',
        }}>
          <div style={{
            width: '72px', height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4b878, #a8893a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', color: '#121212', fontWeight: 700,
            border: '3px solid rgba(212,184,120,0.4)',
            flexShrink: 0,
          }}>
            骰
          </div>
          <div>
            <div style={{ color: '#f2e8d0', fontSize: '18px', fontWeight: 600 }}>骰子守望者</div>
            <div style={{ color: 'rgba(212,184,120,0.6)', fontSize: '12px', marginTop: '4px' }}>
              砂金应援团成员 · 加入于 2024.05
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <span style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px' }}>
                <span style={{ color: '#d4b878', fontWeight: 600 }}>3</span> 投稿
              </span>
              <span style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px' }}>
                <span style={{ color: '#d4b878', fontWeight: 600 }}>4</span> 收藏
              </span>
              <span style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px' }}>
                <span style={{ color: '#d4b878', fontWeight: 600 }}>130</span> 获赞
              </span>
            </div>
          </div>
        </div>

        {/* Card Toggle */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '28px',
        }}>
          {[
            { key: 'posts' as const, label: t('my_posts'), icon: '◆', count: myPosts.length },
            { key: 'favorites' as const, label: t('my_favorites'), icon: '♡', count: myFavorites.length },
          ].map(card => (
            <button
              key={card.key}
              onClick={() => setActiveCard(card.key)}
              style={{
                padding: '20px',
                background: activeCard === card.key ? 'rgba(212,184,120,0.1)' : 'rgba(26,26,26,0.8)',
                border: activeCard === card.key ? '1px solid rgba(212,184,120,0.4)' : '1px solid rgba(212,184,120,0.15)',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', color: activeCard === card.key ? '#d4b878' : 'rgba(212,184,120,0.4)' }}>
                  {card.icon}
                </span>
                <span style={{
                  background: 'rgba(212,184,120,0.1)',
                  color: '#d4b878', fontSize: '12px',
                  padding: '2px 10px', borderRadius: '12px',
                  border: '1px solid rgba(212,184,120,0.2)',
                }}>
                  {card.count}
                </span>
              </div>
              <div style={{
                color: activeCard === card.key ? '#d4b878' : 'rgba(248,246,240,0.6)',
                fontSize: '14px', fontWeight: 500, marginTop: '10px',
              }}>
                {card.label}
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeCard === 'posts' ? (
          myPosts.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px',
              color: 'rgba(248,246,240,0.3)', fontSize: '13px',
            }}>
              {t('no_posts')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myPosts.map((post, i) => (
                <div key={i} className="card-glass" style={{ padding: '16px 20px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{
                        background: 'rgba(212,184,120,0.1)', color: '#d4b878',
                        fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                        border: '1px solid rgba(212,184,120,0.2)',
                      }}>
                        {post.type}
                      </span>
                      <span style={{ color: '#f2e8d0', fontSize: '13px', fontWeight: 500 }}>{post.title}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{
                        color: post.status === '已审核' ? '#9cba8a' : 'rgba(212,184,120,0.5)',
                        fontSize: '11px',
                      }}>
                        {post.status === '已审核' ? '✓ ' : '⋯ '}{post.status}
                      </span>
                      <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>{post.date}</span>
                      {post.status === '已审核' && (
                        <span style={{ color: 'rgba(212,184,120,0.5)', fontSize: '11px' }}>♡ {post.likes}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          myFavorites.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px',
              color: 'rgba(248,246,240,0.3)', fontSize: '13px',
            }}>
              {t('no_favorites')}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '14px',
            }}>
              {myFavorites.map((fav, i) => (
                <div key={i} className="card-glass card-hover" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{
                    height: '120px',
                    background: `linear-gradient(${100 + i * 30}deg, rgba(212,184,120,0.08), rgba(124,92,191,0.08))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ fontSize: '28px', opacity: 0.25, color: '#d4b878' }}>♡</div>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <div style={{ color: '#f2e8d0', fontSize: '12px', fontWeight: 500, marginBottom: '4px' }}>{fav.title}</div>
                    <div style={{ color: 'rgba(212,184,120,0.6)', fontSize: '11px' }}>{fav.artist}</div>
                    <div style={{ color: 'rgba(248,246,240,0.3)', fontSize: '10px', marginTop: '4px' }}>{fav.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
