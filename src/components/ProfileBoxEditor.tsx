import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import ImagePicker from './ImagePicker'

interface ProfileBoxEditorProps {
  onUpdate: (path: string, v: unknown) => void
}

type FieldType = 'text' | 'image'

export default function ProfileBoxEditor({ onUpdate }: ProfileBoxEditorProps) {
  const { content, updateContent } = useContent()
  const profileBoxes = content.character.profileBoxes || []
  const [expandedBox, setExpandedBox] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<{ boxId: string; fieldId: string } | null>(null)
  const [addingFieldType, setAddingFieldType] = useState<FieldType>('text')

  const updateProfileBoxes = (next: any[]) => {
    updateContent('character.profileBoxes', next)
  }

  // 添加新设定框
  const addBox = () => {
    const newBox = {
      id: `box_${Date.now()}`,
      title: '新设定框',
      fields: [],
      layout: 'list',
      background: 'rgba(212,184,120,0.05)',
      border: '1px solid rgba(212,184,120,0.15)',
      borderRadius: 10,
      titleColor: '#d4b878',
      titleFontSize: 12,
    }
    updateProfileBoxes([...profileBoxes, newBox])
    setExpandedBox(newBox.id)
  }

  // 删除设定框
  const deleteBox = (boxId: string) => {
    if (!confirm('确定要删除这个设定框吗？')) return
    updateProfileBoxes(profileBoxes.filter((b: any) => b.id !== boxId))
    if (expandedBox === boxId) setExpandedBox(null)
  }

  // 更新设定框属性
  const updateBox = (boxId: string, field: string, value: any) => {
    const next = profileBoxes.map((b: any) =>
      b.id === boxId ? { ...b, [field]: value } : b
    )
    updateProfileBoxes(next)
  }

  // 添加字段
  const addField = (boxId: string) => {
    const newField: any = {
      id: `field_${Date.now()}`,
      label: addingFieldType === 'image' ? '图片' : '新字段',
      value: '',
      type: addingFieldType,
      labelColor: 'rgba(242,232,208,0.9)',
      valueColor: 'rgba(242,232,208,0.9)',
      fontSize: 13,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
    }
    if (addingFieldType === 'image') {
      newField.image = ''
    }
    const next = profileBoxes.map((b: any) =>
      b.id === boxId ? { ...b, fields: [...(b.fields || []), newField] } : b
    )
    updateProfileBoxes(next)
  }

  // 删除字段
  const deleteField = (boxId: string, fieldId: string) => {
    const next = profileBoxes.map((b: any) =>
      b.id === boxId ? { ...b, fields: (b.fields || []).filter((f: any) => f.id !== fieldId) } : b
    )
    updateProfileBoxes(next)
    if (editingField?.boxId === boxId && editingField?.fieldId === fieldId) {
      setEditingField(null)
    }
  }

  // 更新字段属性
  const updateField = (boxId: string, fieldId: string, field: string, value: any) => {
    const next = profileBoxes.map((b: any) =>
      b.id === boxId ? {
        ...b,
        fields: (b.fields || []).map((f: any) =>
          f.id === fieldId ? { ...f, [field]: value } : f
        )
      } : b
    )
    updateProfileBoxes(next)
  }

  // 更新字段图片
  const updateFieldImage = (boxId: string, fieldId: string, imageUrl: string) => {
    updateField(boxId, fieldId, 'image', imageUrl)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: '#d4b878', fontSize: '14px', margin: 0 }}>角色设定框管理</h3>
        <button
          onClick={addBox}
          style={{
            background: 'rgba(212,184,120,0.15)',
            border: '1px solid rgba(212,184,120,0.3)',
            color: '#d4b878',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          ＋ 添加设定框
        </button>
      </div>

      <p style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginBottom: '20px' }}>
        在这里管理角色设定框。可以添加/删除设定框，编辑字段内容和样式，支持文本和图片字段。
      </p>

      {profileBoxes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(248,246,240,0.3)', fontSize: '13px' }}>
          暂无设定框，点击"添加设定框"创建第一个。
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {profileBoxes.map((box: any) => (
          <div
            key={box.id}
            style={{
              background: 'rgba(212,184,120,0.03)',
              border: `1px solid ${expandedBox === box.id ? 'rgba(212,184,120,0.4)' : 'rgba(212,184,120,0.15)'}`,
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {/* 设定框头部 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                cursor: 'pointer',
                background: expandedBox === box.id ? 'rgba(212,184,120,0.08)' : 'transparent',
              }}
              onClick={() => setExpandedBox(expandedBox === box.id ? null : box.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#d4b878', fontSize: '16px' }}>
                  {expandedBox === box.id ? '▼' : '▶'}
                </span>
                <span style={{ color: '#f2e8d0', fontSize: '13px', fontWeight: 600 }}>
                  {box.title || '未命名设定框'}
                </span>
                <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>
                  ({box.fields?.length || 0} 个字段 · {box.layout === 'grid' ? '网格' : '列表'}布局)
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteBox(box.id) }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,100,100,0.3)',
                  color: '#e07070',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                删除
              </button>
            </div>

            {/* 展开的编辑区域 */}
            {expandedBox === box.id && (
              <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(212,184,120,0.1)' }}>
                  {/* 设定框属性编辑 */}
                  <div style={{ padding: '16px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      {/* 标题 */}
                      <div>
                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '4px' }}>标题</label>
                        <input
                          type="text"
                          value={box.title || ''}
                          onChange={(e) => updateBox(box.id, 'title', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: '#121212',
                            border: '1px solid rgba(212,184,120,0.3)',
                            borderRadius: '6px',
                            color: '#f2e8d0',
                            fontSize: '12px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      {/* 布局 */}
                      <div>
                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '4px' }}>布局</label>
                        <select
                          value={box.layout || 'list'}
                          onChange={(e) => updateBox(box.id, 'layout', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: '#121212',
                            border: '1px solid rgba(212,184,120,0.3)',
                            borderRadius: '6px',
                            color: '#f2e8d0',
                            fontSize: '12px',
                          }}
                        >
                          <option value="list">列表</option>
                          <option value="grid">网格</option>
                        </select>
                      </div>

                      {/* 标题颜色 */}
                      <div>
                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '4px' }}>标题颜色</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="color"
                            value={box.titleColor || '#d4b878'}
                            onChange={(e) => updateBox(box.id, 'titleColor', e.target.value)}
                            style={{ width: '32px', height: '28px', padding: 0, border: '1px solid rgba(212,184,120,0.3)', borderRadius: '4px', cursor: 'pointer' }}
                          />
                          <input
                            type="text"
                            value={box.titleColor || '#d4b878'}
                            onChange={(e) => updateBox(box.id, 'titleColor', e.target.value)}
                            style={{
                              flex: 1,
                              padding: '6px 10px',
                              background: '#121212',
                              border: '1px solid rgba(212,184,120,0.3)',
                              borderRadius: '6px',
                              color: '#f2e8d0',
                              fontSize: '12px',
                            }}
                          />
                        </div>
                      </div>

                      {/* 标题字体大小 */}
                      <div>
                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '4px' }}>标题字体大小</label>
                        <input
                          type="number"
                          min={10}
                          max={24}
                          value={box.titleFontSize || 12}
                          onChange={(e) => updateBox(box.id, 'titleFontSize', +e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: '#121212',
                            border: '1px solid rgba(212,184,120,0.3)',
                            borderRadius: '6px',
                            color: '#f2e8d0',
                            fontSize: '12px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      {/* 背景色 */}
                      <div>
                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '4px' }}>背景</label>
                        <input
                          type="text"
                          value={box.background || ''}
                          onChange={(e) => updateBox(box.id, 'background', e.target.value)}
                          placeholder="rgba(212,184,120,0.05)"
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: '#121212',
                            border: '1px solid rgba(212,184,120,0.3)',
                            borderRadius: '6px',
                            color: '#f2e8d0',
                            fontSize: '12px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      {/* 边框圆角 */}
                      <div>
                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '4px' }}>边框圆角</label>
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={box.borderRadius || 10}
                          onChange={(e) => updateBox(box.id, 'borderRadius', +e.target.value)}
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            background: '#121212',
                            border: '1px solid rgba(212,184,120,0.3)',
                            borderRadius: '6px',
                            color: '#f2e8d0',
                            fontSize: '12px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>

                    {/* 字段列表 */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: '#d4b878', fontSize: '12px', fontWeight: 600 }}>字段列表</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <select
                            value={addingFieldType}
                            onChange={(e) => setAddingFieldType(e.target.value as FieldType)}
                            style={{
                              padding: '4px 8px',
                              background: '#121212',
                              border: '1px solid rgba(212,184,120,0.2)',
                              borderRadius: '4px',
                              color: '#f2e8d0',
                              fontSize: '11px',
                            }}
                          >
                            <option value="text">文本字段</option>
                            <option value="image">图片字段</option>
                          </select>
                          <button
                            onClick={() => addField(box.id)}
                            style={{
                              background: 'rgba(212,184,120,0.1)',
                              border: '1px solid rgba(212,184,120,0.2)',
                              color: '#d4b878',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px',
                            }}
                          >
                            ＋ 添加字段
                          </button>
                        </div>
                      </div>

                      {(box.fields || []).length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(248,246,240,0.3)', fontSize: '12px' }}>
                          暂无字段，点击"添加字段"创建第一个。
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(box.fields || []).map((field: any, fi: number) => (
                          <div
                            key={field.id}
                            style={{
                              background: editingField?.boxId === box.id && editingField?.fieldId === field.id
                                ? 'rgba(212,184,120,0.1)'
                                : 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(212,184,120,0.1)',
                              borderRadius: '8px',
                              padding: '10px 12px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px' }}>字段 {fi + 1} ({field.type === 'image' ? '图片' : '文本'})</span>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => setEditingField(
                                    editingField?.boxId === box.id && editingField?.fieldId === field.id
                                      ? null
                                      : { boxId: box.id, fieldId: field.id }
                                  )}
                                  style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(212,184,120,0.2)',
                                    color: '#d4b878',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '10px',
                                  }}
                                >
                                  {editingField?.boxId === box.id && editingField?.fieldId === field.id ? '完成' : '编辑'}
                                </button>
                                <button
                                  onClick={() => deleteField(box.id, field.id)}
                                  style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(255,100,100,0.2)',
                                    color: '#e07070',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '10px',
                                  }}
                                >
                                  删除
                                </button>
                              </div>
                            </div>

                            {/* 字段编辑表单 */}
                            {editingField?.boxId === box.id && editingField?.fieldId === field.id ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {field.type === 'image' ? (
                                  /* 图片字段编辑 */
                                  <div>
                                    <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>图片</label>
                                    <ImagePicker
                                      value={field.image || ''}
                                      onChange={(v: string) => updateFieldImage(box.id, field.id, v)}
                                    />
                                  </div>
                                ) : (
                                  /* 文本字段编辑 */
                                  <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                      <div>
                                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>标签</label>
                                        <input
                                          type="text"
                                          value={field.label || ''}
                                          onChange={(e) => updateField(box.id, field.id, 'label', e.target.value)}
                                          style={{
                                            width: '100%',
                                            padding: '5px 8px',
                                            background: '#121212',
                                            border: '1px solid rgba(212,184,120,0.2)',
                                            borderRadius: '4px',
                                            color: '#f2e8d0',
                                            fontSize: '11px',
                                            boxSizing: 'border-box',
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>值</label>
                                        <input
                                          type="text"
                                          value={field.value || ''}
                                          onChange={(e) => updateField(box.id, field.id, 'value', e.target.value)}
                                          style={{
                                            width: '100%',
                                            padding: '5px 8px',
                                            background: '#121212',
                                            border: '1px solid rgba(212,184,120,0.2)',
                                            borderRadius: '4px',
                                            color: '#f2e8d0',
                                            fontSize: '11px',
                                            boxSizing: 'border-box',
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>标签颜色</label>
                                        <input
                                          type="color"
                                          value={field.labelColor || '#f2e8d0'}
                                          onChange={(e) => updateField(box.id, field.id, 'labelColor', e.target.value)}
                                          style={{ width: '32px', height: '28px', padding: 0, border: '1px solid rgba(212,184,120,0.2)', borderRadius: '4px', cursor: 'pointer' }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>值颜色</label>
                                        <input
                                          type="color"
                                          value={field.valueColor || '#f2e8d0'}
                                          onChange={(e) => updateField(box.id, field.id, 'valueColor', e.target.value)}
                                          style={{ width: '32px', height: '28px', padding: 0, border: '1px solid rgba(212,184,120,0.2)', borderRadius: '4px', cursor: 'pointer' }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>字体大小</label>
                                        <input
                                          type="number"
                                          min={10}
                                          max={24}
                                          value={field.fontSize || 13}
                                          onChange={(e) => updateField(box.id, field.id, 'fontSize', +e.target.value)}
                                          style={{
                                            width: '100%',
                                            padding: '5px 8px',
                                            background: '#121212',
                                            border: '1px solid rgba(212,184,120,0.2)',
                                            borderRadius: '4px',
                                            color: '#f2e8d0',
                                            fontSize: '11px',
                                            boxSizing: 'border-box',
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>字体粗细</label>
                                        <select
                                          value={field.fontWeight || 'normal'}
                                          onChange={(e) => updateField(box.id, field.id, 'fontWeight', e.target.value)}
                                          style={{
                                            width: '100%',
                                            padding: '5px 8px',
                                            background: '#121212',
                                            border: '1px solid rgba(212,184,120,0.2)',
                                            borderRadius: '4px',
                                            color: '#f2e8d0',
                                            fontSize: '11px',
                                          }}
                                        >
                                          <option value="normal">正常</option>
                                          <option value="bold">粗体</option>
                                          <option value="600">半粗</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>字体样式</label>
                                        <select
                                          value={field.fontStyle || 'normal'}
                                          onChange={(e) => updateField(box.id, field.id, 'fontStyle', e.target.value)}
                                          style={{
                                            width: '100%',
                                            padding: '5px 8px',
                                            background: '#121212',
                                            border: '1px solid rgba(212,184,120,0.2)',
                                            borderRadius: '4px',
                                            color: '#f2e8d0',
                                            fontSize: '11px',
                                          }}
                                        >
                                          <option value="normal">正常</option>
                                          <option value="italic">斜体</option>
                                        </select>
                                      </div>
                                      <div>
                                        <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>对齐方式</label>
                                        <select
                                          value={field.textAlign || 'left'}
                                          onChange={(e) => updateField(box.id, field.id, 'textAlign', e.target.value)}
                                          style={{
                                            width: '100%',
                                            padding: '5px 8px',
                                            background: '#121212',
                                            border: '1px solid rgba(212,184,120,0.2)',
                                            borderRadius: '4px',
                                            color: '#f2e8d0',
                                            fontSize: '11px',
                                          }}
                                        >
                                          <option value="left">左对齐</option>
                                          <option value="center">居中</option>
                                          <option value="right">右对齐</option>
                                        </select>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              /* 字段简略显示 */
                              <div>
                                {field.type === 'image' ? (
                                  <div>
                                    <span style={{ color: field.labelColor || 'rgba(248,246,240,0.5)', fontSize: '11px' }}>{field.label}：</span>
                                    {field.image && (
                                      <img src={field.image} alt={field.label} style={{ maxWidth: '100%', maxHeight: '120px', marginTop: '6px', borderRadius: '4px' }} />
                                    )}
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ color: field.labelColor || 'rgba(248,246,240,0.5)', fontSize: `${field.fontSize || 13}px`, fontWeight: field.fontWeight || 'normal', fontStyle: field.fontStyle || 'normal' }}>{field.label}：</span>
                                    <span style={{ color: field.valueColor || 'rgba(248,246,240,0.8)', fontSize: `${field.fontSize || 13}px`, fontWeight: field.fontWeight || 'normal', fontStyle: field.fontStyle || 'normal' }}>{field.value}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
