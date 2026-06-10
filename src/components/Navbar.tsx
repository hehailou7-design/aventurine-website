import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import type { PageType } from '../App'

interface NavbarProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (v: boolean) => void
  onOpenAdmin: () => void
}

const navItems: { key: PageType; tKey: string }[] = [
  { key: 'character', tKey: 'nav1' },
  { key: 'materials', tKey: 'nav2' },
  { key: 'collaboration', tKey: 'nav4' },
  { key: 'chronicle', tKey: 'nav5' },
  { key: 'blackmud', tKey: 'nav7' },
  { key: 'submit', tKey: 'nav8' },
  { key: 'supportRecord', tKey: 'nav12' },
  { key: 'feedback', tKey: 'nav13' },
  { key: 'sponsorship', tKey: 'nav14' },
  { key: 'blessings', tKey: 'nav11' },
  { key: 'custom', tKey: 'nav15' },
]

const langOptions: { code: 'zh' | 'en' | 'ja' | 'ko'; label: string }[] = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
]

export default function Navbar({ currentPage, onNavigate, mobileMenuOpen, setMobileMenuOpen, onOpenAdmin }: NavbarProps) {
  const { t, lang, setLang } = useLang()
  const [langOpen, setLangOpen] = useState(false)

  return (
    <nav style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(212,184,120,0.2)' }}
      className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="max-w-screen-2xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex-shrink-0 text-left"
        >
          <div className="aurora-text font-bold text-sm md:text-base leading-tight tracking-widest">
            我们终将会在极光下重逢
          </div>
          <div style={{ color: 'rgba(212,184,120,0.5)', fontSize: '10px', letterSpacing: '0.2em' }}>
            AVENTURINE FAN STATION
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-1 flex-1 justify-center mx-4">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                color: currentPage === item.key ? '#d4b878' : 'rgba(248,246,240,0.7)',
                borderBottom: currentPage === item.key ? '2px solid #d4b878' : '2px solid transparent',
                fontSize: '13px',
                padding: '4px 8px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              className="hover:text-champagne"
            >
              {t(item.tKey)}
            </button>
          ))}
        </div>

        {/* Right: Lang + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Admin button */}
          <button
            onClick={onOpenAdmin}
            title="管理后台 (Ctrl+Shift+K)"
            style={{
              color: 'rgba(212,184,120,0.4)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '4px 6px',
            }}
          >
            ⚙
          </button>

          {/* Language Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                color: '#d4b878',
                border: '1px solid rgba(212,184,120,0.4)',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '12px',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {langOptions.find(l => l.code === lang)?.label} ▾
            </button>
            {langOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '110%',
                background: '#1a1a1a', border: '1px solid rgba(212,184,120,0.3)',
                borderRadius: '6px', minWidth: '80px', zIndex: 100,
              }}>
                {langOptions.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '8px 12px', fontSize: '12px',
                      color: l.code === lang ? '#d4b878' : '#f8f6f0',
                      background: 'transparent', cursor: 'pointer',
                      borderBottom: '1px solid rgba(212,184,120,0.1)',
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: '#d4b878',
              transition: 'all 0.2s',
              transform: mobileMenuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none'
            }} />
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: '#d4b878',
              opacity: mobileMenuOpen ? 0 : 1,
              transition: 'all 0.2s',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: '#d4b878',
              transition: 'all 0.2s',
              transform: mobileMenuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none'
            }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: '#0d0d0d',
          borderBottom: '1px solid rgba(212,184,120,0.2)',
          padding: '12px 0',
        }} className="xl:hidden">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="grid grid-cols-2 gap-1 mb-3">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => { onNavigate(item.key); setMobileMenuOpen(false) }}
                  style={{
                    color: currentPage === item.key ? '#d4b878' : 'rgba(248,246,240,0.8)',
                    background: currentPage === item.key ? 'rgba(212,184,120,0.1)' : 'transparent',
                    border: '1px solid rgba(212,184,120,0.15)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    textAlign: 'left',
                  }}
                >
                  {t(item.tKey)}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t border-champagne">
              {langOptions.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  style={{
                    color: l.code === lang ? '#121212' : '#d4b878',
                    background: l.code === lang ? '#d4b878' : 'transparent',
                    border: '1px solid rgba(212,184,120,0.4)',
                    borderRadius: '4px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
