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
    name: '白色雪人',
    nameEn: 'White Snow',
    nameJp: 'ホワイトスノー',
    nameKr: '화이트 스노우',
    primary: '#e8d0f2',
    secondary: '#b0a0d8',
    background: '#1a1a2e',
    backgroundGradient: 'linear-gradient(135deg, #1a1a2e 0%, #2e2e4a 50%, #1a1a2e 100%)',
    text: '#f2e8f0',
    textSecondary: 'rgba(232,208,242,0.6)',
    border: 'rgba(232,208,242,0.3)',
    cardBg: 'rgba(46,46,74,0.8)',
    cardBorder: 'rgba(232,208,242,0.3)',
    effect: 'snow',
    decorations: ['bow', 'lace', 'snowman'],
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
    if (skin.decorations?.includes('snowman')) {
      createSnowman()
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

function createSnowman() {
  const snowman = document.createElement('div')
  snowman.className = 'skin-effect snowman'
  snowman.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 80px;
    height: 120px;
    z-index: 9998;
    pointer-events: none;
  `
  snowman.innerHTML = `
    <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 50px; background: white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
    <div style="position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); width: 45px; height: 40px; background: white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
    <div style="position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%); width: 35px; height: 35px; background: white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
      <div style="position: absolute; top: 10px; left: 8px; width: 5px; height: 5px; background: #333; border-radius: 50%;"></div>
      <div style="position: absolute; top: 10px; right: 8px; width: 5px; height: 5px; background: #333; border-radius: 50%;"></div>
      <div style="position: absolute; top: 18px; left: 50%; transform: translateX(-50%); width: 8px; height: 4px; background: #ff8fad; border-radius: 50%;"></div>
    </div>
    <div style="position: absolute; bottom: 85px; left: 5px; width: 15px; height: 3px; background: #8b6f47; border-radius: 2px; transform: rotate(-30deg);"></div>
    <div style="position: absolute; bottom: 85px; right: 5px; width: 15px; height: 3px; background: #8b6f47; border-radius: 2px; transform: rotate(30deg);"></div>
  `
  document.body.appendChild(snowman)
}
