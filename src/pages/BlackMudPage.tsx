import { useState, useEffect, useRef } from 'react'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'
import { fetchCloudData, saveCloudData, type CloudData } from '../services/CloudDataService'

// ============ Types ============
interface BlackMudUser {
  id: string
  nickname: string
  password: string
  verifyType: 'purchase' | 'character' | 'social'
  verifyDetail: string
  verifyImages: string[]  // 上传的验证图片（base64压缩后）
  verified: boolean
  muted: boolean
  banned: boolean
  createdAt: string
}

interface BlackMudPost {
  id: string
  userId: string
  nickname: string
  verifyType: 'purchase' | 'character' | 'social'
  text: string
  tag: string
  time: string
  likes: number
  createdAt: string
  approved: boolean
}

// ============ localStorage keys ============
const USERS_KEY = 'aventurine_bm_users'
const CUR_USER_KEY = 'aventurine_bm_cur_user'
const POSTS_KEY = 'aventurine_bm_posts'
const LIKED_KEY = 'aventurine_bm_liked'

// ============ Cloud Sync ============
const syncToCloud = async () => {
  try {
    const users = loadUsers()
    const posts = loadPosts()
    const cloudData = await fetchCloudData()
    cloudData.blackMudUsers = users
    cloudData.blackMudPosts = posts
    await saveCloudData(cloudData)
    console.log('黑泥区数据已同步到云端')
  } catch (error) {
    console.error('同步到云端失败:', error)
  }
}

const loadFromCloud = async () => {
  try {
    const cloudData = await fetchCloudData()
    if (cloudData.blackMudUsers && cloudData.blackMudUsers.length > 0) {
      saveUsers(cloudData.blackMudUsers)
    }
    if (cloudData.blackMudPosts && cloudData.blackMudPosts.length > 0) {
      savePosts(cloudData.blackMudPosts)
    }
    console.log('黑泥区数据已从云端加载')
    return true
  } catch (error) {
    console.error('从云端加载失败:', error)
    return false
  }
}

// ============ Helpers ============
function loadUsers(): BlackMudUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') }
  catch { return [] }
}
function saveUsers(users: BlackMudUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)) }

function loadPosts(): BlackMudPost[] {
  try { return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]') }
  catch { return [] }
}
function savePosts(posts: BlackMudPost[]) { localStorage.setItem(POSTS_KEY, JSON.stringify(posts)) }

function loadLiked(): string[] {
  try { return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]') }
  catch { return [] }
}
function saveLiked(ids: string[]) { localStorage.setItem(LIKED_KEY, JSON.stringify(ids)) }

function loadCurUser(): string | null {
  try { return JSON.parse(localStorage.getItem(CUR_USER_KEY) || 'null') }
  catch { return null }
}
function saveCurUser(userId: string | null) {
  if (userId) localStorage.setItem(CUR_USER_KEY, JSON.stringify(userId))
  else localStorage.removeItem(CUR_USER_KEY)
}

const tags = ['全部', '抽卡', '线下', '周边', '剧情', '游戏']
const verifyTypeLabels: Record<string, string> = {
  purchase: '🛒 周边购买记录',
  character: '🎮 角色练度截图',
  social: '📱 小红书/微博账号',
}
const verifyTypeColors: Record<string, string> = {
  purchase: '#88c8d8',
  character: '#d4b878',
  social: '#e898b8',
}

// ============ Main Component ============
export default function BlackMudPage() {
  const { t } = useLang()
  const { content } = useContent()

  // —— 当前用户 ——
  const [curUserId, setCurUserId] = useState<string | null>(() => loadCurUser())
  const users = loadUsers()
  const curUser = users.find(u => u.id === curUserId) || null
  const isAdmin = curUser?.nickname === (content.blackMud?.adminNickname || '管理员')

  // —— 页面阶段 ——
  // 'login' | 'register' | 'forum'
  const [stage, setStage] = useState<'login' | 'register' | 'forum'>(() => {
    const u = users.find(u => u.id === loadCurUser())
    return u && !u.banned ? 'forum' : 'login'
  })

  // 云端同步版本号（用于触发重新渲染）
  const [cloudSyncVersion, setCloudSyncVersion] = useState(0)

  // 云端同步：加载时从云端加载，然后每30秒同步一次
  useEffect(() => {
    const syncData = async () => {
      const success = await loadFromCloud()
      if (success) {
        // 更新状态以触发重新渲染
        setPosts(loadPosts())
        setLikedPosts(loadLiked())
        setCloudSyncVersion(prev => prev + 1)
      }
    }
    syncData()
    
    const interval = setInterval(syncData, 30000)
    return () => clearInterval(interval)
  }, [])

  // =========== 注册 ===========
  const [regNickname, setRegNickname] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regVerifyType, setRegVerifyType] = useState<'purchase' | 'character' | 'social'>('purchase')
  const [regVerifyDetail, setRegVerifyDetail] = useState('')
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState(false)
  const [regImages, setRegImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 压缩图片函数
  const compressImage = (file: File, maxWidth: number = 800, maxSizeKB: number = 200): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let { width, height } = img
          
          // 按比例缩放
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) { reject(new Error('Canvas not supported')); return }
          ctx.drawImage(img, 0, 0, width, height)
          
          // 尝试压缩到目标大小
          let quality = 0.7
          let result = canvas.toDataURL('image/jpeg', quality)
          
          // 如果还太大，继续降低质量
          while (result.length > maxSizeKB * 1024 && quality > 0.1) {
            quality -= 0.1
            result = canvas.toDataURL('image/jpeg', quality)
          }
          
          resolve(result)
        }
        img.onerror = () => reject(new Error('Image load failed'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('File read failed'))
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    if (regImages.length >= 5) {
      setRegError('最多上传 5 张图片')
      return
    }
    
    setRegError('')
    try {
      const compressed = await compressImage(files[0])
      setRegImages(prev => [...prev, compressed])
    } catch (err) {
      setRegError('图片上传失败，请重试')
    }
    
    // 清除 input 以便重复选择同一文件
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    setRegImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleRegister = () => {
    setRegError('')
    if (!regNickname.trim() || !regPassword || !regVerifyDetail.trim()) {
      setRegError('请填写所有必填项')
      return
    }
    if (regPassword.length < 4) {
      setRegError('密码至少4位')
      return
    }
    if (users.some(u => u.nickname === regNickname.trim())) {
      setRegError('昵称已被使用，请换一个')
      return
    }
    const newUser: BlackMudUser = {
      id: 'user_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      nickname: regNickname.trim(),
      password: regPassword,
      verifyType: regVerifyType,
      verifyDetail: regVerifyDetail.trim(),
      verifyImages: regImages,
      verified: true, // 前端自动通过，实际可改为需审核
      muted: false,
      banned: false,
      createdAt: new Date().toISOString(),
    }
    const next = [...users, newUser]
    saveUsers(next)
    syncToCloud() // 同步到云端
    setRegSuccess(true)
    setTimeout(() => {
      saveCurUser(newUser.id)
      setCurUserId(newUser.id)
      setStage('forum')
      setRegSuccess(false)
      setRegNickname('')
      setRegPassword('')
      setRegVerifyDetail('')
      setRegImages([])
    }, 1500)
  }

  // =========== 登录 ===========
  const [loginNickname, setLoginNickname] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleLogin = () => {
    setLoginError('')
    const user = users.find(u => u.nickname === loginNickname.trim())
    if (!user) { setLoginError('用户不存在'); return }
    if (user.banned) { setLoginError('账号已被封禁'); return }
    if (user.password !== loginPassword) { setLoginError('密码错误'); return }
    saveCurUser(user.id)
    setCurUserId(user.id)
    setStage('forum')
  }

  const handleLogout = () => {
    saveCurUser(null)
    setCurUserId(null)
    setStage('login')
  }

  // =========== 帖子 ===========
  const [posts, setPosts] = useState<BlackMudPost[]>(loadPosts)
  const [newText, setNewText] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [activeFilter, setActiveFilter] = useState('全部')
  const [likedPosts, setLikedPosts] = useState<string[]>(loadLiked)

  // 同步保存
  useEffect(() => { savePosts(posts) }, [posts])
  useEffect(() => { saveLiked(likedPosts) }, [likedPosts])

  const approvedPosts = posts.filter(p => p.approved && !users.find(u => u.id === p.userId)?.banned)
  const pendingPosts = posts.filter(p => !p.approved)
  const filtered = activeFilter === '全部' ? approvedPosts
    : approvedPosts.filter(p => p.tag === activeFilter)

  // 发帖
  const handlePost = () => {
    if (!newText.trim() || !curUser || curUser.muted || curUser.banned) return
    const newPost: BlackMudPost = {
      id: 'post_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      userId: curUser.id,
      nickname: curUser.nickname,
      verifyType: curUser.verifyType,
      text: newText.trim(),
      tag: selectedTag || '其他',
      time: '刚刚',
      likes: 0,
      createdAt: new Date().toISOString(),
      approved: false,
    }
    setPosts(prev => [newPost, ...prev])
    setNewText('')
    setSelectedTag('')
  }

  // 审核
  const handleApprove = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, approved: true, time: '刚刚' } : p))
  }
  const handleReject = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  // 点赞
  const handleLike = (postId: string) => {
    if (likedPosts.includes(postId)) return
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    setLikedPosts(prev => [...prev, postId])
  }

  // 管理员操作
  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }
  const handleMuteUser = (userId: string) => {
    const next = users.map(u => u.id === userId ? { ...u, muted: !u.muted } : u)
    saveUsers(next)
    setPosts([...posts]) // 触发刷新
  }
  const handleBanUser = (userId: string) => {
    const next = users.map(u => u.id === userId ? { ...u, banned: !u.banned } : u)
    saveUsers(next)
    setPosts([...posts])
  }

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setPosts(prev => prev.map(p => {
        const ago = Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 1000)
        let display: string
        if (ago < 60) display = '刚刚'
        else if (ago < 3600) display = Math.floor(ago / 60) + '分钟前'
        else if (ago < 86400) display = Math.floor(ago / 3600) + '小时前'
        else display = Math.floor(ago / 86400) + '天前'
        return { ...p, time: display }
      }))
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  // =========== 未登录/未注册 ===========
  if (stage !== 'forum') {
    return (
      <div style={{ padding: '40px 0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="max-w-md mx-auto px-4" style={{ width: '100%' }}>
          <div className="card-glass" style={{ padding: '40px 32px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(212,184,120,0.15)' }}>

            {/* 标题 */}
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔐</div>
            <h2 style={{ color: '#d4b878', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
              {stage === 'register' ? '黑泥区 · 注册账号' : '黑泥区 · 论坛登录'}
            </h2>
            <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '24px' }}>
              {stage === 'register' ? '填写信息完成注册，验证身份后即可发帖' : '登录后参与论坛讨论'}
            </p>

            {/* ——— 注册表单 ——— */}
            {stage === 'register' && (
              <div style={{ textAlign: 'left' }}>
                {/* 昵称 */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                    昵称 *
                  </label>
                  <input type="text" value={regNickname} onChange={e => setRegNickname(e.target.value)} placeholder="你的论坛昵称"
                    maxLength={12}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(14,14,14,0.8)', border: '1px solid rgba(212,184,120,0.25)', color: '#f2e8d0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* 密码 */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                    密码（至少4位）*
                  </label>
                  <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="设置登录密码"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(14,14,14,0.8)', border: '1px solid rgba(212,184,120,0.25)', color: '#f2e8d0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                {/* 验证方式 */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: 'rgba(212,184,120,0.8)', fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                    验证身份（三选一）*
                  </label>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    {(['purchase', 'character', 'social'] as const).map(vt => (
                      <button key={vt} onClick={() => { setRegVerifyType(vt); setRegImages([]); setRegError('') }}
                        style={{
                          padding: '6px 12px', fontSize: '11px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
                          background: regVerifyType === vt ? 'rgba(212,184,120,0.15)' : 'transparent',
                          border: '1px solid ' + (regVerifyType === vt ? 'rgba(212,184,120,0.4)' : 'rgba(212,184,120,0.15)'),
                          color: regVerifyType === vt ? '#d4b878' : 'rgba(248,246,240,0.5)',
                        }}>
                        {verifyTypeLabels[vt]}
                      </button>
                    ))}
                  </div>
                  <input type="text" value={regVerifyDetail} onChange={e => setRegVerifyDetail(e.target.value)}
                    placeholder={
                      regVerifyType === 'purchase' ? '请输入周边购买记录（商品名/订单号/平台）' :
                      regVerifyType === 'character' ? '请输入角色练度描述（等级/光锥/遗器）' :
                      '请输入小红书或微博账号主页链接'
                    }
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(14,14,14,0.8)', border: '1px solid rgba(212,184,120,0.25)', color: '#f2e8d0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
                  />
                  
                  {/* 图片上传区域 — 仅 purchase 和 character */}
                  {(regVerifyType === 'purchase' || regVerifyType === 'character') && (
                    <div style={{ marginTop: '10px' }}>
                      {/* 上传按钮 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={regImages.length >= 5}
                          style={{
                            padding: '8px 16px', borderRadius: '8px', cursor: regImages.length >= 5 ? 'default' : 'pointer',
                            background: regImages.length >= 5 ? 'rgba(255,255,255,0.03)' : 'rgba(212,184,120,0.1)',
                            border: `1px solid ${regImages.length >= 5 ? 'rgba(255,255,255,0.08)' : 'rgba(212,184,120,0.3)'}`,
                            color: regImages.length >= 5 ? 'rgba(255,255,255,0.3)' : '#d4b878',
                            fontSize: '12px', fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', gap: '6px',
                          }}
                        >
                          📷 上传{regVerifyType === 'purchase' ? '购买记录' : '练度'}截图
                        </button>
                        <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>
                          {regImages.length}/5 张
                        </span>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      
                      {/* 图片预览 */}
                      {regImages.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {regImages.map((img, idx) => (
                            <div key={idx} style={{
                              position: 'relative',
                              width: '80px', height: '80px',
                              borderRadius: '8px', overflow: 'hidden',
                              border: '1px solid rgba(212,184,120,0.2)',
                            }}>
                              <img src={img} alt={`验证图片 ${idx + 1}`} style={{
                                width: '100%', height: '100%', objectFit: 'cover',
                              }} />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                style={{
                                  position: 'absolute', top: '2px', right: '2px',
                                  width: '20px', height: '20px', borderRadius: '50%',
                                  background: 'rgba(0,0,0,0.7)', border: 'none',
                                  color: '#e06060', fontSize: '12px', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  lineHeight: 1,
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div style={{ color: 'rgba(248,246,240,0.25)', fontSize: '10px', marginTop: '6px' }}>
                        {regVerifyType === 'purchase' && '💡 上传周边订单截图或购买记录照片（支持 jpg/png，自动压缩）'}
                        {regVerifyType === 'character' && '💡 上传游戏内角色练度截图（角色面板/光锥/遗器，支持多张）'}
                      </div>
                    </div>
                  )}
                  
                  {/* 社会账号提示 — 仅 social */}
                  {regVerifyType === 'social' && (
                    <div style={{ color: 'rgba(248,246,240,0.25)', fontSize: '10px', marginTop: '6px' }}>
                      💡 填写你的小红书或微博账号主页链接
                    </div>
                  )}
                </div>

                {regError && (
                  <div style={{ color: '#e06060', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>{regError}</div>
                )}
                {regSuccess && (
                  <div style={{ color: '#8cba6a', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>✅ 注册成功！正在跳转...</div>
                )}

                <button onClick={handleRegister}
                  disabled={regSuccess}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                    background: regSuccess ? 'rgba(212,184,120,0.1)' : 'linear-gradient(135deg, #d4b878, #c4a060)',
                    color: regSuccess ? '#d4b878' : '#121212', fontSize: '14px', fontWeight: 700, cursor: regSuccess ? 'default' : 'pointer', fontFamily: 'inherit',
                  }}>
                  完成注册
                </button>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button onClick={() => { setStage('login'); setRegError('') }}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(212,184,120,0.5)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    已有账号？去登录 →
                  </button>
                </div>
              </div>
            )}

            {/* ——— 登录表单 ——— */}
            {stage === 'login' && (
              <div>
                <input type="text" value={loginNickname} onChange={e => { setLoginNickname(e.target.value); setLoginError('') }}
                  onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
                  placeholder="昵称"
                  autoFocus
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', boxSizing: 'border-box', marginBottom: '10px',
                    background: 'rgba(14,14,14,0.8)', border: '1px solid ' + (loginError ? 'rgba(224,96,96,0.4)' : 'rgba(212,184,120,0.25)'),
                    color: '#f2e8d0', fontSize: '14px', outline: 'none', textAlign: 'center',
                  }}
                />
                <input type="password" value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setLoginError('') }}
                  onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
                  placeholder="密码"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', boxSizing: 'border-box', marginBottom: '16px',
                    background: 'rgba(14,14,14,0.8)', border: '1px solid ' + (loginError ? 'rgba(224,96,96,0.4)' : 'rgba(212,184,120,0.25)'),
                    color: '#f2e8d0', fontSize: '14px', outline: 'none', textAlign: 'center',
                  }}
                />
                {loginError && (
                  <div style={{ color: '#e06060', fontSize: '12px', marginBottom: '12px' }}>{loginError}</div>
                )}
                <button onClick={handleLogin}
                  disabled={!loginNickname.trim() || !loginPassword}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                    background: (!loginNickname.trim() || !loginPassword) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #d4b878, #c4a060)',
                    color: (!loginNickname.trim() || !loginPassword) ? 'rgba(248,246,240,0.3)' : '#121212',
                    fontSize: '15px', fontWeight: 700, cursor: (!loginNickname.trim() || !loginPassword) ? 'default' : 'pointer', fontFamily: 'inherit',
                  }}>
                  进入论坛
                </button>
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button onClick={() => { setStage('register'); setLoginError('') }}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(212,184,120,0.5)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    没有账号？注册新账号 →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // =========== 论坛主体 ===========
  if (!curUser) return null

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="section-title">{t('vent_board')}</h2>
            <div style={{ background: 'rgba(212,184,120,0.06)', border: '1px solid rgba(212,184,120,0.2)', borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#d4b878', fontSize: '16px' }}>💬</span>
              <span style={{ color: 'rgba(248,246,240,0.7)', fontSize: '12px' }}>
                论坛模式 · 审核制 · 一人一赞 · 验证发帖
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212,184,120,0.06)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '8px', padding: '4px 10px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(212,184,120,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4b878', fontSize: '11px' }}>{curUser.nickname[0]}</div>
              <span style={{ color: '#d4b878', fontSize: '12px', fontWeight: 500 }}>{curUser.nickname}</span>
              {curUser.muted && <span style={{ color: '#e0b43c', fontSize: '10px', background: 'rgba(224,180,60,0.1)', padding: '1px 6px', borderRadius: '4px' }}>禁言中</span>}
            </div>
            <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 16px', color: 'rgba(248,246,240,0.4)', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>退出</button>
          </div>
        </div>

        {/* ——— 管理员：用户管理 ——— */}
        {isAdmin && (
          <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(212,184,120,0.04)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '12px' }}>
            <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>🛡️ 用户管理（{users.length} 人）</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
              {users.filter(u => u.nickname !== curUser.nickname).map(u => (
                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(14,14,14,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#d4b878', fontSize: '12px', fontWeight: 600 }}>{u.nickname}</span>
                    <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: `rgba(${verifyTypeColors[u.verifyType]?.slice(1) || '212,184,120'},0.1)`, color: verifyTypeColors[u.verifyType] || '#d4b878' }}>
                      {verifyTypeLabels[u.verifyType]?.replace(/ 🛒|🎮|📱 /, '') || ''}
                      {u.verifyImages && u.verifyImages.length > 0 && ` 📷×${u.verifyImages.length}`}
                    </span>
                    {u.muted && <span style={{ color: '#e0b43c', fontSize: '10px' }}>禁言</span>}
                    {u.banned && <span style={{ color: '#e06060', fontSize: '10px' }}>封禁</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => handleMuteUser(u.id)} style={{ background: u.muted ? 'rgba(100,180,120,0.15)' : 'rgba(224,180,60,0.1)', border: '1px solid ' + (u.muted ? 'rgba(100,180,120,0.3)' : 'rgba(224,180,60,0.2)'), borderRadius: '6px', padding: '3px 10px', fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit', color: u.muted ? '#8cba6a' : '#e0b43c' }}>
                      {u.muted ? '解除禁言' : '禁言'}
                    </button>
                    <button onClick={() => handleBanUser(u.id)} style={{ background: u.banned ? 'rgba(100,180,120,0.1)' : 'rgba(224,96,96,0.1)', border: '1px solid ' + (u.banned ? 'rgba(100,180,120,0.2)' : 'rgba(224,96,96,0.2)'), borderRadius: '6px', padding: '3px 10px', fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit', color: u.banned ? '#8cba6a' : '#e06060' }}>
                      {u.banned ? '解封' : '封禁'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ——— 审核队列（管理员） ——— */}
        {isAdmin && pendingPosts.length > 0 && (
          <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(224,180,60,0.06)', border: '1px solid rgba(224,180,60,0.2)', borderRadius: '12px' }}>
            <div style={{ color: '#e0b43c', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              📋 审核队列（{pendingPosts.length}条待审核）
            </div>
            {pendingPosts.map(post => {
              const author = users.find(u => u.id === post.userId)
              return (
                <div key={post.id} style={{ padding: '12px', marginBottom: '8px', background: 'rgba(14,14,14,0.5)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#d4b878', fontSize: '12px', fontWeight: 600 }}>{post.nickname}</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '1px 8px', fontSize: '10px', color: 'rgba(248,246,240,0.4)' }}>#{post.tag}</span>
                  </div>
                  <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', marginBottom: '6px' }}>{post.text}</div>
                  {author && (
                    <div style={{ color: 'rgba(248,246,240,0.25)', fontSize: '10px', marginBottom: '8px' }}>
                      <div>验证方式：{verifyTypeLabels[author.verifyType]} / 详情：{author.verifyDetail}</div>
                      {author.verifyImages && author.verifyImages.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                          {author.verifyImages.map((img, idx) => (
                            <a key={idx} href={img} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                              <img src={img} alt={`验证图${idx+1}`} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleApprove(post.id)} style={{ background: 'rgba(100,180,120,0.15)', border: '1px solid rgba(100,180,120,0.3)', borderRadius: '6px', padding: '4px 14px', color: '#8cba6a', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>✓ 通过</button>
                    <button onClick={() => handleReject(post.id)} style={{ background: 'rgba(224,96,96,0.1)', border: '1px solid rgba(224,96,96,0.2)', borderRadius: '6px', padding: '4px 14px', color: '#e06060', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>✕ 拒绝</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ——— 发帖 ——— */}
        {!curUser.muted && !curUser.banned && (
          <div className="card-glass" style={{ padding: '20px', marginBottom: '24px', borderRadius: '10px' }}>
            <div style={{ color: '#d4b878', fontSize: '13px', marginBottom: '12px', fontWeight: 500 }}>有话要说？</div>
            <textarea value={newText} onChange={e => setNewText(e.target.value)}
              placeholder="理性吐槽，建设性意见优先...（发帖需审核）"
              maxLength={500}
              style={{ width: '100%', minHeight: '80px', background: 'rgba(14,14,14,0.8)', border: '1px solid rgba(212,184,120,0.25)', borderRadius: '8px', padding: '12px', color: '#f2e8d0', fontSize: '13px', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {tags.filter(tg => tg !== '全部').map(tag => (
                  <button key={tag} onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)} style={{
                    padding: '4px 10px', fontSize: '11px', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit',
                    background: selectedTag === tag ? 'rgba(212,184,120,0.15)' : 'transparent',
                    border: '1px solid ' + (selectedTag === tag ? 'rgba(212,184,120,0.4)' : 'rgba(212,184,120,0.15)'),
                    color: selectedTag === tag ? '#d4b878' : 'rgba(248,246,240,0.5)',
                  }}>#{tag}</button>
                ))}
              </div>
              <button onClick={handlePost} className="btn-gold" style={{ fontSize: '12px', padding: '8px 18px' }}>
                发布（待审核）
              </button>
            </div>
          </div>
        )}
        {curUser.muted && (
          <div style={{ padding: '12px 20px', marginBottom: '20px', background: 'rgba(224,180,60,0.06)', border: '1px solid rgba(224,180,60,0.2)', borderRadius: '10px', color: '#e0b43c', fontSize: '13px', textAlign: 'center' }}>
            ⚠️ 你已被禁言，无法发帖
          </div>
        )}

        {/* ——— 筛选 ——— */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <button key={tag} onClick={() => setActiveFilter(tag)} style={{
              padding: '5px 14px', fontSize: '12px', borderRadius: '20px', cursor: 'pointer', fontFamily: 'inherit',
              background: activeFilter === tag ? 'rgba(212,184,120,0.15)' : 'transparent',
              border: '1px solid ' + (activeFilter === tag ? 'rgba(212,184,120,0.4)' : 'rgba(212,184,120,0.15)'),
              color: activeFilter === tag ? '#d4b878' : 'rgba(248,246,240,0.5)',
            }}>{tag}</button>
          ))}
        </div>

        {/* ——— 帖子列表 ——— */}
        {filtered.length === 0 ? (
          <div className="card-glass" style={{ padding: '40px 20px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍀</div>
            <div style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px' }}>还没有留言，来做第一个发声的人吧</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(post => {
              const hasLiked = likedPosts.includes(post.id)
              const author = users.find(u => u.id === post.userId)
              return (
                <div key={post.id} className="card-glass" style={{ padding: '16px 20px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212,184,120,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4b878', fontSize: '12px' }}>{post.nickname[0]}</div>
                      <span style={{ color: '#d4b878', fontSize: '13px', fontWeight: 500 }}>{post.nickname}</span>
                      <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '4px', background: `rgba(${verifyTypeColors[post.verifyType]?.slice(1) || '212,184,120'},0.08)`, color: verifyTypeColors[post.verifyType] || '#d4b878' }}>
                        {verifyTypeLabels[post.verifyType]?.replace(/ 🛒|🎮|📱 /, '') || ''}
                      </span>
                      <span style={{ background: 'rgba(212,184,120,0.08)', color: 'rgba(248,246,240,0.5)', fontSize: '10px', padding: '2px 8px', borderRadius: '4px' }}>#{post.tag}</span>
                    </div>
                    <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>{post.time}</span>
                  </div>
                  <p style={{ color: 'rgba(242,232,208,0.8)', fontSize: '13px', lineHeight: '1.8', margin: 0, marginBottom: '10px' }}>{post.text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => !hasLiked && handleLike(post.id)}
                      disabled={hasLiked}
                      style={{ color: hasLiked ? 'rgba(212,184,120,0.8)' : 'rgba(212,184,120,0.4)', fontSize: '11px', cursor: hasLiked ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }}
                      title={hasLiked ? '已赞' : '点赞'}
                    >{hasLiked ? '♥' : '♡'} {post.likes}</button>

                    {/* 管理员：删除帖子 */}
                    {isAdmin && (
                      <button onClick={() => handleDeletePost(post.id)}
                        style={{ color: '#e06060', fontSize: '10px', cursor: 'pointer', background: 'rgba(224,96,96,0.08)', border: '1px solid rgba(224,96,96,0.2)', borderRadius: '4px', padding: '2px 8px', fontFamily: 'inherit' }}>
                        🗑️ 删帖
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
