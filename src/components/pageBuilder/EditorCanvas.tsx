import React, { useState, useRef } from 'react'
import type { ComponentProps, ComponentType } from '../../types/pageBuilder'
import { DEFAULT_COMPONENT_PROPS } from '../../types/pageBuilder'
import PageComponent from './PageComponent'

interface EditorCanvasProps {
  components: ComponentProps[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onAdd: (type: ComponentType, index: number) => void
  onUpdate: (id: string, props: Partial<ComponentProps>) => void
  onDelete: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

export default function EditorCanvas({ 
  components, 
  selectedId, 
  onSelect, 
  onAdd,
  onUpdate,
  onDelete,
  onReorder 
}: EditorCanvasProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragItemIndex = useRef<number | null>(null)

  // 处理从组件库拖入
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData('componentType') as ComponentType
    
    if (componentType) {
      // 从组件库拖入新组件
      onAdd(componentType, index)
    } else {
      // 重新排序
      if (dragItemIndex.current !== null && dragItemIndex.current !== index) {
        onReorder(dragItemIndex.current, index)
      }
    }
    
    setDragOverIndex(null)
    setIsDragging(false)
    dragItemIndex.current = null
  }

  // 处理组件拖拽排序
  const handleComponentDragStart = (e: React.DragEvent, index: number) => {
    dragItemIndex.current = index
    setIsDragging(true)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleComponentDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragOverIndex(components.length) // 放到最后
  }

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData('componentType') as ComponentType
    
    if (componentType) {
      onAdd(componentType, components.length)
    }
    
    setDragOverIndex(null)
  }

  return (
    <div className="flex-1 bg-gray-800 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* 画布标题 */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-white">🎨 编辑画布</h2>
          <p className="text-sm text-gray-400 mt-1">
            点击组件选中，拖拽组件重新排序
          </p>
        </div>

        {/* 组件列表 */}
        {components.length === 0 ? (
          <div 
            className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center"
            onDragOver={handleDropZoneDragOver}
            onDrop={handleDropZoneDrop}
          >
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-400 text-lg">
              从左侧组件库拖拽组件到这里开始编辑
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {components.map((component, index) => (
              <React.Fragment key={component.id}>
                {/* 拖放区域指示器 */}
                <div
                  className={`h-1 rounded-full transition-all duration-200 ${
                    dragOverIndex === index ? 'bg-yellow-400 h-2' : 'bg-transparent'
                  }`}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                />
                
                {/* 组件 */}
                <div
                  draggable
                  onDragStart={(e) => handleComponentDragStart(e, index)}
                  onDragOver={(e) => handleComponentDragOver(e, index)}
                  onClick={() => onSelect(component.id)}
                  className={`cursor-move ${
                    selectedId === component.id ? 'ring-2 ring-yellow-400' : ''
                  }`}
                >
                  <PageComponent
                    component={component}
                    isSelected={selectedId === component.id}
                    onUpdate={(props) => onUpdate(component.id, props)}
                    onDelete={() => onDelete(component.id)}
                  />
                </div>
              </React.Fragment>
            ))}
            
            {/* 末尾拖放区域 */}
            <div
              className={`h-12 rounded-lg border-2 border-dashed transition-all duration-200 ${
                dragOverIndex === components.length 
                  ? 'border-yellow-400 bg-yellow-400/10' 
                  : 'border-gray-700 bg-gray-800/50'
              }`}
              onDragOver={handleDropZoneDragOver}
              onDrop={handleDropZoneDrop}
            >
              <div className="flex items-center justify-center h-full text-gray-500">
                <span className="text-sm">拖拽组件到这里</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
