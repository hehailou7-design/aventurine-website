import React from 'react'
import type { ComponentProps } from '../../types/pageBuilder'

interface PageComponentProps {
  component: ComponentProps
  isSelected: boolean
  onUpdate: (props: Partial<ComponentProps>) => void
  onDelete: () => void
}

export default function PageComponent({ component, isSelected }: PageComponentProps) {
  const { type, content, src, alt, buttonText, buttonLink, title, description, imageUrl, fontSize, textColor, backgroundColor, padding, alignment, borderRadius } = component

  const alignmentClass = {
    left: 'text-left justify-start',
    center: 'text-center justify-center',
    right: 'text-right justify-end',
  }[alignment || 'left']

  const renderComponent = () => {
    switch (type) {
      case 'heading':
        return (
          <div 
            className={`p-${padding || 4} ${alignmentClass}`}
            style={{ color: textColor }}
          >
            <h2 style={{ fontSize: `${(fontSize || 32) / 16}rem`, fontWeight: 'bold' }}>
              {content || '标题文字'}
            </h2>
          </div>
        )
      
      case 'text':
        return (
          <div 
            className={`p-${padding || 4} ${alignmentClass}`}
            style={{ color: textColor }}
          >
            <p style={{ fontSize: `${(fontSize || 16) / 16}rem` }}>
              {content || '这里是正文内容'}
            </p>
          </div>
        )
      
      case 'image':
        return (
          <div className={`p-${padding || 4} flex ${alignmentClass}`}>
            <img 
              src={src || 'https://via.placeholder.com/800x400'} 
              alt={alt || '图片'} 
              className="max-w-full h-auto rounded"
              style={{ 
                width: component.imageWidth ? `${component.imageWidth}%` : 'auto',
                height: component.imageHeight ? `${component.imageHeight}px` : 'auto',
              }}
            />
          </div>
        )
      
      case 'button':
        return (
          <div className={`p-${padding || 4} flex ${alignmentClass}`}>
            <a
              href={buttonLink || '#'}
              className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
                component.buttonStyle === 'primary' ? 'bg-yellow-400 text-black hover:bg-yellow-500' :
                component.buttonStyle === 'secondary' ? 'bg-gray-700 text-white hover:bg-gray-600' :
                'bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
              }`}
              style={{ 
                backgroundColor: component.buttonStyle === 'outline' ? 'transparent' : backgroundColor,
                color: textColor,
              }}
            >
              {buttonText || '点击按钮'}
            </a>
          </div>
        )
      
      case 'divider':
        return (
          <div className={`p-${padding || 2}`}>
            <hr className="border-t border-gray-600" />
          </div>
        )
      
      case 'spacer':
        return (
          <div style={{ height: `${(padding || 32) * 4}px` }} />
        )
      
      case 'video':
        return (
          <div className={`p-${padding || 4} flex ${alignmentClass}`}>
            {component.videoUrl ? (
              <div className="w-full max-w-4xl aspect-video bg-black rounded-lg flex items-center justify-center">
                <span className="text-gray-400">视频: {component.videoUrl}</span>
              </div>
            ) : (
              <div className="w-full max-w-4xl aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">🎬 点击右侧编辑视频链接</span>
              </div>
            )}
          </div>
        )
      
      case 'card':
        return (
          <div className={`p-${padding || 4}`}>
            <div 
              className="overflow-hidden"
              style={{ 
                backgroundColor: backgroundColor || '#1f2937',
                color: textColor || '#ffffff',
                borderRadius: `${(borderRadius || 8)}px`,
              }}
            >
              {imageUrl && (
                <img src={imageUrl} alt={title || '卡片'} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{title || '卡片标题'}</h3>
                <p className="text-gray-300">{description || '卡片描述文字'}</p>
              </div>
            </div>
          </div>
        )
      
      case 'columns':
        return (
          <div className={`p-${padding || 4} grid grid-cols-1 md:grid-cols-2 gap-4`}>
            <div className="bg-gray-700 p-4 rounded-lg min-h-[100px] flex items-center justify-center text-gray-400">
              左栏内容
            </div>
            <div className="bg-gray-700 p-4 rounded-lg min-h-[100px] flex items-center justify-center text-gray-400">
              右栏内容
            </div>
          </div>
        )
      
      default:
        return <div>未知组件类型</div>
    }
  }

  return (
    <div 
      className={`relative group ${isSelected ? 'ring-2 ring-yellow-400' : ''}`}
      style={{ backgroundColor: type === 'divider' || type === 'spacer' ? 'transparent' : backgroundColor }}
    >
      {/* 组件工具栏（选中时显示） */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-gray-900 text-yellow-400 text-xs px-2 py-1 rounded">
            {type}
          </span>
        </div>
      )}
      
      {/* 组件内容 */}
      {renderComponent()}
    </div>
  )
}
