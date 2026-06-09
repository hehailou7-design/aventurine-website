import { useState } from 'react'
import { useLang } from '../context/LanguageContext'

type AuthMode = 'login' | 'register' | 'changepwd' | 'bindemail' | 'privacy'

export default function AccountPage() {
  const { t } = useLang()
  const [mode, setMode] = useState<AuthMode>('login')
  const [form, setForm] = useState({ email: '', password: '', newPassword: '', confirm: '' })
  const [loggedIn, setLoggedIn] = useState(false)
  const [privacySettings, setPrivacySettings] = useState({
    showFanart: true, showFavorites: false, receiveNotifications: true,
  })

  const menuItems: { key: AuthMode; label: string }[] = [
    { key: 'login', label: loggedIn ? '已登录' : t('login') },
    { key: 'register', label: t('register') },
    { key: 'changepwd', label: t('change_pwd') },
    { key: 'bindemail', label: t('bind_email') },
    { key: 'privacy', label: t('privacy') },
  ]

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h2 className="section-title">{t('nav9')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}
          className="grid-cols-1 md:grid-cols-sidebar">
          
          {/* Sidebar */}
          <div style={{
            background: 'rgba(26,26,26,0.8)',
            border: '1px solid rgba(212,184,120,0.2)',
            borderRadius: '10px',
            padding: '8px',
            height: 'fit-content',
          }}>
            {menuItems.map(item => (
              <button
                key={item.key}
                onClick={() => setMode(item.key)}
                style={{
                  display: 'block', width: '100%',
                  textAlign: 'left', padding: '10px 14px',
                  fontSize: '13px', borderRadius: '6px',
                  color: mode === item.key ? '#d4b878' : 'rgba(248,246,240,0.6)',
                  background: mode === item.key ? 'rgba(212,184,120,0.1)' : 'transparent',
                  border: mode === item.key ? '1px solid rgba(212,184,120,0.2)' : '1px solid transparent',
                  cursor: 'pointer', marginBottom: '2px',
                  transition: 'all 0.2s',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="card-glass" style={{ padding: '28px', borderRadius: '10px' }}>
            {mode === 'login' && (
              <div>
                <div style={{ color: '#d4b878', fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>
                  {loggedIn ? '✓ 您已登录' : t('login')}
                </div>
                {loggedIn ? (
                  <div>
                    <p style={{ color: 'rgba(248,246,240,0.6)', fontSize: '13px', marginBottom: '16px' }}>
                      欢迎回来，骰子守望者！
                    </p>
                    <button
                      onClick={() => setLoggedIn(false)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(212,184,120,0.3)',
                        color: '#d4b878', padding: '8px 20px',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
                      }}
                    >
                      退出登录
                    </button>
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); setLoggedIn(true) }}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ color: 'rgba(212,184,120,0.7)', fontSize: '11px', display: 'block', marginBottom: '6px' }}>
                        邮箱
                      </label>
                      <input
                        type="email" placeholder="your@email.com" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        style={{
                          width: '100%', background: 'rgba(14,14,14,0.8)',
                          border: '1px solid rgba(212,184,120,0.3)',
                          borderRadius: '8px', padding: '10px 14px',
                          color: '#f2e8d0', fontSize: '13px', outline: 'none', fontFamily: 'inherit',
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ color: 'rgba(212,184,120,0.7)', fontSize: '11px', display: 'block', marginBottom: '6px' }}>
                        密码
                      </label>
                      <input
                        type="password" placeholder="••••••••" value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        style={{
                          width: '100%', background: 'rgba(14,14,14,0.8)',
                          border: '1px solid rgba(212,184,120,0.3)',
                          borderRadius: '8px', padding: '10px 14px',
                          color: '#f2e8d0', fontSize: '13px', outline: 'none', fontFamily: 'inherit',
                        }}
                      />
                    </div>
                    <button type="submit" className="btn-gold"
                      style={{ width: '100%', padding: '11px', fontSize: '13px' }}>
                      登录
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '14px' }}>
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        style={{ color: 'rgba(212,184,120,0.6)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}
                      >
                        还没有账号？立即注册 →
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {mode === 'register' && (
              <div>
                <div style={{ color: '#d4b878', fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>
                  {t('register')}
                </div>
                <form onSubmit={e => { e.preventDefault(); setLoggedIn(true); setMode('login') }}>
                  {[
                    { label: '用户名', key: 'email', type: 'text', placeholder: '给自己取个名字' },
                    { label: '邮箱', key: 'email', type: 'email', placeholder: 'your@email.com' },
                    { label: '密码', key: 'password', type: 'password', placeholder: '至少8位' },
                    { label: '确认密码', key: 'confirm', type: 'password', placeholder: '再次输入密码' },
                  ].map((f, i) => (
                    <div key={i} style={{ marginBottom: '14px' }}>
                      <label style={{ color: 'rgba(212,184,120,0.7)', fontSize: '11px', display: 'block', marginBottom: '6px' }}>
                        {f.label}
                      </label>
                      <input
                        type={f.type} placeholder={f.placeholder}
                        style={{
                          width: '100%', background: 'rgba(14,14,14,0.8)',
                          border: '1px solid rgba(212,184,120,0.3)',
                          borderRadius: '8px', padding: '10px 14px',
                          color: '#f2e8d0', fontSize: '13px', outline: 'none', fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  ))}
                  <button type="submit" className="btn-gold"
                    style={{ width: '100%', padding: '11px', fontSize: '13px', marginTop: '6px' }}>
                    注册
                  </button>
                </form>
              </div>
            )}

            {mode === 'changepwd' && (
              <div>
                <div style={{ color: '#d4b878', fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>
                  {t('change_pwd')}
                </div>
                {[
                  { label: '原密码', type: 'password', placeholder: '输入原密码' },
                  { label: '新密码', type: 'password', placeholder: '至少8位' },
                  { label: '确认新密码', type: 'password', placeholder: '再次输入新密码' },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: '14px' }}>
                    <label style={{ color: 'rgba(212,184,120,0.7)', fontSize: '11px', display: 'block', marginBottom: '6px' }}>
                      {f.label}
                    </label>
                    <input type={f.type} placeholder={f.placeholder} style={{
                      width: '100%', background: 'rgba(14,14,14,0.8)',
                      border: '1px solid rgba(212,184,120,0.3)',
                      borderRadius: '8px', padding: '10px 14px',
                      color: '#f2e8d0', fontSize: '13px', outline: 'none', fontFamily: 'inherit',
                    }} />
                  </div>
                ))}
                <button className="btn-gold" style={{ width: '100%', padding: '11px', fontSize: '13px', marginTop: '6px' }}>
                  确认修改
                </button>
              </div>
            )}

            {mode === 'bindemail' && (
              <div>
                <div style={{ color: '#d4b878', fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>
                  {t('bind_email')}
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(212,184,120,0.7)', fontSize: '11px', display: 'block', marginBottom: '6px' }}>
                    邮箱地址
                  </label>
                  <input type="email" placeholder="your@email.com" style={{
                    width: '100%', background: 'rgba(14,14,14,0.8)',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '8px', padding: '10px 14px',
                    color: '#f2e8d0', fontSize: '13px', outline: 'none', fontFamily: 'inherit',
                  }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                  <input type="text" placeholder="验证码" style={{
                    flex: 1, background: 'rgba(14,14,14,0.8)',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '8px', padding: '10px 14px',
                    color: '#f2e8d0', fontSize: '13px', outline: 'none', fontFamily: 'inherit',
                  }} />
                  <button style={{
                    background: 'rgba(212,184,120,0.1)',
                    border: '1px solid rgba(212,184,120,0.3)',
                    color: '#d4b878', padding: '10px 16px',
                    borderRadius: '8px', cursor: 'pointer', fontSize: '12px',
                    whiteSpace: 'nowrap',
                  }}>
                    获取验证码
                  </button>
                </div>
                <button className="btn-gold" style={{ width: '100%', padding: '11px', fontSize: '13px' }}>
                  绑定邮箱
                </button>
              </div>
            )}

            {mode === 'privacy' && (
              <div>
                <div style={{ color: '#d4b878', fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>
                  {t('privacy')}
                </div>
                {[
                  { key: 'showFanart', label: '公开我的投稿作品', desc: '开启后其他用户可以看到您的投稿' },
                  { key: 'showFavorites', label: '公开我的收藏', desc: '开启后其他用户可以看到您的收藏列表' },
                  { key: 'receiveNotifications', label: '接收站内通知', desc: '投稿审核结果、互动提醒等' },
                ].map(setting => (
                  <div key={setting.key} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px 0',
                    borderBottom: '1px solid rgba(212,184,120,0.1)',
                  }}>
                    <div>
                      <div style={{ color: '#f2e8d0', fontSize: '13px', marginBottom: '3px' }}>{setting.label}</div>
                      <div style={{ color: 'rgba(248,246,240,0.4)', fontSize: '11px' }}>{setting.desc}</div>
                    </div>
                    <button
                      onClick={() => setPrivacySettings(p => ({ ...p, [setting.key]: !p[setting.key as keyof typeof p] }))}
                      style={{
                        width: '44px', height: '24px',
                        borderRadius: '12px',
                        background: privacySettings[setting.key as keyof typeof privacySettings]
                          ? '#d4b878' : 'rgba(255,255,255,0.1)',
                        border: 'none', cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: privacySettings[setting.key as keyof typeof privacySettings] ? '22px' : '2px',
                        width: '20px', height: '20px',
                        borderRadius: '50%', background: '#fff',
                        transition: 'left 0.2s',
                      }} />
                    </button>
                  </div>
                ))}
                <button className="btn-gold" style={{ marginTop: '20px', padding: '10px 24px', fontSize: '12px' }}>
                  保存设置
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
