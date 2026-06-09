import { useContent } from '../context/ContentContext'

export default function MaterialsPage() {
  const { content } = useContent()
  const { official, offline } = content.materials

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">

        {/* 官方原画 */}
        <h2 className="section-title">官方原画</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '20px', marginTop: '-8px' }}>
          官方发布的砂金角色立绘、宣传图、壁纸等高清原画资源
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '56px',
        }}>
          {official.map((item, i) => (
            <div key={i} className="card-glass card-hover" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{
                height: '220px',
                background: item.image ? `url(${item.image}) center/cover` : `linear-gradient(${120 + i * 30}deg, #1a1020, #0e1a1a, #1a1a0e)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                cursor: (item.clickAction === 'link' || item.clickAction === 'interactive' || item.clickAction === 'video') ? 'pointer' : 'default',
              }} onClick={() => {
                if (item.clickAction === 'link' && item.customLink) {
                  window.open(item.customLink, '_blank')
                } else if (item.clickAction === 'video' && item.videoUrl) {
                  window.open(item.videoUrl, '_blank')
                } else if (item.clickAction === 'interactive' && item.interactiveUrl) {
                  window.open(item.interactiveUrl, '_blank')
                } else if (item.link) {
                  window.open(item.link, '_blank')
                }
              }}>
                {!item.image && <div style={{ opacity: 0.2, fontSize: '48px', color: '#d4b878' }}>◆</div>}
                {item.clickAction === 'video' && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0,0,0,0.7)', color: '#fff',
                    fontSize: '32px', padding: '16px 20px', borderRadius: '50%',
                    border: '2px solid rgba(212,184,120,0.5)',
                    pointerEvents: 'none',
                  }}>
                    ▶
                  </div>
                )}
                {item.clickAction === 'interactive' && (
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'rgba(156,186,138,0.8)', color: '#fff',
                    fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                  }}>
                    ⚡ 交互
                  </div>
                )}
                {(item.clickAction === 'link' || item.link) && (
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'rgba(0,0,0,0.6)', color: '#d4b878',
                    fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                    border: '1px solid rgba(212,184,120,0.3)',
                    opacity: 0.8,
                  }}>
                    查看原图 ↗
                  </div>
                )}
                {item.date && (
                  <span style={{
                    position: 'absolute', bottom: '10px', left: '10px',
                    background: 'rgba(212,184,120,0.2)', color: '#d4b878',
                    fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                    border: '1px solid rgba(212,184,120,0.3)',
                  }}>
                    {item.date}
                  </span>
                )}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
                <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '6px' }}>{item.desc}</div>
                {item.clickAction === 'video' && item.videoUrl && (
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#e07070', fontSize: '11px',
                      textDecoration: 'none',
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    ▶ 播放视频
                  </a>
                )}
                {item.clickAction === 'interactive' && item.interactiveUrl && (
                  <a
                    href={item.interactiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#9cba8a', fontSize: '11px',
                      textDecoration: 'none',
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    ⚡ 打开交互
                  </a>
                )}
                {(item.clickAction === 'link' || item.link) && (
                  <a
                    href={item.customLink || item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'rgba(212,184,120,0.6)', fontSize: '11px',
                      textDecoration: 'none',
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    下载/查看原图 ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 物料整理 */}
        <h2 className="section-title">物料整理</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '20px', marginTop: '-8px' }}>
          粉丝应援物料汇总，包括应援棒、横幅、手幅、贴纸等可下载打印的应援物资
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {offline.map((item, i) => (
            <div key={i} className="card-glass card-hover" style={{ borderRadius: '12px', overflow: 'hidden' }}>
              {item.image && (
                <div style={{
                  height: '180px',
                  background: `url(${item.image}) center/cover`,
                  position: 'relative',
                  cursor: (item.clickAction === 'link' || item.clickAction === 'interactive' || item.clickAction === 'video') ? 'pointer' : 'default',
                }} onClick={() => {
                  if (item.clickAction === 'link' && item.customLink) {
                    window.open(item.customLink, '_blank')
                  } else if (item.clickAction === 'video' && item.videoUrl) {
                    window.open(item.videoUrl, '_blank')
                  } else if (item.clickAction === 'interactive' && item.interactiveUrl) {
                    window.open(item.interactiveUrl, '_blank')
                  } else if (item.link) {
                    window.open(item.link, '_blank')
                  }
                }}>
                  {item.clickAction === 'video' && (
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(0,0,0,0.7)', color: '#fff',
                      fontSize: '32px', padding: '12px 16px', borderRadius: '50%',
                      border: '2px solid rgba(224,112,112,0.5)',
                      pointerEvents: 'none',
                    }}>
                      ▶
                    </div>
                  )}
                  {item.clickAction === 'interactive' && (
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: 'rgba(156,186,138,0.8)', color: '#fff',
                      fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                    }}>
                      ⚡ 交互
                    </div>
                  )}
                  {item.date && (
                    <span style={{
                      position: 'absolute', bottom: '8px', left: '8px',
                      background: 'rgba(0,0,0,0.7)', color: '#d4b878',
                      fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                    }}>
                      {item.date}
                    </span>
                  )}
                </div>
              )}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ color: '#f2e8d0', fontSize: '14px', fontWeight: 600, flex: 1 }}>{item.title}</div>
                  <span style={{
                    background: 'rgba(212,184,120,0.15)', color: '#d4b878',
                    fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                    marginLeft: '8px', border: '1px solid rgba(212,184,120,0.3)',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.tag}
                  </span>
                </div>
                <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginBottom: '10px' }}>{item.desc}</div>
                {item.date && (
                  <div style={{ color: 'rgba(212,184,120,0.5)', fontSize: '11px', marginBottom: '8px' }}>
                    📅 {item.date}
                  </div>
                )}
                {item.clickAction === 'video' && item.videoUrl && (
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#e07070', fontSize: '12px',
                      textDecoration: 'none',
                      marginRight: '12px',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    ▶ 播放视频
                  </a>
                )}
                {item.clickAction === 'interactive' && item.interactiveUrl && (
                  <a
                    href={item.interactiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#9cba8a', fontSize: '12px',
                      textDecoration: 'none',
                      marginRight: '12px',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    ⚡ 打开交互
                  </a>
                )}
                {(item.clickAction === 'link' || item.link) && (
                  <a
                    href={item.customLink || item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#d4b878', fontSize: '12px',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(212,184,120,0.3)',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    下载物料 / 查看详情 →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
