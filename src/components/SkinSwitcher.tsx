import { useSkin } from '../context/SkinContext'

export default function SkinSwitcher() {
  const { currentSkin, skinId, setSkinId, skins } = useSkin()
  
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      right: '16px',
      transform: 'translateY(-50%)',
      zIndex: 9998,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      background: 'rgba(14,14,14,0.9)',
      border: '1px solid rgba(212,184,120,0.3)',
      borderRadius: '12px',
      padding: '8px 6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        color: 'rgba(248,246,240,0.5)',
        fontSize: '9px',
        textAlign: 'center',
        marginBottom: '4px',
        letterSpacing: '0.1em',
      }}>
        皮肤
      </div>
      
      {skins.map(skin => (
        <button
          key={skin.id}
          onClick={() => setSkinId(skin.id)}
          title={`${skin.name} / ${skin.nameEn}`}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: skinId === skin.id ? '2px solid ' + skin.primary : '2px solid transparent',
            background: `linear-gradient(135deg, ${skin.primary} 0%, ${skin.secondary} 100%)`,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: skinId === skin.id ? 'scale(1.1)' : 'scale(1)',
            boxShadow: skinId === skin.id ? `0 0 12px ${skin.primary}` : 'none',
            position: 'relative',
          }}
        >
          {/* 皮肤图标 */}
          {skin.id === 'original' && (
            <span style={{ fontSize: '16px' }}>🎰</span>
          )}
          {skin.id === 'sakura' && (
            <span style={{ fontSize: '16px' }}>🌸</span>
          )}
          {skin.id === 'mintChocolate' && (
            <span style={{ fontSize: '16px' }}>🍃</span>
          )}
          {skin.id === 'whiteLace' && (
            <span style={{ fontSize: '16px' }}>❄️</span>
          )}
          
          {/* 当前皮肤指示 */}
          {skinId === skin.id && (
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: skin.primary,
              border: '2px solid #0e0e0e',
              fontSize: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              ✓
            </div>
          )}
        </button>
      ))}
      
      {/* 分隔线 */}
      <div style={{
        height: '1px',
        background: 'rgba(212,184,120,0.2)',
        margin: '4px 0',
      }} />
      
      {/* 皮肤名称提示 */}
      <div style={{
        color: currentSkin.primary,
        fontSize: '8px',
        textAlign: 'center',
        marginTop: '2px',
        maxWidth: '50px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {currentSkin.name}
      </div>
    </div>
  )
}
