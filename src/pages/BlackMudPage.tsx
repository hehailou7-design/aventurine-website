import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'

// ============ 类型定义 ============
interface BlackmudPost {
  id: string
  nickname: string
  text: string
  tag: string
  time: string
  likes: number
  createdAt: string
}

// ============ 本地存储 ============
const POSTS_KEY = 'aventurine_blackmud_posts'
const NICKNAME_KEY = 'aventurine_blackmud_nickname'
const LIKED_KEY = 'aventurine_blackmud_liked'
const CLIENT_ID_KEY = 'aventurine_client_id'

function getClientId(): string {
  let id = localStorage.getItem(CLIENT_ID_KEY)
  if (!id) {
    id = 'client_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    localStorage.setItem(CLIENT_ID_KEY, id)
  }
  return id
}

function loadPosts(): BlackmudPost[] {
  try { return JSON.parse(localStorage.getItem(POSTS_KEY) || '[]') }
  catch { return [] }
}
function savePosts(posts: BlackmudPost[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}
function loadLiked(): string[] {
  try { return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]') }
  catch { return [] }
}
function saveLiked(ids: string[]) {
  localStorage.setItem(LIKED_KEY, JSON.stringify(ids))
}
function loadNickname(): string {
  return localStorage.getItem(NICKNAME_KEY) || ''
}
function saveNickname(n: string) {
  localStorage.setItem(NICKNAME_KEY, n)
}

const tags = ['全部', '抽卡', '线下', '周边', '剧情', '游戏']

// ============ 主组件 ============
export default function BlackMudPage() {
  const { t } = useLang()

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

  // 点赞记录
  const [likedPosts, setLikedPosts] = useState<string[]>(loadLiked)

  const filtered = activeFilter === '全部' ? posts : posts.filter(p => p.tag === activeFilter)

  // 发帖
  const handlePost = () => {
    if (!newText.trim()) return
    if (!nickname.trim()) {
      // 没设置昵称时强制弹出昵称编辑
      setEditingNickname(true)
      return
    }
    const newPost: BlackmudPost = {
      id: 'post_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      nickname: nickname.trim(),
      text: newText.trim(),
      tag: selectedTag || '其他',
      time: '刚刚',
      likes: 0,
      createdAt: new Date().toISOString(),
    }
    const next = [newPost, ...posts]
    setPosts(next)
    savePosts(next)
    setNewText('')
    setSelectedTag('')
  }

  // 点赞（同客户端只能点一次）
  const handleLike = (postId: string) => {
    if (likedPosts.includes(postId)) return
    const nextPosts = posts.map(p =>
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    )
    setPosts(nextPosts)
    savePosts(nextPosts)
    const nextLiked = [...likedPosts, postId]
    setLikedPosts(nextLiked)
    saveLiked(nextLiked)
  }

  // 保存昵称
  const submitNickname = () => {
    const n = localNickname.trim()
    if (n) {
      setNickname(n)
      saveNickname(n)
      setNicknameSaved(true)
    }
    setEditingNickname(false)
  }

  // 更新相对时间
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

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h2 className="section-title">{t('vent_board')}</h2>
          <div style={{
            background: 'rgba(212,184,120,0.06)',
            border: '1px solid rgba(212,184,120,0.2)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ color: '#d4b878', fontSize: '16px' }}>💬</span>
            <span style={{ color: 'rgba(248,246,240,0.7)', fontSize: '12px', lineHeight: '1.6' }}>
              {t('vent_notice')} · 理性吐槽，建设性意见优先。每个设备对每条留言仅可点赞一次。
            </span>
          </div>
        </div>

        {/* 昵称设置 / 快速切换 */}
        <div className="card-glass" style={{
          padding: '12px 16px', marginBottom: '16px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(212,184,120,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#d4b878', fontSize: '14px',
            }}>
              {nickname ? nickname[0] : '?'}
            </div>
            {editingNickname ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  value={localNickname}
                  onChange={e => setLocalNickname(e.target.value)}
                  placeholder="你的昵称"
                  autoFocus
                  maxLength={12}
                  onKeyDown={e => { if (e.key === 'Enter') submitNickname() }}
                  style={{
                    background: 'rgba(14,14,14,0.8)',
                    border: '1px solid rgba(212,184,120,0.4)',
                    borderRadius: '6px', padding: '6px 10px',
                    color: '#f2e8d0', fontSize: '13px', width: '140px',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={submitNickname}
                  className="btn-gold" style={{ fontSize: '11px', padding: '5px 12px' }}
                >
                  保存
                </button>
                <button
                  onClick={() => { setEditingNickname(false); setLocalNickname(nickname) }}
                  style={{
                    background: 'transparent', border: '1px solid rgba(212,184,120,0.2)',
                    borderRadius: '6px', padding: '5px 10px', color: 'rgba(248,246,240,0.4)',
                    fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  取消
                </button>
              </div>
            ) : (
              <>
                <span style={{ color: '#d4b878', fontSize: '13px', fontWeight: 500 }}>
                  {nickname || '未设置昵称'}
                </span>
                <button
                  onClick={() => { setEditingNickname(true); setLocalNickname(nickname) }}
                  style={{
                    background: 'transparent', border: 'none',
                    color: 'rgba(248,246,240,0.35)', fontSize: '11px',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  ✎ 修改
                </button>
              </>
            )}
          </div>
          {!nicknameSaved && !editingNickname && (
            <span style={{ color: 'rgba(248,246,240,0.35)', fontSize: '11px' }}>
              请先设置昵称再发帖
            </span>
          )}
        </div>

        {/* Post input */}
        <div className="card-glass" style={{ padding: '20px', marginBottom: '24px', borderRadius: '10px' }}>
          <div style={{ color: '#d4b878', fontSize: '13px', marginBottom: '12px', fontWeight: 500 }}>
            有话要说？
          </div>
          <textarea
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="理性吐槽，建设性意见优先..."
            maxLength={500}
            style={{
              width: '100%', minHeight: '80px',
              background: 'rgba(14,14,14,0.8)',
              border: '1px solid rgba(212,184,120,0.25)',
              borderRadius: '8px', padding: '12px',
              color: '#f2e8d0', fontSize: '13px',
              resize: 'vertical', outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {tags.filter(t => t !== '全部').map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  style={{
                    padding: '4px 10px', fontSize: '11px',
                    borderRadius: '12px', cursor: 'pointer',
                    background: selectedTag === tag ? 'rgba(212,184,120,0.15)' : 'transparent',
                    border: '1px solid ' + (selectedTag === tag ? 'rgba(212,184,120,0.4)' : 'rgba(212,184,120,0.15)'),
                    color: selectedTag === tag ? '#d4b878' : 'rgba(248,246,240,0.5)',
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <button onClick={handlePost} className="btn-gold" style={{ fontSize: '12px', padding: '8px 18px' }}>
              发布
            </button>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              style={{
                padding: '5px 14px', fontSize: '12px',
                borderRadius: '20px', cursor: 'pointer',
                background: activeFilter === tag ? 'rgba(212,184,120,0.15)' : 'transparent',
                border: '1px solid ' + (activeFilter === tag ? 'rgba(212,184,120,0.4)' : 'rgba(212,184,120,0.15)'),
                color: activeFilter === tag ? '#d4b878' : 'rgba(248,246,240,0.5)',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Posts */}
        {filtered.length === 0 ? (
          <div className="card-glass" style={{
            padding: '40px 20px', borderRadius: '10px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍀</div>
            <div style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px' }}>
              还没有留言，来做第一个发声的人吧
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((post) => {
              const hasLiked = likedPosts.includes(post.id)
              return (
                <div key={post.id} className="card-glass" style={{ padding: '16px 20px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: 'rgba(212,184,120,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#d4b878', fontSize: '12px',
                      }}>
                        {post.nickname[0]}
                      </div>
                      <span style={{ color: '#d4b878', fontSize: '13px', fontWeight: 500 }}>{post.nickname}</span>
                      <span style={{
                        background: 'rgba(212,184,120,0.08)',
                        color: 'rgba(248,246,240,0.5)',
                        fontSize: '10px', padding: '2px 8px', borderRadius: '4px',
                      }}>
                        #{post.tag}
                      </span>
                    </div>
                    <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>{post.time}</span>
                  </div>
                  <p style={{ color: 'rgba(242,232,208,0.8)', fontSize: '13px', lineHeight: '1.8', margin: 0, marginBottom: '10px' }}>
                    {post.text}
                  </p>
                  <button
                    onClick={() => !hasLiked && handleLike(post.id)}
                    disabled={hasLiked}
                    style={{
                      color: hasLiked ? 'rgba(212,184,120,0.8)' : 'rgba(212,184,120,0.4)',
                      fontSize: '11px', cursor: hasLiked ? 'default' : 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      background: 'none', border: 'none', padding: 0, fontFamily: 'inherit',
                      transition: 'color 0.2s',
                    }}
                    title={hasLiked ? '你已经赞过了' : '点赞'}
                  >
                    {hasLiked ? '♥' : '♡'} {post.likes}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
