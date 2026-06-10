import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer style={{
      background: '#080808',
      borderTop: '1px solid rgba(212,184,120,0.2)',
      padding: '32px 0 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Cute bottom decoration */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: 'translateX(-50%)', opacity: 0.06,
        pointerEvents: 'none', userSelect: 'none',
      }}>
        <svg width="600" height="100" viewBox="0 0 600 100">
          {/* Sleeping cat */}
          <ellipse cx="80" cy="85" rx="35" ry="18" fill="#d4b878"/>
          <ellipse cx="65" cy="70" rx="18" ry="16" fill="#d4b878"/>
          <polygon points="55,60 60,48 66,58" fill="#c4a868"/>
          <polygon points="75,60 70,48 64,58" fill="#c4a868"/>
          <path d="M58,74 Q63,69 67,74" stroke="#121212" strokeWidth="1" fill="none"/>
          <circle cx="61" cy="68" r="2" fill="#121212"/>
          <circle cx="69" cy="68" r="2" fill="#121212"/>
          <ellipse cx="65" cy="73" rx="1.5" ry="1" fill="#121212"/>
          <path d="M50,80 Q45,65 35,55" stroke="#d4b878" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <ellipse cx="80" cy="90" rx="6" ry="3" fill="#121212"/>
          
          {/* Cute bird */}
          <circle cx="180" cy="60" r="10" fill="#f2e8d0"/>
          <circle cx="186" cy="58" r="3" fill="#d4b878"/>
          <circle cx="174" cy="58" r="2" fill="#121212"/>
          <polygon points="182,62 188,60 182,58" fill="#e0a060"/>
          <ellipse cx="180" cy="68" rx="6" ry="4" fill="#f2e8d0"/>
          {/* Bird legs */}
          <line x1="177" y1="72" x2="175" y2="82" stroke="#e0a060" strokeWidth="1.5"/>
          <line x1="183" y1="72" x2="185" y2="82" stroke="#e0a060" strokeWidth="1.5"/>
          
          {/* Sitting bunny */}
          <ellipse cx="280" cy="82" rx="20" ry="14" fill="#f0e8d8"/>
          <ellipse cx="280" cy="62" rx="14" ry="16" fill="#f0e8d8"/>
          <ellipse cx="273" cy="48" rx="5" ry="11" fill="#f0e8d8"/>
          <ellipse cx="287" cy="48" rx="5" ry="11" fill="#f0e8d8"/>
          <ellipse cx="273" cy="46" rx="3" ry="7" fill="#f0c8d0"/>
          <ellipse cx="287" cy="46" rx="3" ry="7" fill="#f0c8d0"/>
          <circle cx="276" cy="60" r="2.5" fill="#121212"/>
          <circle cx="284" cy="60" r="2.5" fill="#121212"/>
          <ellipse cx="280" cy="66" rx="2" ry="1.5" fill="#e898b8"/>
          <path d="M277,70 Q280,67 283,70" stroke="#121212" strokeWidth="0.8" fill="none"/>
          
          {/* Small hamster/chinchilla */}
          <ellipse cx="400" cy="84" rx="22" ry="14" fill="#d4c8b0"/>
          <ellipse cx="395" cy="72" rx="14" ry="12" fill="#d4c8b0"/>
          <circle cx="390" cy="70" r="2" fill="#121212"/>
          <circle cx="400" cy="70" r="2" fill="#121212"/>
          <ellipse cx="395" cy="75" rx="1.5" ry="1" fill="#121212"/>
          <ellipse cx="387" cy="68" rx="4" ry="5" fill="#e8c8a8" opacity="0.5"/>
          <ellipse cx="403" cy="68" rx="4" ry="5" fill="#e8c8a8" opacity="0.5"/>
          <ellipse cx="400" cy="90" rx="5" ry="2.5" fill="#121212"/>
          
          {/* Tiny chick */}
          <circle cx="530" cy="75" r="8" fill="#f8e8a0"/>
          <circle cx="527" cy="73" r="1.5" fill="#121212"/>
          <circle cx="533" cy="73" r="1.5" fill="#121212"/>
          <polygon points="530,77 532,79 528,79" fill="#e0a060"/>
          <circle cx="526" cy="65" r="4" fill="#f0e0a0" opacity="0.5"/>
          <circle cx="534" cy="66" r="3" fill="#f0e0a0" opacity="0.5"/>
          
          {/* Stars and hearts */}
          <text x="130" y="45" fontSize="10" fill="#d4b878">✦</text>
          <text x="250" y="50" fontSize="7" fill="#d4b878">✦</text>
          <text x="340" y="40" fontSize="8" fill="#d4b878">✧</text>
          <text x="470" y="48" fontSize="6" fill="#d4b878">✦</text>
          <text x="560" y="52" fontSize="7" fill="#d4b878">✧</text>
          <text x="200" y="42" fontSize="6" fill="#e898b8">♥</text>
          <text x="450" y="40" fontSize="6" fill="#e898b8">♥</text>
          <text x="310" y="45" fontSize="5" fill="#e898b8">♥</text>
        </svg>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6" style={{ position: 'relative', zIndex: 1 }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="aurora-text text-lg font-bold tracking-widest mb-1">
              {t('footer_slogan')}
            </div>
            <div style={{ color: 'rgba(212,184,120,0.5)', fontSize: '12px', letterSpacing: '0.15em' }}>
              AVENTURINE FAN STATION · 砂金全球应援站
            </div>
          </div>
          <div className="text-center md:text-right">
            <div style={{ color: 'rgba(212,184,120,0.4)', fontSize: '11px', lineHeight: '1.8' }}>
              {t('copyright')}
            </div>
            <div style={{ color: 'rgba(212,184,120,0.3)', fontSize: '10px', marginTop: '4px' }}>
              © 2026 Aventurine Fan Station · Honkai: Star Rail © miHoYo
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(212,184,120,0.1)',
          marginTop: '20px',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}>
          {['🐱 Aventurine', '✦ Penacony', '✦ HSR', '🐰 Fan Station'].map(tag => (
            <span key={tag} style={{ color: 'rgba(212,184,120,0.35)', fontSize: '11px' }}>{tag}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}
