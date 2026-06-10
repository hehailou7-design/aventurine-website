// 页面构建器组件类型定义

export interface ComponentProps {
  // 通用属性
  id: string
  type: ComponentType
  order: number
  
  // 样式属性
  backgroundColor?: string
  textColor?: string
  padding?: number
  margin?: number
  borderRadius?: number
  width?: 'full' | 'auto' | number
  alignment?: 'left' | 'center' | 'right'
  
  // 内容属性（根据类型不同）
  content?: string
  fontSize?: number
  fontWeight?: 'normal' | 'bold' | 'semibold'
  
  // 图片属性
  src?: string
  alt?: string
  imageWidth?: number
  imageHeight?: number
  
  // 按钮属性
  buttonText?: string
  buttonLink?: string
  buttonStyle?: 'primary' | 'secondary' | 'outline'
  
  // 视频属性
  videoUrl?: string
  
  // 卡片属性
  title?: string
  description?: string
  imageUrl?: string
}

export type ComponentType = 
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'video'
  | 'card'
  | 'columns'

export interface PageBuilderData {
  pageId: string
  pageName: string
  components: ComponentProps[]
}

export const DEFAULT_COMPONENT_PROPS: Record<ComponentType, Partial<ComponentProps>> = {
  heading: {
    content: '标题文字',
    fontSize: 32,
    fontWeight: 'bold',
    textColor: '#ffffff',
    padding: 16,
    alignment: 'left',
  },
  text: {
    content: '这里是正文内容。你可以编辑这段文字，添加更多信息。',
    fontSize: 16,
    textColor: '#ffffff',
    padding: 16,
    alignment: 'left',
  },
  image: {
    src: 'https://via.placeholder.com/800x400',
    alt: '图片描述',
    imageWidth: 100,
    imageHeight: 100,
    alignment: 'center',
    padding: 16,
  },
  button: {
    buttonText: '点击按钮',
    buttonLink: '#',
    buttonStyle: 'primary',
    backgroundColor: '#f59e0b',
    textColor: '#000000',
    padding: 16,
    alignment: 'center',
  },
  divider: {
    backgroundColor: '#374151',
    padding: 8,
  },
  spacer: {
    padding: 32,
  },
  video: {
    videoUrl: '',
    alignment: 'center',
    padding: 16,
  },
  card: {
    title: '卡片标题',
    description: '卡片描述文字',
    imageUrl: 'https://via.placeholder.com/400x300',
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
  },
  columns: {
    backgroundColor: 'transparent',
    padding: 16,
  },
}

export const COMPONENT_NAMES: Record<ComponentType, string> = {
  heading: '📝 标题',
  text: '📄 正文',
  image: '🖼️ 图片',
  button: '🔘 按钮',
  divider: '➖ 分割线',
  spacer: '📏 间距',
  video: '🎬 视频',
  card: '🃏 卡片',
  columns: '📐 分栏',
}

export const COMPONENT_DESCRIPTIONS: Record<ComponentType, string> = {
  heading: '添加标题文字',
  text: '添加正文段落',
  image: '添加图片',
  button: '添加可点击按钮',
  divider: '添加分割线',
  spacer: '添加空白间距',
  video: '添加视频嵌入',
  card: '添加卡片组件',
  columns: '添加多栏布局',
}
