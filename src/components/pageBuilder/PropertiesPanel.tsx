import React from 'react'
import type { ComponentProps, ComponentType } from '../../types/pageBuilder'

interface PropertiesPanelProps {
  component: ComponentProps | null
  onUpdate: (props: Partial<ComponentProps>) => void
  onDelete: () => void
  onDuplicate: () => void
}

export default function PropertiesPanel({ component, onUpdate, onDelete, onDuplicate }: PropertiesPanelProps) {
  if (!component) {
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-yellow-400">⚙️ 属性面板</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🖱️</div>
            <p className="text-gray-400">点击画布上的组件开始编辑</p>
          </div>
        </div>
      </div>
    )
  }

  const { type } = component

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col h-full">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-yellow-400">⚙️ 属性编辑</h3>
        <p className="text-sm text-gray-400 mt-1">类型: {type}</p>
      </div>
      
      {/* 属性表单 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 通用属性 */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-300 uppercase">布局</h4>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">对齐方式</label>
            <select
              value={component.alignment || 'left'}
              onChange={(e) => onUpdate({ alignment: e.target.value as 'left' | 'center' | 'right' })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="left">左对齐</option>
              <option value="center">居中</option>
              <option value="right">右对齐</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">内边距 ({component.padding || 0}px)</label>
            <input
              type="range"
              min="0"
              max="64"
              value={component.padding || 0}
              onChange={(e) => onUpdate({ padding: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">背景颜色</label>
            <input
              type="color"
              value={component.backgroundColor || '#1f2937'}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="w-full h-10 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* 根据组件类型显示不同属性 */}
        {(type === 'heading' || type === 'text') && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase">文字</h4>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">内容</label>
              <textarea
                value={component.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                rows={4}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">字体大小 ({component.fontSize || 16}px)</label>
              <input
                type="range"
                min="12"
                max="72"
                value={component.fontSize || (type === 'heading' ? 32 : 16)}
                onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">文字颜色</label>
              <input
                type="color"
                value={component.textColor || '#ffffff'}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                className="w-full h-10 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">字体粗细</label>
              <select
                value={component.fontWeight || 'normal'}
                onChange={(e) => onUpdate({ fontWeight: e.target.value as 'normal' | 'bold' | 'semibold' })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="normal">正常</option>
                <option value="semibold">中等</option>
                <option value="bold">粗体</option>
              </select>
            </div>
          </div>
        )}

        {type === 'image' && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase">图片</h4>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">图片链接</label>
              <input
                type="text"
                value={component.src || ''}
                onChange={(e) => onUpdate({ src: e.target.value })}
                placeholder="https://..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">替代文字</label>
              <input
                type="text"
                value={component.alt || ''}
                onChange={(e) => onUpdate({ alt: e.target.value })}
                placeholder="图片描述"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">宽度 (%)</label>
              <input
                type="range"
                min="10"
                max="100"
                value={component.imageWidth || 100}
                onChange={(e) => onUpdate({ imageWidth: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {type === 'button' && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase">按钮</h4>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">按钮文字</label>
              <input
                type="text"
                value={component.buttonText || ''}
                onChange={(e) => onUpdate({ buttonText: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">链接地址</label>
              <input
                type="text"
                value={component.buttonLink || ''}
                onChange={(e) => onUpdate({ buttonLink: e.target.value })}
                placeholder="https://..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">按钮样式</label>
              <select
                value={component.buttonStyle || 'primary'}
                onChange={(e) => onUpdate({ buttonStyle: e.target.value as 'primary' | 'secondary' | 'outline' })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="primary">主要按钮</option>
                <option value="secondary">次要按钮</option>
                <option value="outline">描边按钮</option>
              </select>
            </div>
          </div>
        )}

        {type === 'card' && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase">卡片</h4>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">标题</label>
              <input
                type="text"
                value={component.title || ''}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">描述</label>
              <textarea
                value={component.description || ''}
                onChange={(e) => onUpdate({ description: e.target.value })}
                rows={3}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">图片链接</label>
              <input
                type="text"
                value={component.imageUrl || ''}
                onChange={(e) => onUpdate({ imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">圆角 ({component.borderRadius || 8}px)</label>
              <input
                type="range"
                min="0"
                max="24"
                value={component.borderRadius || 8}
                onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {type === 'video' && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase">视频</h4>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">视频链接</label>
              <input
                type="text"
                value={component.videoUrl || ''}
                onChange={(e) => onUpdate({ videoUrl: e.target.value })}
                placeholder="YouTube或Bilibili链接"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
          </div>
        )}

        {type === 'spacer' && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase">间距</h4>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">高度 ({component.padding || 32}px)</label>
              <input
                type="range"
                min="8"
                max="128"
                value={component.padding || 32}
                onChange={(e) => onUpdate({ padding: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* 底部操作按钮 */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button
          onClick={onDuplicate}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors"
        >
          📋 复制组件
        </button>
        <button
          onClick={onDelete}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm transition-colors"
        >
          🗑️ 删除组件
        </button>
      </div>
    </div>
  )
}
