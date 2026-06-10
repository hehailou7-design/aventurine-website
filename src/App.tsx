import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CharacterPage from './pages/CharacterPage'
import MaterialsPage from './pages/MaterialsPage'
import CollaborationPage from './pages/CollaborationPage'
import ChroniclePage from './pages/ChroniclePage'
import BlackMudPage from './pages/BlackMudPage'
import SubmitPage from './pages/SubmitPage'
import BlessingsPage from './pages/BlessingsPage'
import SupportRecordPage from './pages/SupportRecordPage'
import FeedbackPage from './pages/FeedbackPage'
import SponsorshipPage from './pages/SponsorshipPage'
import CustomPage from './pages/CustomPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import ParticleBackground from './components/ParticleBackground'
import { LanguageProvider } from './context/LanguageContext'
import { ContentProvider } from './context/ContentContext'
import './index.css'

export type PageType =
  | 'home'
  | 'character'
  | 'materials'
  | 'collaboration'
  | 'chronicle'
  | 'blackmud'
  | 'submit'
  | 'supportRecord'
  | 'feedback'
  | 'sponsorship'
  | 'blessings'
  | 'custom'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [pageTransition, setPageTransition] = useState(false)

  // 页面切换动画
  useEffect(() => {
    setPageTransition(true)
    const timer = setTimeout(() => setPageTransition(false), 600)
    return () => clearTimeout(timer)
  }, [currentPage])

  // 滚动动画检测
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in')
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0
        if (isVisible) {
          el.classList.add('visible')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始检查

    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentPage]) // 页面切换时重新检测

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  // Keyboard shortcut: Ctrl+Shift+K to toggle admin
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault()
        setShowLogin(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleOpenAdmin = () => {
    setShowLogin(true)
  }

  // Login page
  if (showLogin) {
    return (
      <LanguageProvider>
        <LoginPage
          onBack={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false)
            setAdminMode(true)
          }}
        />
      </LanguageProvider>
    )
  }

  // Admin mode
  if (adminMode) {
    return (
      <ContentProvider>
        <LanguageProvider>
          <AdminPage onLogout={() => setAdminMode(false)} />
        </LanguageProvider>
      </ContentProvider>
    )
  }

  const renderPage = () => {
    const pageClass = `page-transition ${pageTransition ? 'page-exit' : ''}`
    const pageContent = (() => {
      switch (currentPage) {
        case 'home': return <HomePage onNavigate={setCurrentPage} />
        case 'character': return <CharacterPage />
        case 'materials': return <MaterialsPage />
        case 'collaboration': return <CollaborationPage />
        case 'chronicle': return <ChroniclePage />
        case 'blackmud': return <BlackMudPage />
        case 'submit': return <SubmitPage />
        case 'supportRecord': return <SupportRecordPage />
        case 'feedback': return <FeedbackPage />
        case 'sponsorship': return <SponsorshipPage />
        case 'blessings': return <BlessingsPage />
        case 'custom': return <CustomPage />
        default: return <HomePage onNavigate={setCurrentPage} />
      }
    })()

    return <div className={pageClass}>{pageContent}</div>
  }

  return (
    <ContentProvider>
      <LanguageProvider>
        <div className="min-h-screen aurora-bg text-champagne-light flex flex-col" style={{ position: 'relative' }}>
          {/* 粒子背景 */}
          <ParticleBackground />
          
          {/* 主要内容 */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Navbar
              currentPage={currentPage}
              onNavigate={setCurrentPage}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              onOpenAdmin={handleOpenAdmin}
            />
            <main className="flex-1 pt-16">
              {renderPage()}
            </main>
            <Footer />
          </div>
        </div>
      </LanguageProvider>
    </ContentProvider>
  )
}

export default function App() {
  return <AppContent />
}
