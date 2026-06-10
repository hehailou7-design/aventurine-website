import { useState, useRef, useEffect } from 'react'

interface ImageCropperProps {
  onCropComplete?: (dataUrl: string) => void
  aspectRatio?: number
  defaultImage?: string
  value?: string
  onChange?: (v: string) => void
  label?: string
  children?: React.ReactNode
}

export default function ImageCropper({ onCropComplete, onChange, aspectRatio = 1, defaultImage, value, label, children }: ImageCropperProps) {
  const [image, setImage] = useState<string>(value || defaultImage || '')

  // Sync external value changes
  useEffect(() => {
    if (value !== undefined && value !== image) {
      setImage(value)
    }
  }, [value])
  const [isOpen, setIsOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setImage(dataUrl)
      setIsOpen(true)

      // Auto crop
      const img = new Image()
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current
          const size = Math.min(img.width, img.height)
          canvas.width = size
          canvas.height = size
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size)
            const cropped = canvas.toDataURL('image/jpeg', 0.9)
            onCropComplete?.(cropped)
            onChange?.(cropped)
          }
        }
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  const handleUrlSubmit = () => {
    if (image) {
      onCropComplete?.(image)
      onChange?.(image)
    }
  }

  return (
    <div>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="输入图片URL或选择本地文件"
        style={{
          width: '100%', padding: '8px 12px', background: '#121212',
          border: '1px solid rgba(212,184,120,0.2)', borderRadius: '8px',
          color: '#f8f6f0', fontSize: '12px', outline: 'none',
          marginBottom: '8px',
        }}
      />
      <div style={{ display: 'flex', gap: '8px' }}>
        <label style={{
          padding: '6px 14px', background: 'rgba(212,184,120,0.1)',
          border: '1px solid rgba(212,184,120,0.2)', borderRadius: '8px',
          color: '#d4b878', fontSize: '12px', cursor: 'pointer',
        }}>
          📁 本地上传
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </label>
        <button
          onClick={handleUrlSubmit}
          style={{
            padding: '6px 14px', background: 'rgba(156,186,138,0.1)',
            border: '1px solid rgba(156,186,138,0.2)', borderRadius: '8px',
            color: '#9cba8a', fontSize: '12px', cursor: 'pointer',
          }}
        >
          ✓ 确认URL
        </button>
      </div>

      {image && isOpen && (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <img
            src={image}
            alt="Preview"
            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '1px solid rgba(212,184,120,0.2)' }}
          />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {children}
    </div>
  )
}
