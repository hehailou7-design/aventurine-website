import React from 'react'
import type { ComponentType } from '../../types/pageBuilder'
import { COMPONENT_NAMES, COMPONENT_DESCRIPTIONS } from '../../types/pageBuilder'

interface ComponentLibraryProps {
  onDragStart: (type: ComponentType) => void
}

const COMPONENT_TYPES: ComponentType[] = [
  'heading',
  'text', 
  'image',
  'button',
  'divider',
  'spacer',
  'video',
  'card',
  'columns',
]

export default function ComponentLibrary({ onDragStart }: ComponentLibraryProps) {
  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.setData('componentType', type)
    e.dataTransfer.effectAllowed = 'copy'
    onDragStart(type)
  }

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-bold text-yellow-400">📦 组件库</h3>
        <p className="text-sm text-gray-400 mt-1">拖拽组件到画布</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {COMPONENT_TYPES.map((type) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            className="bg-gray-800 border border-gray-600 rounded-lg p-3 cursor-move hover:bg-gray-700 hover:border-yellow-400/50 transition-all duration-200 select-none"
          >
            <div className="font-medium text-white text-sm">
              {COMPONENT_NAMES[type]}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {COMPONENT_DESCRIPTIONS[type]}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          💡 提示：拖拽组件到右侧画布即可添加
        </div>
      </div>
    </div>
  )
}
