import { useState, useEffect, useCallback } from 'react'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'
import { fetchCloudData, saveCloudData, mergeArrays } from '../services/CloudDataService'

// ============ 雷达图组件 ============
function RadarChart({ data, size = 260 }: { data: { label: string; value: number; max: number }[]; size?: number }) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.38
  const levels = 5

  const getPoint = (index: number, valueFraction: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2
    return {
      x: cx + r * valueFraction * Math.cos(angle),
      y: cy + r * valueFraction * Math.sin(angle),
    }
  }

  const gridPaths = Array.from({ length: levels }, (_, level) => {
    const frac = (level + 1) / levels
    return data.map((_, i) => getPoint(i, frac)).map((p, i, arr) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'
  })

  const axisLinesData = data.map((_, i) => {
    const p = getPoint(i, 1)
    return { x: p.x, y: p.y }
  })

  const dataPoints = data.map((d, i) => getPoint(i, d.value / d.max))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4b878" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#b0a0d8" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {gridPaths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(212,184,120,0.12)" strokeWidth="1" />
      ))}
      {axisLinesData.map((p, i) => {
        const p0 = { x: cx, y: cy }
        return <line key={i} x1={p0.x} y1={p0.y} x2={p.x} y2={p.y} stroke="rgba(212,184,120,0.1)" strokeWidth="1" />
      })}
      <path d={dataPath} fill="url(#radarGrad)" stroke="#d4b878" strokeWidth="2" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#d4b878" stroke="#0e0e0e" strokeWidth="1.5" />
      ))}
      {data.map((d, i) => {
        const p = getPoint(i, 1.15)
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(248,246,240,0.6)" fontSize="10" fontWeight="500">
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}

// ============ 主页面 ============
export default function StrengthPage() {
  const { t, lang } = useLang()
  const { content } = useContent()
  const strength = content.strength || {}
  const zh = lang === 'zh'
  const ja = lang === 'ja'
  const ko = lang === 'ko'

  const eidolonData = strength.eidolonData || []
  const teamBuilds = strength.teamBuilds || []
  const relicSets = strength.relicSets || []
  const compareData = strength.compareData || []

  const [activeTab, setActiveTab] = useState<'overview' | 'build' | 'discuss'>('overview')
  const [selectedCharacter, setSelectedCharacter] = useState('')
  const [newComment, setNewComment] = useState('')
  const [cloudComments, setCloudComments] = useState<any[]>([])
  const [syncStatus, setSyncStatus] = useState<'idle'|'syncing'|'saved'|'error'>('idle')

  // 从云端加载讨论数据
  const loadComments = useCallback(async () => {
    try {
      const cloud = await fetchCloudData()
      const cloudStrengthComments = cloud.strengthComments || []
      const localRaw = localStorage.getItem('aventurine_strength_comments')
      let localComments: any[] = []
      if (localRaw) {
        try { localComments = JSON.parse(localRaw) } catch {}
      }
      const merged = mergeArrays(cloudStrengthComments, localComments)
      setCloudComments(merged)
      localStorage.setItem('aventurine_strength_comments', JSON.stringify(merged))
    } catch (e) {
      console.warn('[Strength] 加载云端讨论失败', e)
    }
  }, [])

  useEffect(() => { loadComments() }, [loadComments])

  // 每8秒自动同步
  useEffect(() => {
    const timer = setInterval(loadComments, 8000)
    return () => clearInterval(timer)
  }, [loadComments])

  const handlePost = async () => {
    if (!newComment.trim()) return
    const userLabel = zh ? '访客' : ja ? 'ゲスト' : ko ? '게스트' : 'Guest'
    const timeLabel = zh ? '刚刚' : ja ? 'たった今' : ko ? '방금' : 'Just now'
    const newItem = {
      id: `sc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      user: userLabel,
      text: newComment.trim(),
      time: timeLabel,
      likes: 0,
      timestamp: Date.now(),
    }
    const updated = [newItem, ...cloudComments]
    setCloudComments(updated)
    localStorage.setItem('aventurine_strength_comments', JSON.stringify(updated))
    setNewComment('')
    setSyncStatus('syncing')

    // 保存到云端
    try {
      const cloud = await fetchCloudData()
      const allComments = [newItem, ...(cloud.strengthComments || [])]
      const unique = mergeArrays(allComments, [])
      await saveCloudData({ ...cloud, strengthComments: unique })
      setSyncStatus('saved')
      setTimeout(() => setSyncStatus('idle'), 3000)
      // 重新加载以确保同步
      setTimeout(loadComments, 2000)
    } catch (e) {
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  const filteredTeams = selectedCharacter
    ? teamBuilds.filter((t: any) => t.members && t.members.includes(selectedCharacter))
    : teamBuilds

  // 角色基础属性
  const baseStats = [
    { label: t('strength_hp') || (zh ? '生命值' : 'HP'), value: 1161, icon: '❤️' },
    { label: t('strength_atk') || (zh ? '攻击力' : 'ATK'), value: 636, icon: '⚔️' },
    { label: t('strength_def') || (zh ? '防御力' : 'DEF'), value: 663, icon: '🛡️' },
    { label: t('strength_spd') || (zh ? '速度' : 'SPD'), value: 101, icon: '💨' },
  ]

  // 战斗定位
  const roles = [
    { name: t('strength_role_pres') || (zh ? '存护' : 'Preservation'), desc: t('strength_role_pres_desc') || (zh ? '团队护盾 / 承伤' : 'Team Shield / Tank'), color: '#d4b878' },
    { name: t('strength_role_img') || (zh ? '虚数' : 'Imaginary'), desc: t('strength_role_img_desc') || (zh ? '虚数属性伤害' : 'Imaginary DMG'), color: '#b0a0d8' },
    { name: t('strength_role_sus') || (zh ? '生存辅助' : 'Sustain'), desc: t('strength_role_sus_desc') || (zh ? '护盾 + 减伤 + 回血' : 'Shield + DR + Heal'), color: '#7ecba1' },
    { name: t('strength_role_sub') || (zh ? '副C' : 'Sub-DPS'), desc: t('strength_role_sub_desc') || (zh ? '护盾反伤 + 追击' : 'Shield Reflect + Follow-up'), color: '#ff8fad' },
  ]

  // 综合评分雷达数据
  const radarData = [
    { label: t('strength_radar_dps') || (zh ? '输出' : 'DPS'), value: 78, max: 100 },
    { label: t('strength_radar_sur') || (zh ? '生存' : 'Sustain'), value: 95, max: 100 },
    { label: t('strength_radar_sup') || (zh ? '辅助' : 'Support'), value: 88, max: 100 },
    { label: t('strength_radar_ease') || (zh ? '易用' : 'Ease'), value: 85, max: 100 },
    { label: t('strength_radar_flex') || (zh ? '泛用' : 'Flex'), value: 92, max: 100 },
    { label: t('strength_radar_val') || (zh ? '性价比' : 'Value'), value: 96, max: 100 },
  ]

  const overallScore = Math.round(radarData.reduce((s, d) => s + d.value, 0) / radarData.length)

  // 技能列表
  const skills = [
    { name: t('strength_skill_ba') || (zh ? '普通攻击·命运筹码' : 'Basic·Fate Chip'), type: t('strength_type_ba') || (zh ? '普攻' : 'Basic'), desc: t('strength_desc_ba') || (zh ? '对指定敌方单体造成等同于砂金攻击力100%的虚数属性伤害，并有概率为砂金自身叠加一层护盾。' : 'Deals Imaginary DMG equal to 100% of ATK to a single enemy, with a chance to stack shield on self.'), multiplier: '100%' },
    { name: t('strength_skill_sk') || (zh ? '战技·直观投注' : 'Skill·All-In Wager'), type: t('strength_type_sk') || (zh ? '战技' : 'Skill'), desc: t('strength_desc_sk') || (zh ? '消耗1点战技点，为我方全体提供等同于砂金防御力50%+若干护盾效果的护盾。砂金手持护盾时，获得额外的效果。' : 'Costs 1 Skill Point. Provides shield to all allies equal to 50% DEF + bonus.'), multiplier: '50%+DEF' },
    { name: t('strength_skill_ul') || (zh ? '终结技·命运轮盘' : 'Ult·Roulette Shutdown'), type: t('strength_type_ul') || (zh ? '终结技' : 'Ult'), desc: t('strength_desc_ul') || (zh ? '对敌方全体造成虚数属性伤害，并有概率施加「易损」效果（受到伤害提高）。消耗7点能量后效果增强。' : 'Deals Imaginary DMG to all enemies, chance to apply Vulnerability.'), multiplier: '150%+AOE' },
    { name: t('strength_skill_ta') || (zh ? '天赋·命运筹码' : 'Talent·Fate\'s Voucher'), type: t('strength_type_ta') || (zh ? '天赋' : 'Talent'), desc: t('strength_desc_ta') || (zh ? '当砂金持有护盾时，普攻对随机敌方造成一次追加攻击伤害。护盾层数越高，追加攻击越强。' : 'When holding a shield, Basic ATK triggers a follow-up attack.'), multiplier: t('strength_multi_follow') || 'Follow-up' },
    { name: t('strength_skill_te') || (zh ? '秘技·命运加注' : 'Technique·Fortune Rising'), type: t('strength_type_te') || (zh ? '秘技' : 'Technique'), desc: t('strength_desc_te') || (zh ? '进入战斗时，砂金获得一定层数的护盾。护盾层数根据消耗战技点的数量决定。' : 'Enters battle with shield stacks determined by consumed Skill Points.'), multiplier: t('strength_multi_pre') || 'Pre-combat' },
  ]

  const tabs = [
    { id: 'overview' as const, label: t('strength_overview') },
    { id: 'build' as const, label: t('strength_build') },
    { id: 'discuss' as const, label: t('strength_discuss') },
  ]

  return (
    <div style={{ padding: '32px 0', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">

        {/* ===== 页面头部 ===== */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div>
            <h1 className="section-title" style={{ marginBottom: '4px', borderLeft: 'none', paddingLeft: 0 }}>
              <span style={{ color: '#d4b878' }}>{t('strength_char_name') || (zh ? '砂金·卡卡瓦夏' : 'Aventurine')}</span>
              <span style={{ color: 'rgba(248,246,240,0.5)', fontSize: '14px', marginLeft: '12px', fontWeight: 400 }}>
                ★★★★★
              </span>
            </h1>
            <p style={{ color: 'rgba(248,246,240,0.5)', fontSize: '13px' }}>
              {t('strength_char_title') || (zh ? '「石心十人」· IPC战略投资部 · 存护 · 虚数' : '「Stoneheart」· IPC Strategic Investment · Preservation · Imaginary')}
            </p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {roles.map(r => (
              <span key={r.name} style={{
                background: `${r.color}15`, color: r.color,
                fontSize: '11px', padding: '4px 12px', borderRadius: '20px',
                border: `1px solid ${r.color}40`,
              }}>
                {r.name} · {r.desc}
              </span>
            ))}
          </div>
        </div>

        {/* ===== Tab 切换 ===== */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', borderBottom: '1px solid rgba(212,184,120,0.15)', paddingBottom: '0' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '10px 24px', fontSize: '13px', fontWeight: 600,
              color: activeTab === tab.id ? '#d4b878' : 'rgba(248,246,240,0.5)',
              background: 'transparent', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid #d4b878' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== 总览 Tab ===== */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px' }} className="grid-cols-1 lg:grid-cols-[340px_1fr]">

            {/* 左栏：评分 + 属性 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 综合评分 */}
              <div className="card-glass" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'rgba(248,246,240,0.4)', marginBottom: '8px', letterSpacing: '0.15em' }}>
                  {t('strength_score')}
                </div>
                <div style={{
                  fontSize: '48px', fontWeight: 800, lineHeight: 1,
                  background: 'linear-gradient(135deg, #d4b878, #f2e8d0)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {overallScore}
                </div>
                <div style={{ fontSize: '12px', color: '#d4b878', marginTop: '4px' }}>Tier S+</div>
                <div style={{ marginTop: '16px' }}>
                  <RadarChart data={radarData} size={220} />
                </div>
              </div>

              {/* 基础属性 */}
              <div className="card-glass" style={{ padding: '20px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(248,246,240,0.4)', marginBottom: '12px', letterSpacing: '0.1em' }}>
                  {t('strength_base_stats')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {baseStats.map(s => (
                    <div key={s.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: 'rgba(248,246,240,0.6)' }}>{s.icon} {s.label}</span>
                        <span style={{ fontSize: '12px', color: '#d4b878', fontWeight: 600 }}>{s.value}</span>
                      </div>
                      <div style={{ height: '3px', background: 'rgba(212,184,120,0.08)', borderRadius: '2px' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, (s.value / 1200) * 100)}%`,
                          background: 'linear-gradient(to right, #d4b878, #f2e8d0)',
                          borderRadius: '2px',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右栏：命座 + 技能 + 强度对比 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* 命座提升 E0-E6 */}
              <div>
                <h2 className="section-title">{t('strength_eidolon')}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {eidolonData.map((e: any, i: number) => (
                    <div key={i} className="card-glass card-hover" style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            background: 'rgba(212,184,120,0.15)', color: '#d4b878',
                            fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                            border: '1px solid rgba(212,184,120,0.3)',
                          }}>
                            {e.title}
                          </span>
                          <span style={{
                            background: e.rating.includes('SSS') ? 'rgba(255,50,50,0.15)' :
                              e.rating.includes('SS') ? 'rgba(255,215,0,0.15)' :
                              e.rating.includes('S+') ? 'rgba(212,184,120,0.15)' :
                              'rgba(176,160,216,0.1)',
                            color: e.rating.includes('SSS') ? '#ff5555' :
                              e.rating.includes('SS') ? '#ffd700' :
                              e.rating.includes('S+') ? '#d4b878' :
                              '#b0a0d8',
                            fontSize: '11px', fontWeight: 700, padding: '2px 10px', borderRadius: '4px',
                            border: `1px solid ${e.rating.includes('SSS') ? 'rgba(255,50,50,0.3)' :
                              e.rating.includes('SS') ? 'rgba(255,215,0,0.3)' :
                              e.rating.includes('S+') ? 'rgba(212,184,120,0.3)' :
                              'rgba(176,160,216,0.2)'}`,
                          }}>
                            {e.rating}
                          </span>
                        </div>
                        {e.improvement > 0 && (
                          <span style={{ color: 'rgba(212,184,120,0.7)', fontSize: '11px', fontWeight: 600 }}>
                            +{e.improvement}%
                          </span>
                        )}
                      </div>
                      <p style={{ color: 'rgba(242,232,208,0.65)', fontSize: '12px', lineHeight: '1.8', margin: 0 }}>
                        {e.desc}
                      </p>
                      {e.improvement > 0 && (
                        <div style={{ marginTop: '10px', height: '3px', background: 'rgba(212,184,120,0.08)', borderRadius: '2px' }}>
                          <div style={{
                            height: '100%', width: `${e.improvement}%`,
                            background: 'linear-gradient(to right, #d4b878, #f2e8d0)',
                            borderRadius: '2px',
                            transition: 'width 0.6s ease',
                          }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 技能列表 */}
              <div>
                <h2 className="section-title">{t('strength_skills')}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {skills.map((s, i) => (
                    <div key={i} className="card-glass" style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            background: s.type === (t('strength_type_ul') || 'Ult') ? 'rgba(255,215,0,0.15)' :
                              s.type === (t('strength_type_sk') || 'Skill') ? 'rgba(212,184,120,0.15)' :
                              s.type === (t('strength_type_ta') || 'Talent') ? 'rgba(176,160,216,0.12)' :
                              'rgba(126,203,161,0.1)',
                            color: s.type === (t('strength_type_ul') || 'Ult') ? '#ffd700' :
                              s.type === (t('strength_type_sk') || 'Skill') ? '#d4b878' :
                              s.type === (t('strength_type_ta') || 'Talent') ? '#b0a0d8' :
                              '#7ecba1',
                            fontSize: '10px', padding: '2px 8px', borderRadius: '3px', fontWeight: 700,
                          }}>
                            {s.type}
                          </span>
                          <span style={{ color: '#f2e8d0', fontSize: '13px', fontWeight: 600 }}>{s.name}</span>
                        </div>
                        <span style={{ color: 'rgba(212,184,120,0.6)', fontSize: '11px' }}>{s.multiplier}</span>
                      </div>
                      <p style={{ color: 'rgba(242,232,208,0.6)', fontSize: '12px', lineHeight: '1.8', margin: 0 }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 强度对比 */}
              {compareData.length > 0 && (
                <div>
                  <h2 className="section-title">{t('strength_compare')}</h2>
                  <div className="card-glass" style={{ padding: '20px' }}>
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
                          {stat === 'dps' ? t('strength_radar_dps') : stat === 'survival' ? t('strength_radar_sur') : stat === 'support' ? t('strength_radar_sup') : t('strength_radar_ease')}
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
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== 配装攻略 Tab ===== */}
        {activeTab === 'build' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="grid-cols-1 md:grid-cols-2">

            {/* 配队推荐 */}
            <div>
              <h2 className="section-title">{t('strength_team')}</h2>
              <div style={{ marginBottom: '16px' }}>
                <select
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px',
                    background: '#121212', border: '1px solid rgba(212,184,120,0.3)',
                    borderRadius: '8px', color: '#f2e8d0', fontSize: '12px',
                  }}
                >
                  <option value="">{t('strength_all_teams')}</option>
                  {(strength.characterList || []).map((char: string, i: number) => (
                    <option key={i} value={char}>{char}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredTeams.length === 0 ? (
                  <div className="card-glass" style={{ padding: '40px', textAlign: 'center', color: 'rgba(248,246,240,0.3)', fontSize: '13px' }}>
                    {t('strength_no_team')}
                  </div>
                ) : filteredTeams.map((build: any, i: number) => (
                  <div key={i} className="card-glass card-hover" style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: '#f2e8d0', fontSize: '14px', fontWeight: 600 }}>{build.name}</span>
                      <span style={{
                        background: build.rating === 'SS' ? 'rgba(255,215,0,0.15)' : build.rating === 'S+' ? 'rgba(212,184,120,0.15)' : 'rgba(176,160,216,0.1)',
                        color: build.rating === 'SS' ? '#ffd700' : build.rating === 'S+' ? '#d4b878' : '#b0a0d8',
                        fontSize: '11px', padding: '2px 10px', borderRadius: '4px', fontWeight: 700,
                        border: `1px solid ${build.rating === 'SS' ? 'rgba(255,215,0,0.3)' : build.rating === 'S+' ? 'rgba(212,184,120,0.3)' : 'rgba(176,160,216,0.2)'}`,
                      }}>
                        {build.rating}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {build.members && build.members.map((m: string) => (
                        <span key={m} style={{
                          background: 'rgba(212,184,120,0.08)', color: 'rgba(248,246,240,0.7)',
                          fontSize: '11px', padding: '3px 10px', borderRadius: '4px',
                          border: '1px solid rgba(212,184,120,0.2)',
                        }}>{m}</span>
                      ))}
                    </div>
                    <p style={{ color: 'rgba(242,232,208,0.6)', fontSize: '12px', lineHeight: '1.8', margin: '0 0 8px' }}>{build.desc}</p>
                    {build.lc && (
                      <div style={{ color: 'rgba(212,184,120,0.6)', fontSize: '11px' }}>
                        🔦 {t('strength_lc_recommend') || (zh ? '推荐光锥：' : 'Light Cone: ')}{build.lc}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 遗器推荐 */}
            <div>
              <h2 className="section-title">{t('strength_relic')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {relicSets.length === 0 ? (
                  <div className="card-glass" style={{ padding: '40px', textAlign: 'center', color: 'rgba(248,246,240,0.3)', fontSize: '13px' }}>
                    {t('strength_no_relic')}
                  </div>
                ) : relicSets.map((relic: any, i: number) => (
                  <div key={i} className="card-glass card-hover" style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ color: '#f2e8d0', fontSize: '13px', fontWeight: 500 }}>{relic.name}</span>
                      <span style={{ color: '#d4b878', fontSize: '14px', fontWeight: 700 }}>{relic.score}</span>
                    </div>
                    <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '12px', marginBottom: '8px' }}>{relic.effect}</div>
                    <div style={{ height: '3px', background: 'rgba(212,184,120,0.08)', borderRadius: '2px' }}>
                      <div style={{
                        height: '100%', width: `${relic.score}%`,
                        background: 'linear-gradient(to right, #d4b878, #f2e8d0)',
                        borderRadius: '2px',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== 讨论 Tab（云端同步）===== */}
        {activeTab === 'discuss' && (
          <div style={{ maxWidth: '700px' }}>
            <h2 className="section-title">{t('strength_discuss')}</h2>
            <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '20px', marginTop: '-8px' }}>
              {t('strength_discuss_hint')}
            </p>

            {/* 同步状态 */}
            {syncStatus !== 'idle' && (
              <div style={{
                padding: '6px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '11px',
                background: syncStatus === 'syncing' ? 'rgba(212,184,120,0.1)' : syncStatus === 'saved' ? 'rgba(126,203,161,0.1)' : 'rgba(255,50,50,0.1)',
                color: syncStatus === 'syncing' ? '#d4b878' : syncStatus === 'saved' ? '#7ecba1' : '#ff5555',
              }}>
                {syncStatus === 'syncing' ? (zh ? '🔄 同步中...' : '🔄 Syncing...') : syncStatus === 'saved' ? (zh ? '✅ 已同步到云端' : '✅ Saved to cloud') : (zh ? '❌ 同步失败' : '❌ Sync failed')}
              </div>
            )}

            <div className="card-glass" style={{ padding: '20px', marginBottom: '24px' }}>
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder={t('strength_discuss_placeholder') || (zh ? '写下你的看法...' : 'Share your thoughts...')}
                style={{
                  width: '100%', minHeight: '80px',
                  background: 'rgba(26,26,26,0.8)', border: '1px solid rgba(212,184,120,0.3)',
                  borderRadius: '8px', padding: '12px',
                  color: '#f2e8d0', fontSize: '13px',
                  resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button className="btn-gold" onClick={handlePost} style={{ fontSize: '12px' }}>
                  {t('strength_post')}
                </button>
              </div>
            </div>

            {/* 讨论列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cloudComments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(248,246,240,0.3)', fontSize: '13px' }}>
                  {t('strength_no_discuss')}
                </div>
              ) : cloudComments.map((c: any, i: number) => (
                <div key={c.id || i} className="card-glass" style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#d4b878', fontSize: '12px', fontWeight: 500 }}>{c.user}</span>
                    <span style={{ color: 'rgba(248,246,240,0.3)', fontSize: '11px' }}>{c.time}</span>
                  </div>
                  <p style={{ color: 'rgba(242,232,208,0.75)', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>{c.text}</p>
                  <div style={{ marginTop: '8px', color: 'rgba(212,184,120,0.5)', fontSize: '11px' }}>♡ {c.likes || 0}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 底部数据来源 */}
        <div style={{
          marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(212,184,120,0.1)',
          textAlign: 'center', color: 'rgba(248,246,240,0.25)', fontSize: '11px', lineHeight: '1.8',
        }}>
          {t('strength_data_source') || (zh ? '数据来源：Project Yatta · HoneyHunterWorld · SRTools · 社区实测' : 'Data Sources: Project Yatta · HoneyHunterWorld · SRTools · Community Testing')}
          <br />
          {zh ? '崩坏：星穹铁道 © HoYoverse / COGNOSPHERE PTE. LTD.' : 'Honkai: Star Rail © HoYoverse / COGNOSPHERE PTE. LTD.'}
        </div>
      </div>
    </div>
  )
}
