import { useContent } from '../context/ContentContext'

export default function SupportRecordPage() {
  const { content } = useContent()
  const records = content.supportRecord?.records || []

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <h2 className="section-title">眠于金色夏夜的过往 · 应援记录</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '28px', marginTop: '-8px' }}>
          记录砂金自2024年登场以来，全球粉丝的每一次线下应援、大屏投放与联名活动
        </p>

        {records.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            color: 'rgba(212,184,120,0.3)', fontSize: '14px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            暂无应援记录，管理员可在后台添加
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {records.map((r: any, i: number) => (
              <div key={i} className="card-glass" style={{
                padding: '20px 24px', borderRadius: '12px',
                display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px',
                alignItems: 'center',
              }}>
                <div style={{
                  height: '100px', borderRadius: '8px', overflow: 'hidden',
                  background: r.image ? `url(${r.image}) center/cover` : 'rgba(212,184,120,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {!r.image && <span style={{ fontSize: '28px', opacity: 0.3 }}>🎬</span>}
                </div>
                <div>
                  <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{r.title}</div>
                  <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginBottom: '6px' }}>{r.date} · {r.location}</div>
                  <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', lineHeight: '1.6' }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
