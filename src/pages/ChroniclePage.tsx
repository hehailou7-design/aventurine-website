import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'

const eventAccents = [
  '#d4b878', '#b0a0d8', '#9cba8a', '#e0c060',
  '#b0a0d8', '#d4b878', '#9cba8a', '#d4b878',
]

export default function ChroniclePage() {
  const { t } = useLang()
  const { content } = useContent()
  const events = content.chronicle.events

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <h2 className="section-title">{t('timeline')}</h2>
        <p style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginBottom: '32px', lineHeight: '1.7' }}>
          记录砂金·Aventurine 从首登场到如今的每一个重要时刻。点缀梅花与骰子，见证这场跨越命运的赌局。
        </p>

        <div style={{ position: 'relative', paddingLeft: '60px' }}>
          <div style={{
            position: 'absolute', left: '20px', top: '8px', bottom: '8px',
            width: '2px',
            background: 'linear-gradient(to bottom, #d4b878, rgba(212,184,120,0.15))',
          }} />

          {events.map((event, i) => {
            const accent = eventAccents[i % eventAccents.length]
            return (
              <div key={i} style={{ position: 'relative', marginBottom: '36px' }}>
                <div style={{
                  position: 'absolute', left: '-48px', top: '4px',
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: accent,
                  border: '3px solid #0e0e0e',
                  boxShadow: `0 0 8px ${accent}60`,
                }} />

                {i % 3 === 2 && (
                  <div style={{
                    position: 'absolute', left: '-56px', top: '-8px',
                    fontSize: '24px', opacity: 0.15, color: '#d4b878',
                    transform: 'rotate(15deg)',
                  }}>
                    ✿
                  </div>
                )}

                {i % 4 === 1 && (
                  <div style={{
                    position: 'absolute', right: '0', top: '0',
                    fontSize: '32px', opacity: 0.08, color: '#d4b878',
                  }}>
                    ◉
                  </div>
                )}

                <div className="card-glass" style={{
                  padding: '18px 20px',
                  borderLeft: `3px solid ${accent}`,
                  borderRadius: '0 10px 10px 0',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '8px',
                    flexWrap: 'wrap', gap: '8px',
                  }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        color: accent, fontSize: '12px', opacity: 0.8,
                      }}>
                        {event.date}
                      </span>
                    </div>
                  </div>
                  <div style={{ color: '#f2e8d0', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    {event.title}
                  </div>
                  <p style={{ color: 'rgba(242,232,208,0.65)', fontSize: '12px', lineHeight: '1.8', margin: 0 }}>
                    {event.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
