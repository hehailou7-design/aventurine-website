import { useState } from 'react'

interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImagePicker({ value, onChange, label = '图片' }: ImagePickerProps) {
  const [previewUrl, setPreviewUrl] = useState(value)
  const [showPreview, setShowPreview] = useState(!!value)

  const handleUrlChange = (url: string) => {
    onChange(url)
    setPreviewUrl(url)
  }

  const handlePreview = () => {
    if (previewUrl) {
      setShowPreview(!showPreview)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Check file size (limit to 500KB for localStorage)
    if (file.size > 500 * 1024) {
      alert('图片大小不能超过 500KB，请压缩后重试')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      onChange(base64)
      setPreviewUrl(base64)
      setShowPreview(true)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ marginBottom: '8px' }}>
      {label && (
        <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '4px' }}>{label}</div>
      )}
      
      {/* URL输入 */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
        <input
          type="text"
          value={value}
          onChange={e => handleUrlChange(e.target.value)}
          placeholder="输入图片URL，或上传本地图片"
          style={{
            flex: 1,
            background: '#121212',
            border: '1px solid rgba(212,184,120,0.3)',
            borderRadius: '6px',
            padding: '6px 10px',
            color: '#f2e8d0',
            fontSize: '12px',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="button"
          onClick={handlePreview}
          disabled={!previewUrl}
          style={{
            background: previewUrl ? 'rgba(212,184,120,0.15)' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(212,184,120,0.3)',
            borderRadius: '4px',
            color: previewUrl ? '#d4b878' : 'rgba(248,246,240,0.3)',
            fontSize: '11px',
            padding: '4px 8px',
            cursor: previewUrl ? 'pointer' : 'default',
          }}
        >
          预览
        </button>
      </div>

      {/* 本地上传 */}
      <div style={{ marginBottom: '6px' }}>
        <label style={{
          display: 'inline-block',
          background: 'rgba(212,184,120,0.1)',
          border: '1px solid rgba(212,184,120,0.2)',
          borderRadius: '4px',
          color: '#d4b878',
          fontSize: '11px',
          padding: '4px 10px',
          cursor: 'pointer',
        }}>
          上传图片
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
        <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '10px', marginLeft: '8px' }}>
          限制500KB（localStorage）
        </span>
      </div>

      {/* 图片预览 */}
      {showPreview && previewUrl && (
        <div style={{
          marginTop: '6px',
          padding: '8px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '6px',
          border: '1px solid rgba(212,184,120,0.1)',
        }}>
          <img
            src={previewUrl}
            alt="预览"
            style={{
              maxWidth: '100%',
              maxHeight: '200px',
              borderRadius: '4px',
              display: 'block',
              margin: '0 auto',
            }}
            onError={() => {
              // If image fails to load, hide preview
              setShowPreview(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
