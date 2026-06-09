import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'

export default function StrengthPage() {
  const { t } = useLang()
  const { content } = useContent()
  const strength = content.strength || {}
  const zh = t('lang') === 'zh'
  
  const eidolonData = strength.eidolonData || []
  const characterList = strength.characterList || []
  const teamBuilds = strength.teamBuilds || []
  const relicSets = strength.relicSets || []
  const compareData = strength.compareData || []
  const comments = strength.comments || []
  
  const [selectedCharacter, setSelectedCharacter] = useState('')
  const [newComment, setNewComment] = useState('')
  const [localComments, setLocalComments] = useState(comments)

  const handlePost = () => {
    if (!newComment.trim()) return
    setLocalComments(prev => [{
      user: zh ? '访客' : 'Guest',
      text: newComment.trim(),
      time: zh ? '刚刚' : 'Just now',
      likes: 0,
    }, ...prev])
    setNewComment('')
  }

  // 根据选中的角色筛选相关配队
  const filteredTeams = selectedCharacter
    ? teamBuilds.filter((t: any) => t.members && t.members.includes(selectedCharacter))
    : teamBuilds

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        
        {/* E0-E6 命座提升数据 */}
        <h2 className="section-title">{zh ? '命座提升 · E0-E6' : 'Eidolon Improvements · E0-E6'}</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '24px', marginTop: '-8px' }}>
          {zh ? '从基础形态到完全体，砂金每一命的提升详解' : 'From base form to complete form, detailed analysis of each eidolon'}
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {eidolonData.map((e: any, i: number) => (
            <div key={i} className="card-glass" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ color: '#d4b878', fontSize: '14px', fontWeight: 700 }}>{e.title}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    background: e.rating.includes('SS') ? 'rgba(255,215,0,0.2)' : e.rating.includes('S') ? 'rgba(212,184,120,0.2)' : 'rgba(176,160,216,0.15)',
                    color: e.rating.includes('SS') ? '#ffd700' : e.rating.includes('S') ? '#d4b878' : '#b0a0d8',
                    fontSize: '11px', padding: '2px 10px', borderRadius: '4px',
                    border: `1px solid ${e.rating.includes('SS') ? 'rgba(255,215,0,0.4)' : e.rating.includes('S') ? 'rgba(212,184,120,0.4)' : 'rgba(176,160,216,0.3)'}`,
                    fontWeight: 700,
                  }}>
                    {e.rating}
                  </span>
                  {e.improvement > 0 && (
                    <span style={{ color: 'rgba(242,232,208,0.6)', fontSize: '11px' }}>
                      +{e.improvement}%
                    </span>
                  )}
                </div>
              </div>
              <p style={{ color: 'rgba(242,232,208,0.7)', fontSize: '12px', lineHeight: '1.8', margin: 0 }}>
                {e.desc}
              </p>
              {/* 提升进度条 */}
              {e.improvement > 0 && (
                <div style={{ marginTop: '10px', height: '3px', background: 'rgba(212,184,120,0.1)', borderRadius: '2px' }}>
                  <div style={{
                    height: '100%', 
                    width: `${e.improvement}%`,
                    background: 'linear-gradient(to right, #d4b878, #f2e8d0)',
                    borderRadius: '2px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 角色选择与配队推荐 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="grid-cols-1 md:grid-cols-2">
          
          {/* Left Column - Team Builds */}
          <div>
            <h2 className="section-title">{zh ? '配队推荐' : 'Team Builds'}</h2>
            
            {/* 角色选择器 */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '6px' }}>
                {zh ? '选择角色筛选配队：' : 'Select character to filter teams:'}
              </label>
              <select
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#121212',
                  border: '1px solid rgba(212,184,120,0.3)',
                  borderRadius: '8px',
                  color: '#f2e8d0',
                  fontSize: '12px',
                }}
              >
                <option value="">{zh ? '全部配队' : 'All Teams'}</option>
                {characterList.map((char: string, i: number) => (
                  <option key={i} value={char}>{char}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {filteredTeams.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(248,246,240,0.3)', fontSize: '13px' }}>
                  {zh ? '暂无相关配队，请在后台管理中添加。' : 'No related teams yet. Please add from admin panel.'}
                </div>
              ) : (
                filteredTeams.map((build: any, i: number) => (
                  <div key={i} className="card-glass" style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: '#f2e8d0', fontSize: '14px', fontWeight: 600 }}>{build.name}</span>
                      <span style={{
                        background: build.rating === 'S+' ? 'rgba(212,184,120,0.2)' : build.rating === 'SS' ? 'rgba(255,215,0,0.2)' : 'rgba(176,160,216,0.15)',
                        color: build.rating === 'S+' ? '#d4b878' : build.rating === 'SS' ? '#ffd700' : '#b0a0d8',
                        fontSize: '11px', padding: '2px 10px', borderRadius: '4px',
                        border: `1px solid ${build.rating === 'S+' ? 'rgba(212,184,120,0.4)' : build.rating === 'SS' ? 'rgba(255,215,0,0.4)' : 'rgba(176,160,216,0.3)'}`,
                        fontWeight: 700,
                      }}>
                        {build.rating}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {build.members && build.members.map((m: string) => (
                        <span key={m} style={{
                          background: 'rgba(212,184,120,0.08)',
                          color: 'rgba(248,246,240,0.7)',
                          fontSize: '11px', padding: '3px 10px', borderRadius: '4px',
                          border: '1px solid rgba(212,184,120,0.2)',
                        }}>
                          {m}
                        </span>
                      ))}
                    </div>
                    <p style={{ color: 'rgba(242,232,208,0.65)', fontSize: '12px', lineHeight: '1.8', margin: '0 0 8px' }}>
                      {build.desc}
                    </p>
                    {build.lc && (
                      <div style={{ color: 'rgba(212,184,120,0.6)', fontSize: '11px' }}>
                        {zh ? '推荐光锥：' : 'Recommended Light Cone: '}{build.lc}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* 遗器推荐 */}
            <h2 className="section-title">{zh ? '遗器推荐' : 'Relic Recommendations'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {relicSets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(248,246,240,0.3)', fontSize: '13px' }}>
                  {zh ? '暂无遗器数据，请在后台管理中添加。' : 'No relic data yet. Please add from admin panel.'}
                </div>
              ) : (
                relicSets.map((relic: any, i: number) => (
                  <div key={i} className="card-glass" style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ color: '#f2e8d0', fontSize: '13px', fontWeight: 500 }}>{relic.name}</span>
                      <span style={{ color: '#d4b878', fontSize: '14px', fontWeight: 700 }}>{relic.score}</span>
                    </div>
                    <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginBottom: '8px' }}>{relic.effect}</div>
                    {/* Score bar */}
                    <div style={{ height: '3px', background: 'rgba(212,184,120,0.1)', borderRadius: '2px' }}>
                      <div style={{
                        height: '100%', width: `${relic.score}%`,
                        background: 'linear-gradient(to right, #d4b878, #f2e8d0)',
                        borderRadius: '2px',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Comparison & Discussion */}
          <div>
            <h2 className="section-title">{zh ? '强度对比' : 'Strength Comparison'}</h2>
            <div className="card-glass" style={{ padding: '20px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                {compareData.map((c: any) => (
                  <div key={c.char} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: c.color }} />
                    <span style={{ color: 'rgba(248,246,240,0.7)', fontSize: '12px' }}>{c.char}</span>
                  </div>
                ))}
              </div>
              {(['dps', 'survival', 'support', 'ease'] as const).map(stat => (
                <div key={stat} style={{ marginBottom: '12px' }}>
                  <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '6px' }}>
                    {stat === 'dps' ? (zh ? '输出' : 'DPS') : stat === 'survival' ? (zh ? '生存' : 'Survival') : stat === 'support' ? (zh ? '辅助' : 'Support') : (zh ? '易用性' : 'Ease')}
                  </div>
                  {compareData.map((c: any) => (
                    <div key={c.char} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{ width: '36px', color: 'rgba(248,246,240,0.4)', fontSize: '10px' }}>{c.char}</div>
                      <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                        <div style={{
                          height: '100%', width: `${c[stat]}%`,
                          background: c.color,
                          borderRadius: '3px',
                          transition: 'width 0.5s',
                        }} />
                      </div>
                      <div style={{ width: '28px', color: c.color, fontSize: '11px', textAlign: 'right' }}>{c[stat]}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <h2 className="section-title">{zh ? '讨论区' : 'Discussion'}</h2>
            <div style={{ marginBottom: '16px' }}>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder={zh ? '写下你的看法...' : 'Share your thoughts...'}
                style={{
                  width: '100%', minHeight: '80px',
                  background: 'rgba(26,26,26,0.8)',
                  border: '1px solid rgba(212,184,120,0.3)',
                  borderRadius: '8px', padding: '12px',
                  color: '#f2e8d0', fontSize: '13px',
                  resize: 'vertical', outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button className="btn-gold" onClick={handlePost} style={{ fontSize: '12px' }}>
                  {zh ? '发布' : 'Post'}
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {localComments.map((c: any, i: number) => (
                <div key={i} className="card-glass" style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#d4b878', fontSize: '12px', fontWeight: 500 }}>{c.user}</span>
                    <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>{c.time}</span>
                  </div>
                  <p style={{ color: 'rgba(242,232,208,0.75)', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>
                    {c.text}
                  </p>
                  <div style={{ marginTop: '8px', color: 'rgba(212,184,120,0.5)', fontSize: '11px' }}>
                    ♡ {c.likes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
