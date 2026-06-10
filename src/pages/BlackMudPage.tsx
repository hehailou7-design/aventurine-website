import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'

interface BlackmudPost {
  id: string
  nickname: string
  text: string
  tag: string
  time: string
  likes: number
  createdAt: string
  approved: boolean
}

const POSTS_KEY = 'aventurine_blackmud_posts'
const NICKNAME_KEY = 'aventurine_blackmud_nickname'
const LIKED_KEY = 'aventurine_blackmud_liked'
const LOGIN_KEY = 'aventurine_blackmud_logged_in'

function loadPosts(): BlackmudPost[] {
  try { return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]') }
  catch { return [] }
}
function savePosts(posts: BlackmudPost[]) { localStorage.setItem(POSTS_KEY, JSON.stringify(posts)) }
function loadLiked(): string[] {
  try { return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]') }
  catch { return [] }
}
function saveLiked(ids: string[]) { localStorage.setItem(LIKED_KEY, JSON.stringify(ids)) }
function loadNickname(): string { return localStorage.getItem(NICKNAME_KEY) || '' }
function saveNickname(n: string) { localStorage.setItem(NICKNAME_KEY, n) }

const tags = ['全部', '抽卡', '线下', '周边', '剧情', '游戏']

export default function BlackMudPage() {
  const { t } = useLang()
  const { content } = useContent()

  // 登录
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem(LOGIN_KEY) === 'true')
  const [passwordInput, setPasswordInput] = useState('')
  const [loginError, setLoginError] = useState(false)
  const correctPassword = content.blackMud?.accountPassword || 'aventurine2024'

  const handleLogin = () => {
    if (passwordInput === correctPassword) {
      setLoggedIn(true)
      localStorage.setItem(LOGIN_KEY, 'true')
      setLoginError(false)
    } else {
      setLoginError(true)
    }
  }

  const handleLogout = () => {
    setLoggedIn(false)
    localStorage.removeItem(LOGIN_KEY)
  }

  // 帖子
  const [posts, setPosts] = useState<BlackmudPost[]>(loadPosts)
  const [newText, setNewText] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [activeFilter, setActiveFilter] = useState('全部')

  // 昵称
  const [nickname, setNickname] = useState(loadNickname)
  const [localNickname, setLocalNickname] = useState(loadNickname)
  const [nicknameSaved, setNicknameSaved] = useState(!!loadNickname())
  const [editingNickname, setEditingNickname] = useState(false)

  // 点赞
  const [likedPosts, setLikedPosts] = useState<string[]>(loadLiked)

  // 审核队列（管理员）
  const pendingPosts = posts.filter(p => !p.approved)
  const approvedPosts = posts.filter(p => p.approved)

  const filtered = activeFilter === '全部'
    ? approvedPosts
    : approvedPosts.filter(p => p.tag === activeFilter)

  // 发帖（需审核）
  const handlePost = () => {
    if (!newText.trim()) return
    if (!nickname.trim()) { setEditingNickname(true); return }
    if (!loggedIn) return

    const newPost: BlackmudPost = {
      id: 'post_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      nickname: nickname.trim(),
      text: newText.trim(),
      tag: selectedTag || '其他',
      time: '刚刚',
      likes: 0,
      createdAt: new Date().toISOString(),
      approved: false,
    }
    const next = [newPost, ...posts]
    setPosts(next)
    savePosts(next)
    setNewText('')
    setSelectedTag('')
  }

  // 审核通过
  const handleApprove = (postId: string) => {
    const next = posts.map(p => p.id === postId ? { ...p, approved: true, time: '刚刚' } : p)
    setPosts(next)
    savePosts(next)
  }

  // 审核拒绝（删除）
  const handleReject = (postId: string) => {
    const next = posts.filter(p => p.id !== postId)
    setPosts(next)
    savePosts(next)
  }

  // 点赞
  const handleLike = (postId: string) => {
    if (likedPosts.includes(postId)) return
    const next = posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p)
    setPosts(next)
    savePosts(next)
    const nextLiked = [...likedPosts, postId]
    setLikedPosts(nextLiked)
    saveLiked(nextLiked)
  }

  // 保存昵称
  const submitNickname = () => {
    const n = localNickname.trim()
    if (n) { setNickname(n); saveNickname(n); setNicknameSaved(true) }
    setEditingNickname(false)
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

  // ============ 未登录 ============
  if (!loggedIn) {
    return (
      <div style={{ padding: '40px 0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="max-w-md mx-auto px-4" style={{ width: '100%' }}>
          <div className="card-glass" style={{
            padding: '40px 32px', borderRadius: '20px', textAlign: 'center',
            border: '1px solid rgba(212,184,120,0.15)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔐</div>
            <h2 style={{ color: '#d4b878', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>
              黑泥区 · 论坛登录
            </h2>
            <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '24px' }}>
              请输入论坛密码以进入黑泥区
            </p>
            <input
              type="password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setLoginError(false) }}
              onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
              placeholder="请输入密码"
              autoFocus
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                background: 'rgba(14,14,14,0.8)', border: '1px solid ' + (loginError ? 'rgba(224,96,96,0.4)' : 'rgba(212,184,120,0.25)'),
                color: '#f2e8d0', fontSize: '14px', outline: 'none',
                textAlign: 'center', boxSizing: 'border-box',
              }}
            />
            {loginError && (
              <div style={{ color: '#e06060', fontSize: '12px', marginTop: '8px' }}>密码错误，请重试</div>
            )}
            <button
              onClick={handleLogin}
              disabled={!passwordInput.trim()}
              style={{
                width: '100%', marginTop: '16px', padding: '12px',
                background: passwordInput.trim() ? 'linear-gradient(135deg, #d4b878, #c4a060)' : 'rgba(255,255,255,0.05)',
                border: 'none', borderRadius: '12px',
                color: passwordInput.trim() ? '#121212' : 'rgba(248,246,240,0.3)',
                fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >进入论坛</button>
          </div>
        </div>
      </div>
    )
  }

  // ============ 已登录 ============
  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 className="section-title">{t('vent_board')}</h2>
            <div style={{
              background: 'rgba(212,184,120,0.06)', border: '1px solid rgba(212,184,120,0.2)',
              borderRadius: '8px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span style={{ color: '#d4b878', fontSize: '16px' }}>💬</span>
              <span style={{ color: 'rgba(248,246,240,0.7)', fontSize: '12px' }}>
                {t('vent_notice')} · 审核制 · 一人一赞
              </span>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '6px 16px', color: 'rgba(248,246,240,0.4)',
            fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit',
          }}>退出登录</button>
        </div>

        {/* 审核队列 */}
        {pendingPosts.length > 0 && (
          <div style={{
            marginBottom: '20px', padding: '16px',
            background: 'rgba(224,180,60,0.06)', border: '1px solid rgba(224,180,60,0.2)',
            borderRadius: '12px',
          }}>
            <div style={{ color: '#e0b43c', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              📋 审核队列（{pendingPosts.length}条待审核）
            </div>
            {pendingPosts.map(post => (
              <div key={post.id} style={{
                padding: '12px', marginBottom: '8px',
                background: 'rgba(14,14,14,0.5)', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#d4b878', fontSize: '12px', fontWeight: 600 }}>{post.nickname}</span>
                  <span style={{
                    background: 'rgba(255,255,255,0.05)', borderRadius: '4px',
                    padding: '1px 8px', fontSize: '10px', color: 'rgba(248,246,240,0.4)',
                  }}>#{post.tag}</span>
                </div>
                <div style={{ color: 'rgba(248,246,240,0.7)', fontSize: '13px', marginBottom: '10px' }}>{post.text}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleApprove(post.id)} style={{
                    background: 'rgba(100,180,120,0.15)', border: '1px solid rgba(100,180,120,0.3)',
                    borderRadius: '6px', padding: '4px 14px', color: '#8cba6a',
                    fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit',
                  }}>✓ 通过</button>
                  <button onClick={() => handleReject(post.id)} style={{
                    background: 'rgba(224,96,96,0.1)', border: '1px solid rgba(224,96,96,0.2)',
                    borderRadius: '6px', padding: '4px 14px', color: '#e06060',
                    fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit',
                  }}>✕ 拒绝</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 昵称 */}
        <div className="card-glass" style={{ padding: '12px 16px', marginBottom: '16px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(212,184,120,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4b878', fontSize: '14px' }}>
              {nickname ? nickname[0] : '?'}
            </div>
            {editingNickname ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="text" value={localNickname} onChange={e => setLocalNickname(e.target.value)} placeholder="你的昵称" autoFocus maxLength={12}
                  onKeyDown={e => { if (e.key === 'Enter') submitNickname() }}
                  style={{ background: 'rgba(14,14,14,0.8)', border: '1px solid rgba(212,184,120,0.4)', borderRadius: '6px', padding: '6px 10px', color: '#f2e8d0', fontSize: '13px', width: '140px', outline: 'none', fontFamily: 'inherit' }}
                />
                <button onClick={submitNickname} className="btn-gold" style={{ fontSize: '11px', padding: '5px 12px' }}>保存</button>
                <button onClick={() => { setEditingNickname(false); setLocalNickname(nickname) }}
                  style={{ background: 'transparent', border: '1px solid rgba(212,184,120,0.2)', borderRadius: '6px', padding: '5px 10px', color: 'rgba(248,246,240,0.4)', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}
                >取消</button>
              </div>
            ) : (
              <>
                <span style={{ color: '#d4b878', fontSize: '13px', fontWeight: 500 }}>{nickname || '未设置昵称'}</span>
                <button onClick={() => { setEditingNickname(true); setLocalNickname(nickname) }}
                  style={{ background: 'transparent', border: 'none', color: 'rgba(248,246,240,0.35)', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}
                >✎ 修改</button>
              </>
            )}
          </div>
        </div>

        {/* 发帖 */}
        <div className="card-glass" style={{ padding: '20px', marginBottom: '24px', borderRadius: '10px' }}>
          <div style={{ color: '#d4b878', fontSize: '13px', marginBottom: '12px', fontWeight: 500 }}>有话要说？</div>
          <textarea
            value={newText} onChange={e => setNewText(e.target.value)}
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

        {/* 筛选 */}
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

        {/* 帖子列表 */}
        {filtered.length === 0 ? (
          <div className="card-glass" style={{ padding: '40px 20px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍀</div>
            <div style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px' }}>还没有留言，来做第一个发声的人吧</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(post => {
              const hasLiked = likedPosts.includes(post.id)
              return (
                <div key={post.id} className="card-glass" style={{ padding: '16px 20px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212,184,120,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4b878', fontSize: '12px' }}>{post.nickname[0]}</div>
                      <span style={{ color: '#d4b878', fontSize: '13px', fontWeight: 500 }}>{post.nickname}</span>
                      <span style={{ background: 'rgba(212,184,120,0.08)', color: 'rgba(248,246,240,0.5)', fontSize: '10px', padding: '2px 8px', borderRadius: '4px' }}>#{post.tag}</span>
                    </div>
                    <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>{post.time}</span>
                  </div>
                  <p style={{ color: 'rgba(242,232,208,0.8)', fontSize: '13px', lineHeight: '1.8', margin: 0, marginBottom: '10px' }}>{post.text}</p>
                  <button
                    onClick={() => !hasLiked && handleLike(post.id)}
                    disabled={hasLiked}
                    style={{ color: hasLiked ? 'rgba(212,184,120,0.8)' : 'rgba(212,184,120,0.4)', fontSize: '11px', cursor: hasLiked ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit' }}
                    title={hasLiked ? '已赞' : '点赞'}
                  >{hasLiked ? '♥' : '♡'} {post.likes}</button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
