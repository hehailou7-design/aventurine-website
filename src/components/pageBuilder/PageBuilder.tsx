import React, { useState, useEffect } from 'react'
import type { ComponentProps, ComponentType, PageBuilderData } from '../../types/pageBuilder'
import { DEFAULT_COMPONENT_PROPS } from '../../types/pageBuilder'
import { useContent } from '../../context/ContentContext'
import ComponentLibrary from './ComponentLibrary'
import EditorCanvas from './EditorCanvas'
import PropertiesPanel from './PropertiesPanel'

interface PageBuilderProps {
  pageId: string
  pageName: string
  onSave: (data: PageBuilderData) => void
  initialData?: PageBuilderData | null
}

export default function PageBuilder({ pageId, pageName, onSave, initialData }: PageBuilderProps) {
  const { content } = useContent()
  const [components, setComponents] = useState<ComponentProps[]>(initialData?.components || [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [showHelp, setShowHelp] = useState(false)
  const [showImport, setShowImport] = useState(false)

  // 修复核心bug：当 initialData 变化时，同步更新 components 状态
  useEffect(() => {
    if (initialData?.components) {
      setComponents(initialData.components)
      setSelectedId(null)
    } else {
      setComponents([])
      setSelectedId(null)
    }
  }, [initialData])

  // 添加组件
  const handleAdd = (type: ComponentType, index: number) => {
    const newComponent: ComponentProps = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(1, 9)}`,
      type,
      order: index,
      ...DEFAULT_COMPONENT_PROPS[type],
    }
    
    const newComponents = [...components]
    newComponents.splice(index, 0, newComponent)
    const reordered = newComponents.map((comp, idx) => ({ ...comp, order: idx }))
    setComponents(reordered)
    setSelectedId(newComponent.id)
    setSaveStatus('unsaved')
  }

  // 更新组件
  const handleUpdate = (id: string, props: Partial<ComponentProps>) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...props } : comp
    ))
    setSaveStatus('unsaved')
  }

  // 删除组件
  const handleDelete = (id: string) => {
    setComponents(components.filter(comp => comp.id !== id))
    if (selectedId === id) {
      setSelectedId(null)
    }
    setSaveStatus('unsaved')
  }

  // 复制组件
  const handleDuplicate = () => {
    if (!selectedId) return
    
    const selectedComp = components.find(comp => comp.id === selectedId)
    if (!selectedComp) return
    
    const newComponent: ComponentProps = {
      ...selectedComp,
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(1, 9)}`,
    }
    
    const index = components.findIndex(comp => comp.id === selectedId)
    const newComponents = [...components]
    newComponents.splice(index + 1, 0, newComponent)
    const reordered = newComponents.map((comp, idx) => ({ ...comp, order: idx }))
    setComponents(reordered)
    setSelectedId(newComponent.id)
    setSaveStatus('unsaved')
  }

  // 重新排序
  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newComponents = [...components]
    const [moved] = newComponents.splice(fromIndex, 1)
    newComponents.splice(toIndex, 0, moved)
    const reordered = newComponents.map((comp, idx) => ({ ...comp, order: idx }))
    setComponents(reordered)
    setSaveStatus('unsaved')
  }

  // 保存
  const handleSave = () => {
    setSaveStatus('saving')
    const data: PageBuilderData = {
      pageId,
      pageName,
      components,
    }
    onSave(data)
    setTimeout(() => setSaveStatus('saved'), 500)
  }

  // 清空画布
  const handleClear = () => {
    if (window.confirm('确定清空画布吗？此操作不可撤销！')) {
      setComponents([])
      setSelectedId(null)
      setSaveStatus('unsaved')
    }
  }

  // 导入板块内容
  const handleImportSection = (sectionKey: string) => {
    const newComponents: ComponentProps[] = []
    let order = components.length

    const addComp = (type: ComponentType, props: Partial<ComponentProps>) => {
      newComponents.push({
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(1, 9)}`,
        type,
        order: order++,
      ...DEFAULT_COMPONENT_PROPS[type],
        ...props,
      })
    }

    // 根据板块类型导入内容
    switch (sectionKey) {
      case 'home': {
        const { home } = content
        addComp('heading', { content: '首页', fontSize: 32, textColor: '#d4b878' })
        addComp('text', { content: home.aboutText || '关于本站', fontSize: 16, textColor: '#f2e8d0' })
        home.updates?.forEach(u => {
          addComp('text', { content: `【${u.tag}】${u.date} ${u.text}`, fontSize: 14, textColor: 'rgba(242,232,208,0.8)' })
        })
        break
      }
      case 'character': {
        const { character } = content
        addComp('heading', { content: '角色设定', fontSize: 32, textColor: '#d4b878' })
        addComp('text', { content: character.intro || '角色介绍', fontSize: 16, textColor: '#f2e8d0' })
        character.profileBoxes?.forEach(box => {
          addComp('heading', { content: box.title, fontSize: 20, textColor: '#d4b878' })
          box.fields?.forEach(f => {
            addComp('text', { content: `${f.label}: ${f.value}`, fontSize: 14, textColor: '#f2e8d0' })
          })
        })
        break
      }
      case 'materials': {
        const { materials } = content
        addComp('heading', { content: materials.officialTitle || '官方原画', fontSize: 28, textColor: '#d4b878' })
        materials.official?.forEach(m => {
          addComp('text', { content: `【${m.tag}】${m.title}`, fontSize: 15, textColor: '#f2e8d0' })
          if (m.image) addComp('image', { src: m.image, alt: m.title })
        })
        break
      }
      case 'collaboration': {
        const { collaboration } = content
        addComp('heading', { content: collaboration.storesTitle || '联名合作', fontSize: 28, textColor: '#d4b878' })
        collaboration.stores?.forEach(s => {
          addComp('text', { content: `📍 ${s.name} | ${s.city} | ${s.time}`, fontSize: 14, textColor: '#f2e8d0' })
        })
        break
      }
      case 'chronicle': {
        const { chronicle } = content
        addComp('heading', { content: chronicle.timelineTitle || '编年史', fontSize: 28, textColor: '#d4b878' })
        chronicle.events?.forEach(e => {
          addComp('text', { content: `【${e.date}】${e.title}`, fontSize: 15, textColor: '#f2e8d0' })
          addComp('text', { content: e.desc, fontSize: 13, textColor: 'rgba(242,232,208,0.7)' })
          if (e.image) addComp('image', { src: e.image, alt: e.title })
          addComp('divider', {})
        })
        break
      }
      case 'supportRecord': {
        const { supportRecord } = content
        addComp('heading', { content: supportRecord.pageTitle || '应援记录', fontSize: 28, textColor: '#d4b878' })
        supportRecord.records?.forEach(r => {
          addComp('text', { content: `📅 ${r.date} | ${r.location}`, fontSize: 14, textColor: '#f2e8d0' })
          addComp('heading', { content: r.title, fontSize: 18, textColor: '#f2e8d0' })
          addComp('text', { content: r.desc, fontSize: 14, textColor: 'rgba(242,232,208,0.8)' })
          if (r.image) addComp('image', { src: r.image, alt: r.title })
          addComp('divider', {})
        })
        break
      }
      case 'blessings': {
        const { blessings } = content
        addComp('heading', { content: blessings.pageTitle || '祝福区', fontSize: 28, textColor: '#d4b878' })
        addComp('text', { content: blessings.subtitle || '写下你的祝福', fontSize: 16, textColor: '#f2e8d0' })
        break
      }
      default:
        break
    }

    if (newComponents.length > 0) {
      setComponents([...components, ...newComponents])
      setSaveStatus('unsaved')
      setShowImport(false)
    }
  }

  // 选中的组件
  const selectedComponent = components.find(comp => comp.id === selectedId) || null

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId && !e.metaKey && !e.ctrlKey) {
          e.preventDefault()
          handleDelete(selectedId)
        }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        handleDuplicate()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedId])

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* 预览模式顶部栏 */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <button
            onClick={() => setShowPreview(false)}
            className="text-yellow-400 hover:text-yellow-300"
          >
            ← 返回编辑
          </button>
          <span className="text-white font-medium">预览: {pageName}</span>
          <div className="w-24" />
        </div>
        
        {/* 预览内容 */}
        <div className="max-w-6xl mx-auto bg-gray-800 min-h-screen p-6">
          {components.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              暂无内容
            </div>
          ) : (
            components.map(comp => (
              <div key={comp.id}>
                {/* 根据组件类型渲染 */}
                {comp.type === 'heading' && (
                  <div 
                    className={`p-${comp.padding || 4} text-${comp.alignment || 'left'}`}
                    style={{ color: comp.textColor }}
                  >
                    <h2 style={{ fontSize: `${(comp.fontSize || 32) / 16}rem`, fontWeight: 'bold' }}>
                      {comp.content || '标题文字'}
                    </h2>
                  </div>
                )}
                
                {comp.type === 'text' && (
                  <div 
                    className={`p-${comp.padding || 4} text-${comp.alignment || 'left'}`}
                    style={{ color: comp.textColor }}
                  >
                    <p style={{ fontSize: `${(comp.fontSize || 16) / 16}rem` }}>
                      {comp.content || '正文内容'}
                    </p>
                  </div>
                )}
                
                {comp.type === 'image' && (
                  <div className={`p-${comp.padding || 4} flex justify-${comp.alignment || 'center'}`}>
                    <img 
                      src={comp.src || 'https://via.placeholder.com/800x400'} 
                      alt={comp.alt || '图片'} 
                      className="max-w-full h-auto rounded"
                    />
                  </div>
                )}
                
                {comp.type === 'button' && (
                  <div className={`p-${comp.padding || 4} flex justify-${comp.alignment || 'center'}`}>
                    <a
                      href={comp.buttonLink || '#'}
                      className="inline-block px-6 py-3 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: comp.backgroundColor || '#f59e0b',
                        color: comp.textColor || '#000000',
                      }}
                    >
                      {comp.buttonText || '点击按钮'}
                    </a>
                  </div>
                )}
                
                {comp.type === 'divider' && (
                  <div className={`p-${comp.padding || 2}`}>
                    <hr className="border-t border-gray-600" />
                  </div>
                )}
                
                {comp.type === 'spacer' && (
                  <div style={{ height: `${(comp.padding || 32) * 4}px` }} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* 顶部工具栏 */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white"
          >
            ← 返回
          </button>
          <h2 className="text-xl font-bold text-white">{pageName} - 页面构建器</h2>
        </div>
        
      <div className="flex items-center gap-2">
        <span className={`text-sm ${
          saveStatus === 'saved' ? 'text-green-400' :
          saveStatus === 'saving' ? 'text-yellow-400' :
          'text-red-400'
        }`}>
          {saveStatus === 'saved' ? '✅ 已保存' :
           saveStatus === 'saving' ? '💾 保存中...' :
           '⚠️ 未保存'}
        </span>
        
        <button
          onClick={() => setShowHelp(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          ❓ 使用说明
        </button>

        {/* 导入板块按钮 */}
        <button
          onClick={() => setShowImport(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
        >
          📥 导入板块内容
        </button>
        
        <button
          onClick={() => setShowPreview(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          👁️ 预览
        </button>
          
          <button
            onClick={handleClear}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            🗑️ 清空
          </button>
          
          <button
            onClick={handleSave}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold text-sm"
          >
            💾 保存
          </button>
        </div>
      </div>
      
      {/* 使用说明模态框 */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-400">📖 页面构建器使用说明</h3>
              <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-white text-2xl">
                ×
              </button>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-yellow-400 font-bold mb-2">🎯 功能介绍</h4>
                <p>页面构建器是一个<strong>可视化拖拽编辑工具</strong>，让你可以像搭积木一样创建自定义页面内容。</p>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-yellow-400 font-bold mb-2">🚀 快速开始</h4>
                <ol className="list-decimal list-inside space-y-2">
                  <li>从<strong>左侧组件库</strong>拖拽组件到中间画布</li>
                  <li>点击画布中的组件，在<strong>右侧属性面板</strong>编辑内容</li>
                  <li>点击<strong>"💾 保存"</strong>按钮保存修改</li>
                  <li>点击<strong>"👁️ 预览"</strong>查看效果</li>
                </ol>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-yellow-400 font-bold mb-2">📦 可用组件</h4>
                <ul className="space-y-1">
                  <li>📌 <strong>标题</strong>：添加页面标题</li>
                  <li>📝 <strong>正文</strong>：添加段落文字</li>
                  <li>🖼️ <strong>图片</strong>：插入图片</li>
                  <li>🔘 <strong>按钮</strong>：添加链接按钮</li>
                  <li>➖ <strong>分割线</strong>：分隔内容</li>
                  <li>📐 <strong>间距</strong>：调整空白间距</li>
                </ul>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-yellow-400 font-bold mb-2">⌨️ 快捷键</h4>
                <ul className="space-y-1">
                  <li><code className="bg-gray-600 px-2 py-1 rounded">Ctrl+S</code> 保存</li>
                  <li><code className="bg-gray-600 px-2 py-1 rounded">Ctrl+D</code> 复制选中组件</li>
                  <li><code className="bg-gray-600 px-2 py-1 rounded">Delete</code> 删除选中组件</li>
                </ul>
              </div>
              
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 p-4 rounded-lg">
                <h4 className="text-yellow-400 font-bold mb-2">💡 提示</h4>
                <ul className="space-y-1">
                  <li>✅ 所有修改会自动保存到浏览器本地</li>
                  <li>✅ 保存后，点击导航栏的"自定义页面"即可查看</li>
                  <li>✅ 可以随时返回修改，不会丢失数据</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowHelp(false)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold"
              >
                明白了，开始使用！
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 导入板块模态框 */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-purple-400">📥 导入现有板块内容</h3>
              <button onClick={() => setShowImport(false)} className="text-gray-400 hover:text-white text-2xl">
                ×
              </button>
            </div>
            
            <p className="text-gray-300 mb-4 text-sm">
              选择要导入的板块，该板块的内容将被转换为组件并添加到画布中。
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => handleImportSection('home')}
                className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-3"
              >
                <span className="text-2xl">◈</span>
                <div>
                  <div className="font-bold">首页</div>
                  <div className="text-xs text-gray-400">导入首页的关于内容、更新动态</div>
                </div>
              </button>

              <button
                onClick={() => handleImportSection('character')}
                className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-3"
              >
                <span className="text-2xl">◆</span>
                <div>
                  <div className="font-bold">角色设定</div>
                  <div className="text-xs text-gray-400">导入角色介绍、设定框信息</div>
                </div>
              </button>

              <button
                onClick={() => handleImportSection('materials')}
                className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-3"
              >
                <span className="text-2xl">◇</span>
                <div>
                  <div className="font-bold">角色物料</div>
                  <div className="text-xs text-gray-400">导入官方原画、物料整理列表</div>
                </div>
              </button>

              <button
                onClick={() => handleImportSection('collaboration')}
                className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-3"
              >
                <span className="text-2xl">★</span>
                <div>
                  <div className="font-bold">官方联动</div>
                  <div className="text-xs text-gray-400">导入联名门店、周边图鉴</div>
                </div>
              </button>

              <button
                onClick={() => handleImportSection('chronicle')}
                className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-3"
              >
                <span className="text-2xl">◈</span>
                <div>
                  <div className="font-bold">编年史</div>
                  <div className="text-xs text-gray-400">导入时间轴事件列表</div>
                </div>
              </button>

              <button
                onClick={() => handleImportSection('supportRecord')}
                className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-3"
              >
                <span className="text-2xl">📼</span>
                <div>
                  <div className="font-bold">应援记录</div>
                  <div className="text-xs text-gray-400">导入应援记录列表</div>
                </div>
              </button>

              <button
                onClick={() => handleImportSection('blessings')}
                className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-3"
              >
                <span className="text-2xl">♥</span>
                <div>
                  <div className="font-bold">祝福区</div>
                  <div className="text-xs text-gray-400">导入祝福区标题和副标题</div>
                </div>
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowImport(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 主体三栏布局 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：组件库 */}
        <ComponentLibrary onDragStart={() => {}} />
        
        {/* 中间：编辑画布 */}
        <EditorCanvas
          components={components}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
        
        {/* 右侧：属性面板 */}
        <PropertiesPanel
          component={selectedComponent}
          onUpdate={(props) => selectedId && handleUpdate(selectedId, props)}
          onDelete={() => selectedId && handleDelete(selectedId)}
          onDuplicate={handleDuplicate}
        />
      </div>
      
      {/* 底部状态栏 */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
        <div>
          组件数: {components.length} | 
          快捷键: Ctrl+S 保存 | Ctrl+D 复制 | Delete 删除
        </div>
        <div>
          💡 提示: 从左侧拖拽组件到中间画布
        </div>
      </div>
    </div>
  )
}
