import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

// ============ 皮肤定义 ============
export interface SkinTheme {
  id: string
  name: string
  nameEn: string
  nameJp: string
  nameKr: string
  // 颜色
  primary: string
  secondary: string
  background: string
  backgroundGradient: string
  text: string
  textSecondary: string
  border: string
  cardBg: string
  cardBorder: string
  // 特效
  effect?: 'sakura' | 'snow' | 'none'
  // 装饰
  decorations?: string[]
}

const SKINS: Record<string, SkinTheme> = {
  original: {
    id: 'original',
    name: '原皮',
    nameEn: 'Original',
    nameJp: 'オリジナル',
    nameKr: '오리지널',
    primary: '#d4b878',
    secondary: '#b0a0d8',
    background: '#0e0e0e',
    backgroundGradient: 'linear-gradient(135deg, #0e0e0e 0%, #1a1a1a 100%)',
    text: '#f2e8d0',
    textSecondary: 'rgba(248,246,240,0.5)',
    border: 'rgba(212,184,120,0.2)',
    cardBg: 'rgba(26,26,26,0.8)',
    cardBorder: 'rgba(212,184,120,0.2)',
    effect: 'none',
  },
  
  sakura: {
    id: 'sakura',
    name: '樱花粉',
    nameEn: 'Sakura Pink',
    nameJp: '桜ピンク',
    nameKr: '벚꽃 핑크',
    primary: '#ffb7c5',
    secondary: '#ff8fad',
    background: '#1a0e14',
    backgroundGradient: 'linear-gradient(135deg, #1a0e14 0%, #2d1a24 50%, #1a0e14 100%)',
    text: '#ffe4ec',
    textSecondary: 'rgba(255,183,197,0.6)',
    border: 'rgba(255,183,197,0.3)',
    cardBg: 'rgba(45,26,36,0.8)',
    cardBorder: 'rgba(255,183,197,0.3)',
    effect: 'sakura',
    decorations: ['sakura-petals'],
  },
  
  mintChocolate: {
    id: 'mintChocolate',
    name: '薄荷巧克力',
    nameEn: 'Mint Chocolate',
    nameJp: 'ミントチョコレート',
    nameKr: '민트 초콜릿',
    primary: '#7ecba1',
    secondary: '#8b6f47',
    background: '#0e1a14',
    backgroundGradient: 'linear-gradient(135deg, #0e1a14 0%, #1a2d1e 50%, #0e1a14 100%)',
    text: '#e0f2e9',
    textSecondary: 'rgba(126,203,161,0.6)',
    border: 'rgba(126,203,161,0.3)',
    cardBg: 'rgba(26,45,30,0.8)',
    cardBorder: 'rgba(126,203,161,0.3)',
    effect: 'none',
    decorations: ['mint-leaves', 'chocolate-chips'],
  },
  
  whiteLace: {
    id: 'whiteLace',
    name: '白色',
    nameEn: 'Pure White',
    nameJp: 'ピュアホワイト',
    nameKr: '퓨어 화이트',
    primary: '#e8d0f2',
    secondary: '#b0a0d8',
    background: '#f5f5f5',
    backgroundGradient: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #f5f5f5 100%)',
    text: '#333333',
    textSecondary: 'rgba(51,51,51,0.6)',
    border: 'rgba(232,208,242,0.3)',
    cardBg: 'rgba(255,255,255,0.9)',
    cardBorder: 'rgba(232,208,242,0.3)',
    effect: 'none',
    decorations: ['bow', 'lace'],
  },
}

// ============ Context ============
interface SkinContextType {
  currentSkin: SkinTheme
  skinId: string
  setSkinId: (id: string) => void
  skins: SkinTheme[]
}

const SkinContext = createContext<SkinContextType>({
  currentSkin: SKINS.original,
  skinId: 'original',
  setSkinId: () => {},
  skins: Object.values(SKINS),
})

export function SkinProvider({ children }: { children: ReactNode }) {
  const [skinId, setSkinId] = useState('original')
  
  useEffect(() => {
    const saved = localStorage.getItem('aventurine_skin')
    if (saved && SKINS[saved]) {
      setSkinId(saved)
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem('aventurine_skin', skinId)
    applySkinToDOM(SKINS[skinId])
  }, [skinId])
  
  const applySkinToDOM = (skin: SkinTheme) => {
    const root = document.documentElement
    root.style.setProperty('--color-primary', skin.primary)
    root.style.setProperty('--color-secondary', skin.secondary)
    root.style.setProperty('--color-background', skin.background)
    root.style.setProperty('--color-text', skin.text)
    root.style.setProperty('--color-border', skin.border)
    root.style.setProperty('--color-card-bg', skin.cardBg)
    
    // 移除旧特效
    document.querySelectorAll('.skin-effect').forEach(el => el.remove())
    
    // 添加新特效
    if (skin.effect === 'sakura') {
      createSakuraEffect()
    } else if (skin.effect === 'snow') {
      createSnowEffect()
    }
    
    // 添加装饰
    if (skin.decorations?.includes('bow')) {
      createBowDecoration()
    }
    if (skin.decorations?.includes('lace')) {
      createLaceDecoration()
    }
  }
  
  return (
    <SkinContext.Provider value={{
      currentSkin: SKINS[skinId],
      skinId,
      setSkinId,
      skins: Object.values(SKINS),
    }}>
      {children}
    </SkinContext.Provider>
  )
}

export function useSkin() {
  return useContext(SkinContext)
}

// ============ 特效函数 ============
function createSakuraEffect() {
  const container = document.createElement('div')
  container.className = 'skin-effect sakura-container'
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `
  document.body.appendChild(container)
  
  for (let i = 0; i < 30; i++) {
    const petal = document.createElement('div')
    petal.style.cssText = `
      position: absolute;
      width: ${8 + Math.random() * 8}px;
      height: ${8 + Math.random() * 8}px;
      background: radial-gradient(ellipse at center, #ffb7c5 0%, #ff8fad 100%);
      border-radius: 50% 0 50% 0;
      opacity: ${0.3 + Math.random() * 0.4};
      animation: sakuraFall ${8 + Math.random() * 8}s linear infinite;
      animation-delay: ${Math.random() * 8}s;
      top: -20px;
      left: ${Math.random() * 100}vw;
    `
    container.appendChild(petal)
  }
  
  const style = document.createElement('style')
  style.textContent = `
    @keyframes sakuraFall {
      0% {
        transform: translateY(-20px) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
      }
      90% {
        opacity: 0.6;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

function createSnowEffect() {
  const container = document.createElement('div')
  container.className = 'skin-effect snow-container'
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
    overflow: hidden;
  `
  document.body.appendChild(container)
  
  for (let i = 0; i < 50; i++) {
    const flake = document.createElement('div')
    flake.style.cssText = `
      position: absolute;
      width: ${3 + Math.random() * 5}px;
      height: ${3 + Math.random() * 5}px;
      background: white;
      border-radius: 50%;
      opacity: ${0.3 + Math.random() * 0.5};
      animation: snowFall ${10 + Math.random() * 10}s linear infinite;
      animation-delay: ${Math.random() * 10}s;
      top: -10px;
      left: ${Math.random() * 100}vw;
      box-shadow: 0 0 3px rgba(255,255,255,0.8);
    `
    container.appendChild(flake)
  }
  
  const style = document.createElement('style')
  style.textContent = `
    @keyframes snowFall {
      0% {
        transform: translateY(-10px) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 0.8;
      }
      90% {
        opacity: 0.8;
      }
      100% {
        transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(style)
}

function createLaceDecoration() {
  const lace = document.createElement('div')
  lace.className = 'skin-effect lace-decoration'
  lace.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9998;
    overflow: hidden;
  `
  
  // 添加蕾丝边纹
  for (let i = 0; i < 20; i++) {
    const laceItem = document.createElement('div')
    laceItem.style.cssText = `
      position: absolute;
      width: ${20 + Math.random() * 30}px;
      height: ${20 + Math.random() * 30}px;
      background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(232,208,242,0.3) 70%, transparent 100%);
      border-radius: 50%;
      top: ${Math.random() * 100}vh;
      left: ${Math.random() * 100}vw;
      opacity: ${0.2 + Math.random() * 0.3};
      animation: laceFloat ${10 + Math.random() * 10}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `
    lace.appendChild(laceItem)
  }
  
  document.body.appendChild(lace)
  
  const style = document.createElement('style')
  style.textContent = `
    @keyframes laceFloat {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      25% {
        transform: translate(10px, -10px) rotate(5deg);
      }
      50% {
        transform: translate(-5px, 5px) rotate(-3deg);
      }
      75% {
        transform: translate(5px, 10px) rotate(3deg);
      }
    }
  `
  document.head.appendChild(style)
}

function createBowDecoration() {
  const bow = document.createElement('div')
  bow.className = 'skin-effect bow-decoration'
  bow.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 60px;
    height: 40px;
    z-index: 9998;
    pointer-events: none;
  `
  bow.innerHTML = `
    <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 20px; height: 15px; background: #e8d0f2; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
    <div style="position: absolute; top: 5px; left: 10px; width: 15px; height: 10px; background: #d4b878; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
    <div style="position: absolute; top: 5px; right: 10px; width: 15px; height: 10px; background: #d4b878; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
    <div style="position: absolute; top: 15px; left: 50%; transform: translateX(-50%); width: 8px; height: 15px; background: #e8d0f2; border-radius: 0 0 4px 4px;"></div>
  `
  document.body.appendChild(bow)
}
