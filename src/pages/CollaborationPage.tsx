import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'

export default function CollaborationPage() {
  const { t } = useLang()
  const { content } = useContent()
  const { stores, merch, storesTitle, merchTitle } = content.collaboration

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        {/* Collab Stores */}
        <h2 className="section-title">{storesTitle || t('collab_store')}</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '48px',
        }}>
          {stores.map((store, i) => (
            <div key={i} className="card-glass card-hover" style={{ padding: '20px', borderRadius: '10px' }}>
              {/* Store image */}
              <div style={{
                height: '140px',
                background: store.image ? `url(${store.image}) center/cover` : 'linear-gradient(135deg, rgba(212,184,120,0.06), rgba(124,92,191,0.06))',
                borderRadius: '8px', marginBottom: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {!store.image && <div style={{ fontSize: '28px', opacity: 0.25, color: '#d4b878' }}>★</div>}
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '10px',
              }}>
                <span style={{
                  background: 'rgba(212,184,120,0.1)',
                  color: '#d4b878', fontSize: '10px',
                  padding: '2px 10px', borderRadius: '4px',
                  border: '1px solid rgba(212,184,120,0.3)',
                }}>
                  {store.city}
                </span>
                <span style={{ color: 'rgba(212,184,120,0.5)', fontSize: '11px' }}>{store.time}</span>
              </div>
              <div style={{ color: '#f2e8d0', fontSize: '14px', fontWeight: 500, marginBottom: '6px', lineHeight: '1.5' }}>
                {store.name}
              </div>
              <span style={{
                background: 'rgba(212,184,120,0.06)',
                color: 'rgba(248,246,240,0.5)',
                fontSize: '11px', padding: '2px 8px', borderRadius: '4px',
                border: '1px solid rgba(212,184,120,0.15)',
              }}>
                {store.category}
              </span>
            </div>
          ))}
        </div>

        {/* Merchandise Catalog */}
        <h2 className="section-title">{merchTitle || t('merch_catalog')}</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {merch.map((item, i) => (
            <div key={i} className="card-glass card-hover" style={{ borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '160px',
                background: item.image ? `url(${item.image}) center/cover` : `linear-gradient(${100 + i * 20}deg, rgba(212,184,120,0.06), rgba(124,92,191,0.06))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderBottom: '1px solid rgba(212,184,120,0.1)',
              }}>
                {!item.image && <div style={{ fontSize: '36px', opacity: 0.25, color: '#d4b878' }}>★</div>}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{
                    background: 'rgba(212,184,120,0.1)', color: '#d4b878',
                    fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                    border: '1px solid rgba(212,184,120,0.25)',
                  }}>
                    {item.type}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: item.version.includes('限定') ? '#e0c060' : item.version.includes('收藏') ? '#b0a0d8' : 'rgba(248,246,240,0.4)',
                  }}>
                    {item.version}
                  </span>
                </div>
                <div style={{ color: '#f2e8d0', fontSize: '13px', fontWeight: 500, marginBottom: '8px', lineHeight: '1.4' }}>
                  {item.name}
                </div>
                <div style={{ color: '#d4b878', fontSize: '14px', fontWeight: 600 }}>{item.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
