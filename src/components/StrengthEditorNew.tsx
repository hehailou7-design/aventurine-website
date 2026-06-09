import { useState } from 'react'
import { useContent } from '../context/ContentContext'

interface StrengthEditorProps {
  content: {
    teamBuilds?: any[]
    relicSets?: any[]
    compareData?: any[]
    comments?: any[]
  }
  onUpdate: (path: string, v: unknown) => void
}

export default function StrengthEditor({ content: initialContent, onUpdate }: StrengthEditorProps) {
  const { content, updateContent } = useContent()
  const strength = content.strength || initialContent || {}
  
  const teamBuilds = strength.teamBuilds || []
  const relicSets = strength.relicSets || []
  const compareData = strength.compareData || []
  const comments = strength.comments || []

  // 添加队伍配置
  const addTeamBuild = () => {
    const newBuild = {
      name: '新队伍配置',
      members: ['砂金'],
      rating: 'A',
      desc: '描述',
      lc: '光锥名称',
      stars: 4,
    }
    updateContent('strength.teamBuilds', [...teamBuilds, newBuild])
  }

  // 删除队伍配置
  const deleteTeamBuild = (index: number) => {
    if (!confirm('确定要删除这个队伍配置吗？')) return
    const next = [...teamBuilds]
    next.splice(index, 1)
    updateContent('strength.teamBuilds', next)
  }

  // 更新队伍配置
  const updateTeamBuild = (index: number, field: string, value: any) => {
    const next = [...teamBuilds]
    next[index] = { ...next[index], [field]: value }
    updateContent('strength.teamBuilds', next)
  }

  // 添加遗器推荐
  const addRelicSet = () => {
    const newRelic = {
      name: '新遗器套装',
      effect: '效果描述',
      score: 80,
    }
    updateContent('strength.relicSets', [...relicSets, newRelic])
  }

  // 删除遗器推荐
  const deleteRelicSet = (index: number) => {
    if (!confirm('确定要删除这个遗器推荐吗？')) return
    const next = [...relicSets]
    next.splice(index, 1)
    updateContent('strength.relicSets', next)
  }

  // 更新遗器推荐
  const updateRelicSet = (index: number, field: string, value: any) => {
    const next = [...relicSets]
    next[index] = { ...next[index], [field]: value }
    updateContent('strength.relicSets', next)
  }

  // 添加对比数据
  const addCompareData = () => {
    const newCompare = {
      char: '新角色',
      dps: 80,
      survival: 80,
      support: 80,
      ease: 80,
      color: '#d4b878',
    }
    updateContent('strength.compareData', [...compareData, newCompare])
  }

  // 删除对比数据
  const deleteCompareData = (index: number) => {
    if (!confirm('确定要删除这个对比数据吗？')) return
    const next = [...compareData]
    next.splice(index, 1)
    updateContent('strength.compareData', next)
  }

  // 更新对比数据
  const updateCompareData = (index: number, field: string, value: any) => {
    const next = [...compareData]
    next[index] = { ...next[index], [field]: value }
    updateContent('strength.compareData', next)
  }

  // 添加评论
  const addComment = () => {
    const newComment = {
      user: '新用户',
      text: '评论内容',
      time: '刚刚',
      likes: 0,
    }
    updateContent('strength.comments', [...comments, newComment])
  }

  // 删除评论
  const deleteComment = (index: number) => {
    if (!confirm('确定要删除这条评论吗？')) return
    const next = [...comments]
    next.splice(index, 1)
    updateContent('strength.comments', next)
  }

  // 更新评论
  const updateComment = (index: number, field: string, value: any) => {
    const next = [...comments]
    next[index] = { ...next[index], [field]: value }
    updateContent('strength.comments', next)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: '#d4b878', fontSize: '14px', margin: 0 }}>强度专区编辑</h3>
      </div>

      <p style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginBottom: '20px' }}>
        在这里管理强度专区的所有内容。可以添加/删除队伍配置、遗器推荐、角色对比数据和评论。
      </p>

      {/* 队伍配置 */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ color: '#d4b878', fontSize: '13px', margin: 0 }}>队伍配置</h4>
          <button
            onClick={addTeamBuild}
            style={{
              background: 'rgba(212,184,120,0.15)',
              border: '1px solid rgba(212,184,120,0.3)',
              color: '#d4b878',
              padding: '4px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            ＋ 添加配置
          </button>
        </div>

        {teamBuilds.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(248,246,240,0.3)', fontSize: '12px' }}>
            暂无队伍配置，点击"添加配置"创建第一个。
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {teamBuilds.map((build: any, i: number) => (
            <div key={i} style={{
              background: 'rgba(212,184,120,0.03)',
              border: '1px solid rgba(212,184,120,0.15)',
              borderRadius: '8px',
              padding: '12px 16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={build.name || ''}
                  onChange={(e) => updateTeamBuild(i, 'name', e.target.value)}
                  style={{
                    flex: 1,
                    background: '#121212',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#f2e8d0',
                    fontSize: '12px',
                    marginRight: '8px',
                  }}
                />
                <button
                  onClick={() => deleteTeamBuild(i)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,100,100,0.3)',
                    color: '#e07070',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '10px',
                  }}
                >
                  删除
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>评级</label>
                  <select
                    value={build.rating || 'A'}
                    onChange={(e) => updateTeamBuild(i, 'rating', e.target.value)}
                    style={{
                      width: '100%',
                      background: '#121212',
                      border: '1px solid rgba(212,184,120,0.3)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      color: '#f2e8d0',
                      fontSize: '11px',
                    }}
                  >
                    <option value="S+">S+</option>
                    <option value="S">S</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>星级</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={build.stars || 4}
                    onChange={(e) => updateTeamBuild(i, 'stars', +e.target.value)}
                    style={{
                      width: '100%',
                      background: '#121212',
                      border: '1px solid rgba(212,184,120,0.3)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      color: '#f2e8d0',
                      fontSize: '11px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>描述</label>
                <textarea
                  value={build.desc || ''}
                  onChange={(e) => updateTeamBuild(i, 'desc', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#121212',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#f2e8d0',
                    fontSize: '11px',
                    minHeight: '50px',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>推荐光锥</label>
                <input
                  type="text"
                  value={build.lc || ''}
                  onChange={(e) => updateTeamBuild(i, 'lc', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#121212',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#f2e8d0',
                    fontSize: '11px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>队伍成员（逗号分隔）</label>
                <input
                  type="text"
                  value={(build.members || []).join(', ')}
                  onChange={(e) => updateTeamBuild(i, 'members', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                  style={{
                    width: '100%',
                    background: '#121212',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#f2e8d0',
                    fontSize: '11px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 遗器推荐 */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ color: '#d4b878', fontSize: '13px', margin: 0 }}>遗器推荐</h4>
          <button
            onClick={addRelicSet}
            style={{
              background: 'rgba(212,184,120,0.15)',
              border: '1px solid rgba(212,184,120,0.3)',
              color: '#d4b878',
              padding: '4px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            ＋ 添加遗器
          </button>
        </div>

        {relicSets.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(248,246,240,0.3)', fontSize: '12px' }}>
            暂无遗器推荐，点击"添加遗器"创建第一个。
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {relicSets.map((relic: any, i: number) => (
            <div key={i} style={{
              background: 'rgba(212,184,120,0.03)',
              border: '1px solid rgba(212,184,120,0.15)',
              borderRadius: '8px',
              padding: '10px 14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={relic.name || ''}
                  onChange={(e) => updateRelicSet(i, 'name', e.target.value)}
                  style={{
                    flex: 1,
                    background: '#121212',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#f2e8d0',
                    fontSize: '12px',
                    marginRight: '8px',
                  }}
                />
                <button
                  onClick={() => deleteRelicSet(i)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,100,100,0.3)',
                    color: '#e07070',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '10px',
                  }}
                >
                  删除
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>效果</label>
                  <input
                    type="text"
                    value={relic.effect || ''}
                    onChange={(e) => updateRelicSet(i, 'effect', e.target.value)}
                    style={{
                      width: '100%',
                      background: '#121212',
                      border: '1px solid rgba(212,184,120,0.3)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      color: '#f2e8d0',
                      fontSize: '11px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>评分</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={relic.score || 80}
                    onChange={(e) => updateRelicSet(i, 'score', +e.target.value)}
                    style={{
                      width: '100%',
                      background: '#121212',
                      border: '1px solid rgba(212,184,120,0.3)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      color: '#f2e8d0',
                      fontSize: '11px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 角色对比数据 */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ color: '#d4b878', fontSize: '13px', margin: 0 }}>角色对比数据</h4>
          <button
            onClick={addCompareData}
            style={{
              background: 'rgba(212,184,120,0.15)',
              border: '1px solid rgba(212,184,120,0.3)',
              color: '#d4b878',
              padding: '4px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            ＋ 添加角色
          </button>
        </div>

        {compareData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(248,246,240,0.3)', fontSize: '12px' }}>
            暂无对比数据，点击"添加角色"创建第一个。
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {compareData.map((char: any, i: number) => (
            <div key={i} style={{
              background: 'rgba(212,184,120,0.03)',
              border: '1px solid rgba(212,184,120,0.15)',
              borderRadius: '8px',
              padding: '10px 14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={char.char || ''}
                  onChange={(e) => updateCompareData(i, 'char', e.target.value)}
                  placeholder="角色名"
                  style={{
                    flex: 1,
                    background: '#121212',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#f2e8d0',
                    fontSize: '12px',
                    marginRight: '8px',
                  }}
                />
                <input
                  type="color"
                  value={char.color || '#d4b878'}
                  onChange={(e) => updateCompareData(i, 'color', e.target.value)}
                  style={{ width: '32px', height: '28px', padding: 0, border: '1px solid rgba(212,184,120,0.3)', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
                />
                <button
                  onClick={() => deleteCompareData(i)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,100,100,0.3)',
                    color: '#e07070',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '10px',
                  }}
                >
                  删除
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>输出</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={char.dps || 80}
                    onChange={(e) => updateCompareData(i, 'dps', +e.target.value)}
                    style={{
                      width: '100%',
                      background: '#121212',
                      border: '1px solid rgba(212,184,120,0.3)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      color: '#f2e8d0',
                      fontSize: '11px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>生存</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={char.survival || 80}
                    onChange={(e) => updateCompareData(i, 'survival', +e.target.value)}
                    style={{
                      width: '100%',
                      background: '#121212',
                      border: '1px solid rgba(212,184,120,0.3)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      color: '#f2e8d0',
                      fontSize: '11px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>辅助</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={char.support || 80}
                    onChange={(e) => updateCompareData(i, 'support', +e.target.value)}
                    style={{
                      width: '100%',
                      background: '#121212',
                      border: '1px solid rgba(212,184,120,0.3)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      color: '#f2e8d0',
                      fontSize: '11px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(248,246,240,0.5)', fontSize: '10px', marginBottom: '3px' }}>易用性</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={char.ease || 80}
                    onChange={(e) => updateCompareData(i, 'ease', +e.target.value)}
                    style={{
                      width: '100%',
                      background: '#121212',
                      border: '1px solid rgba(212,184,120,0.3)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      color: '#f2e8d0',
                      fontSize: '11px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 评论 */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ color: '#d4b878', fontSize: '13px', margin: 0 }}>评论</h4>
          <button
            onClick={addComment}
            style={{
              background: 'rgba(212,184,120,0.15)',
              border: '1px solid rgba(212,184,120,0.3)',
              color: '#d4b878',
              padding: '4px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
            }}
          >
            ＋ 添加评论
          </button>
        </div>

        {comments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(248,246,240,0.3)', fontSize: '12px' }}>
            暂无评论，点击"添加评论"创建第一个。
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {comments.map((comment: any, i: number) => (
            <div key={i} style={{
              background: 'rgba(212,184,120,0.03)',
              border: '1px solid rgba(212,184,120,0.15)',
              borderRadius: '8px',
              padding: '10px 14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={comment.user || ''}
                  onChange={(e) => updateComment(i, 'user', e.target.value)}
                  placeholder="用户名"
                  style={{
                    flex: 1,
                    background: '#121212',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#f2e8d0',
                    fontSize: '12px',
                    marginRight: '8px',
                  }}
                />
                <input
                  type="text"
                  value={comment.time || ''}
                  onChange={(e) => updateComment(i, 'time', e.target.value)}
                  placeholder="时间"
                  style={{
                    width: '100px',
                    background: '#121212',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#f2e8d0',
                    fontSize: '11px',
                    marginRight: '8px',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={() => deleteComment(i)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,100,100,0.3)',
                    color: '#e07070',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '10px',
                  }}
                >
                  删除
                </button>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <textarea
                  value={comment.text || ''}
                  onChange={(e) => updateComment(i, 'text', e.target.value)}
                  placeholder="评论内容"
                  style={{
                    width: '100%',
                    background: '#121212',
                    border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#f2e8d0',
                    fontSize: '11px',
                    minHeight: '50px',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(248,246,240,0.5)', fontSize: '10px' }}>
                  ♡ 点赞数：
                  <input
                    type="number"
                    min={0}
                    value={comment.likes || 0}
                    onChange={(e) => updateComment(i, 'likes', +e.target.value)}
                    style={{
                      width: '60px',
                      background: '#121212',
                      border: '1px solid rgba(212,184,120,0.3)',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      color: '#f2e8d0',
                      fontSize: '11px',
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
