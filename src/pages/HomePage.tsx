import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'
import type { PageType } from '../App'

const bgGradients = [
  'linear-gradient(135deg, #1a0f2e 0%, #0d1a2e 40%, #0a1a0f 100%)',
  'linear-gradient(135deg, #0a1a2e 0%, #1a1a0a 50%, #1a0a1a 100%)',
  'linear-gradient(135deg, #1a1a0a 0%, #0d0a1a 50%, #1a0a0a 100%)',
]

interface HomePageProps {
  onNavigate: (page: PageType) => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { t } = useLang()
  const { content } = useContent()
  const [slide, setSlide] = useState(0)

  const bannerSlides = content.home.bannerSlides
  const navCards = content.home.navCards
  const updates = content.home.updates

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % bannerSlides.length), 5000)
    return () => clearInterval(timer)
  }, [bannerSlides.length])

  const current = bannerSlides[slide]
  const currentBg = bgGradients[slide % bgGradients.length]

  return (
    <div>
      {/* Hero Banner */}
      <div style={{
        width: '100%',
        minHeight: 'min(480px, 50vw)',
        background: current.image ? `url(${current.image}) center/cover no-repeat` : currentBg,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        transition: 'background 1s ease',
      }}>
        {/* Dark overlay when image present */}
        {current.image && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.15) 100%)',
          }} />
        )}
        {/* Aurora overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 80%, rgba(124,92,191,0.2) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(74,111,165,0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        {/* Decorative chips/coins */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', opacity: 0.15 }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#d4b878" strokeWidth="2"/>
            <circle cx="100" cy="100" r="70" fill="none" stroke="#d4b878" strokeWidth="1" strokeDasharray="8 4"/>
            <circle cx="100" cy="100" r="50" fill="none" stroke="#d4b878" strokeWidth="1.5"/>
            <text x="100" y="108" textAnchor="middle" fill="#d4b878" fontSize="24" fontFamily="serif">♦</text>
          </svg>
        </div>

        {/* Plum blossom decoration */}
        <div style={{ position: 'absolute', bottom: '15%', right: '15%', opacity: 0.08 }}>
          {[0,72,144,216,288].map(deg => (
            <div key={deg} style={{
              position: 'absolute',
              width: '20px', height: '20px',
              background: '#d4b878',
              borderRadius: '50%',
              transform: `rotate(${deg}deg) translate(30px, 0)`,
            }} />
          ))}
          <div style={{ width: '20px', height: '20px', background: '#d4b878', borderRadius: '50%' }} />
        </div>

        {/* Text block - bottom left */}
        <div style={{ padding: '40px 60px', position: 'relative', zIndex: 2, maxWidth: '700px' }}
          className="px-6 md:px-16 py-8 md:py-12">
          <div style={{
            fontSize: '12px', letterSpacing: '0.3em',
            color: current.accent, opacity: 0.8,
            marginBottom: '12px',
          }}>
            AVENTURINE · 砂金 · 崩坏：星穹铁道
          </div>
          <div style={{
            fontSize: 'clamp(14px, 2.5vw, 22px)',
            color: 'rgba(242,232,208,0.9)',
            letterSpacing: '0.08em',
            marginBottom: '16px',
          }}>
            {current.tagline}
          </div>
          <div className="aurora-text" style={{
            fontSize: 'clamp(20px, 4vw, 42px)',
            fontWeight: '700',
            letterSpacing: '0.06em',
            lineHeight: '1.3',
            marginBottom: '24px',
          }}>
            {t('slogan')}
          </div>
          <button
            onClick={() => onNavigate('supportRecord')}
            className="btn-gold"
            style={{ fontSize: '13px', letterSpacing: '0.1em' }}
          >
            {t('join_us')} →
          </button>
        </div>

        {/* Slide indicators */}
        <div style={{
          position: 'absolute', bottom: '20px', right: '40px',
          display: 'flex', gap: '8px',
        }}>
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === slide ? '#d4b878' : 'rgba(212,184,120,0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div style={{ padding: '40px 0', background: 'rgba(10,10,10,0.8)' }}>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
          <h2 className="section-title scroll-fade-in">{t('quick_cards')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '12px',
          }}>
            {navCards.map((card, index) => (
              <button
                key={card.key}
                onClick={() => onNavigate(card.key as PageType)}
                className="card-glass text-left card-3d card-shine scroll-fade-in"
                style={{ 
                  padding: '16px', 
                  cursor: 'pointer', 
                  border: 'none',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  transitionDelay: `${index * 100}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(212, 184, 120, 0.2), 0 0 30px rgba(124, 92, 191, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px', color: card.color }}>
                  {card.icon}
                </div>
                <div style={{ color: card.color, fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                  {card.label}
                </div>
                <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px' }}>
                  {card.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Updates */}
      <div style={{ padding: '40px 0' }}>
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
          <h2 className="section-title scroll-fade-in">{t('latest_update')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {updates.map((u, i) => (
              <div key={i} className="card-glass card-shine scroll-slide-left" style={{
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.3s ease-out',
                cursor: 'pointer',
                transitionDelay: `${i * 100}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 184, 120, 0.5)'
                e.currentTarget.style.transform = 'translateX(8px)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 184, 120, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.transform = 'translateX(0)'
                e.currentTarget.style.boxShadow = ''
              }}
              >
                <span style={{
                  color: '#d4b878',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  opacity: 0.7,
                  whiteSpace: 'nowrap',
                }}>
                  {u.date}
                </span>
                <span style={{
                  background: 'rgba(212,184,120,0.15)',
                  color: '#d4b878',
                  fontSize: '10px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(212,184,120,0.3)',
                  whiteSpace: 'nowrap',
                }}>
                  {u.tag}
                </span>
                <span style={{ color: '#f2e8d0', fontSize: '13px', flex: 1 }}>{u.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212,184,120,0.08) 0%, rgba(124,92,191,0.06) 100%)',
        borderTop: '1px solid rgba(212,184,120,0.15)',
        borderBottom: '1px solid rgba(212,184,120,0.15)',
        padding: '48px 0',
        marginTop: '20px',
      }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="aurora-text" style={{
            fontSize: 'clamp(18px, 3vw, 28px)',
            fontWeight: '700',
            letterSpacing: '0.12em',
            marginBottom: '16px',
          }}>
            {t('slogan')}
          </div>
          <p style={{ color: 'rgba(242,232,208,0.6)', fontSize: '13px', lineHeight: '2', letterSpacing: '0.05em', whiteSpace: 'pre-line' }}>
            {content.home.aboutText}
          </p>
        </div>
      </div>
    </div>
  )
}
