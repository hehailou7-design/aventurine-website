import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer style={{
      background: '#080808',
      borderTop: '1px solid rgba(212,184,120,0.2)',
      padding: '32px 0 20px',
    }}>
      <div className="max-w-screen-2xl mx-auto px-6">
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
          {['🎰 Aventurine', '✦ Penacony', '✦ HSR', '✦ Fan Station'].map(tag => (
            <span key={tag} style={{ color: 'rgba(212,184,120,0.35)', fontSize: '11px' }}>{tag}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}
