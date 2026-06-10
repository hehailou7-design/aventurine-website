import React, { useMemo } from 'react'
import { useContent } from '../context/ContentContext'
import type { ComponentProps } from '../types/pageBuilder'

// 渲染单个组件
function RenderComponent({ component }: { component: ComponentProps }) {
  const baseStyle: React.CSSProperties = {
    marginBottom: `${(component.margin || 16)}px`,
  }

  switch (component.type) {
    case 'heading':
      return (
        <h2 style={{
          fontSize: `${(component.fontSize || 24)}px`,
          fontWeight: component.fontWeight === 'bold' ? 700 : component.fontWeight === 'semibold' ? 600 : 400,
          color: component.textColor || '#d4b878',
          textAlign: (component.alignment || 'left') as 'left' | 'center' | 'right',
          ...baseStyle,
        }}>
          {component.content || '标题文字'}
        </h2>
      )
    
    case 'text':
      return (
        <p style={{
          fontSize: `${(component.fontSize || 16)}px`,
          color: component.textColor || '#f2e8d0',
          lineHeight: 1.8,
          textAlign: (component.alignment || 'left') as 'left' | 'center' | 'right',
          ...baseStyle,
        }}>
          {component.content || '正文内容'}
        </p>
      )
    
    case 'image':
      return (
        <div style={baseStyle}>
          <img 
            src={component.src || 'https://via.placeholder.com/800x400'} 
            alt={component.alt || ''}
            style={{
              width: '100%',
              maxWidth: `${((component as any).imageWidth || 800)}px`,
              borderRadius: `${(component.borderRadius || 8)}px`,
              display: 'block',
              margin: component.alignment === 'center' ? '0 auto' : '0',
            }}
          />
          {(component as any).caption && (
            <p style={{ 
              textAlign: 'center', 
              color: 'rgba(248,246,240,0.5)', 
              fontSize: '12px', 
              marginTop: '8px' 
            }}>
              {(component as any).caption}
            </p>
          )}
        </div>
      )
    
    case 'button':
      return (
        <div style={{ ...baseStyle, textAlign: (component.alignment || 'left') as any }}>
          <a 
            href={(component as any).buttonLink || '#'}
            target={(component as any).buttonLink?.startsWith('http') ? '_blank' : '_self'}
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: component.backgroundColor || 'linear-gradient(135deg, #d4b878, #a8893a)',
              color: component.textColor || '#121212',
              borderRadius: '${(component.borderRadius || 8)}px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(212, 184, 120, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {(component as any).buttonText || '点击按钮'}
          </a>
        </div>
      )
    
    case 'divider':
      return (
        <hr style={{
          border: 'none',
          borderTop: `1px solid ${component.backgroundColor || 'rgba(212,184,120,0.3)'}`,
          margin: '24px 0',
          ...baseStyle,
        }} />
      )
    
    case 'spacer':
      return <div style={{ height: `${(component.padding || 32)}px`, ...baseStyle }} />
    
    case 'video':
      return (
        <div style={{ ...baseStyle, textAlign: 'center' }}>
          <div style={{ 
            position: 'relative', 
            paddingBottom: '56.25%', 
            height: 0, 
            overflow: 'hidden',
            borderRadius: '${(component.borderRadius || 8)}px',
          }}>
            <iframe
              src={component.videoUrl || ''}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              allowFullScreen
            />
          </div>
        </div>
      )
    
    case 'card':
      return (
        <div style={{
          background: component.backgroundColor || 'rgba(26,26,26,0.6)',
          border: '1px solid rgba(212,184,120,0.2)',
          borderRadius: '${(component.borderRadius || 12)}px',
          padding: '${(component.padding || 20)}px',
          ...baseStyle,
        }}>
          {component.title && (
            <h3 style={{ color: '#d4b878', fontSize: '18px', marginBottom: '12px' }}>
              {component.title}
            </h3>
          )}
          {component.description && (
            <p style={{ color: '#f2e8d0', lineHeight: 1.8 }}>
              {component.description}
            </p>
          )}
          {component.imageUrl && (
            <img 
              src={component.imageUrl} 
              alt=""
              style={{ 
                width: '100%', 
                borderRadius: '${(component.borderRadius || 8)}px', 
                marginTop: '12px',
              }} 
            />
          )}
        </div>
      )
    
    case 'columns':
      const columns = (component as any).columns || []
      return (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
          gap: '16px',
          ...baseStyle,
        }}>
          {columns.map((col: any, i: number) => (
            <div key={i} style={{
              background: 'rgba(212,184,120,0.05)',
              border: '1px solid rgba(212,184,120,0.1)',
              borderRadius: '8px',
              padding: '16px',
            }}>
              {col.title && <h4 style={{ color: '#d4b878', fontSize: '14px', marginBottom: '8px' }}>{col.title}</h4>}
              {col.content && <p style={{ color: '#f2e8d0', fontSize: '13px', lineHeight: 1.6 }}>{col.content}</p>}
            </div>
          ))}
        </div>
      )
    
    default:
      return null
  }
}

// 主页面组件
export default function CustomPage() {
  const { content } = useContent()
  const pageBuilderData = content.pageBuilder

  if (!pageBuilderData || !pageBuilderData.components || pageBuilderData.components.length === 0) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{ fontSize: '48px' }}>🎨</div>
        <h2 style={{ color: '#d4b878', fontSize: '24px' }}>页面构建器</h2>
        <p style={{ color: 'rgba(248,246,240,0.6)', fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
          后台管理 → 页面构建器，使用拖拽方式创建自定义页面内容。
        </p>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px' }}>
          提示：按 Ctrl+Shift+K 进入后台管理
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      {/* 页面标题 */}
      {pageBuilderData.pageName && (
        <h1 style={{ 
          color: '#d4b878', 
          fontSize: '32px', 
          fontWeight: 700, 
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          {pageBuilderData.pageName}
        </h1>
      )}
      
      {/* 渲染所有组件 */}
      {pageBuilderData.components.map((component) => (
        <RenderComponent key={component.id} component={component} />
      ))}
    </div>
  )
}
