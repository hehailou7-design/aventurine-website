import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'

export default function CharacterPage() {
  const { lang } = useLang()
  const { content, updateContent } = useContent()
  const [activeTab, setActiveTab] = useState<string>('profile')
  const zh = lang === 'zh'

  const tabs = [
    { key: 'profile', label: zh ? '角色档案' : 'Profile' },
    { key: 'attributes', label: zh ? '属性数据' : 'Attributes' },
    { key: 'skills', label: zh ? '战斗技能' : 'Skills' },
    { key: 'traces', label: zh ? '行迹' : 'Traces' },
    { key: 'eidolons', label: zh ? '星魂' : 'Eidolons' },
    { key: 'materials', label: zh ? '培养材料' : 'Materials' },
    { key: 'positioning', label: zh ? '角色定位' : 'Positioning' },
    { key: 'stories', label: zh ? '角色故事' : 'Stories' },
    { key: 'voices', label: zh ? '角色语音' : 'Voices' },
  ]

  const renderTabContent = () => {
    const profileBoxes = content.character.profileBoxes || []
    const wikiData = (window as any).__wikiData || getWikiData()
    const voices = content.character.voices && content.character.voices.length > 0
      ? content.character.voices
      : wikiData.voices

    switch (activeTab) {
      case 'profile':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {profileBoxes.length === 0 && (
              <div style={{ color: 'rgba(242,232,208,0.5)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>
                {zh ? '暂无角色设定数据，请在后台管理中添加。' : 'No profile data yet. Please add from admin panel.'}
              </div>
            )}
            {profileBoxes.map((box: any) => (
              <div key={box.id} style={{
                background: box.background || 'rgba(212,184,120,0.05)',
                border: box.border || '1px solid rgba(212,184,120,0.15)',
                borderRadius: `${(box.borderRadius !== undefined ? box.borderRadius : 10)}px`,
                padding: '16px 20px',
              }}>
                {box.title && (
                  <div style={{
                    color: box.titleColor || '#d4b878',
                    fontSize: `${(box.titleFontSize !== undefined ? box.titleFontSize : 12)}px`,
                    fontWeight: 600,
                    marginBottom: '12px',
                  }}>{box.title}</div>
                )}
                <div style={{
                  display: box.layout === 'grid' ? 'grid' : 'block',
                  gridTemplateColumns: box.layout === 'grid' ? 'repeat(auto-fit, minmax(220px, 1fr))' : undefined,
                  gap: '10px',
                }}>
                  {box.fields && box.fields.map((field: any) => (
                    <div key={field.id} style={{
                      marginBottom: box.layout === 'list' ? '10px' : 0,
                      textAlign: (field.textAlign || 'left') as any,
                    }}>
                      {field.type === 'image' ? (
                        /* 图片字段 */
                        <div>
                          <div style={{
                            color: field.labelColor || 'rgba(242,232,208,0.9)',
                            fontSize: `${(field.fontSize !== undefined ? field.fontSize : 13)}px`,
                            fontWeight: (field.fontWeight || 'normal') as any,
                            fontStyle: (field.fontStyle || 'normal') as any,
                            marginBottom: '6px',
                          }}>{field.label}</div>
                          {field.image && (
                            <img 
                              src={field.image} 
                              alt={field.label} 
                              style={{ 
                                maxWidth: '100%', 
                                maxHeight: '300px', 
                                borderRadius: '8px',
                                marginTop: '4px',
                              }} 
                            />
                          )}
                        </div>
                      ) : (
                        /* 文本字段 */
                        <>
                          <strong style={{
                            color: field.labelColor || 'rgba(242,232,208,0.9)',
                            fontSize: `${(field.fontSize !== undefined ? field.fontSize : 13)}px`,
                            fontWeight: (field.fontWeight || 'normal') as any,
                            fontStyle: (field.fontStyle || 'normal') as any,
                            marginRight: '6px',
                          }}>{field.label}：</strong>
                          <span style={{
                            color: field.valueColor || 'rgba(242,232,208,0.9)',
                            fontSize: `${(field.fontSize !== undefined ? field.fontSize : 13)}px`,
                            fontWeight: (field.fontWeight || 'normal') as any,
                            fontStyle: (field.fontStyle || 'normal') as any,
                          }}>{field.value}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      case 'attributes':
        const attr = wikiData.attributes
        return (
          <div>
            <div style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '16px 20px', marginBottom: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div><strong>{zh ? '基础速度：' : 'Base Speed: '}</strong>{attr.baseSpeed}</div>
              <div><strong>{zh ? '能量上限：' : 'Energy: '}</strong>{attr.energy}</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: 'rgba(212,184,120,0.1)' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid rgba(212,184,120,0.2)' }}>{zh ? '等级' : 'Level'}</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid rgba(212,184,120,0.2)' }}>{zh ? '生命值' : 'HP'} ({zh ? '突破前/后' : 'Pre/Post'})</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid rgba(212,184,120,0.2)' }}>{zh ? '攻击力' : 'ATK'} ({zh ? '突破前/后' : 'Pre/Post'})</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid rgba(212,184,120,0.2)' }}>{zh ? '防御力' : 'DEF'} ({zh ? '突破前/后' : 'Pre/Post'})</th>
                  </tr>
                </thead>
                <tbody>
                  {attr.levels.map((lv: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(212,184,120,0.08)' }}>
                      <td style={{ padding: '9px 12px', color: '#d4b878' }}>{lv.level}</td>
                      <td style={{ padding: '9px 12px' }}>{lv.hp[0]}{lv.hp[1] > 0 ? ` / ${lv.hp[1]}` : ''}</td>
                      <td style={{ padding: '9px 12px' }}>{lv.atk[0]}{lv.atk[1] > 0 ? ` / ${lv.atk[1]}` : ''}</td>
                      <td style={{ padding: '9px 12px' }}>{lv.def[0]}{lv.def[1] > 0 ? ` / ${lv.def[1]}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'skills':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {wikiData.skillList.map((skill: any, i: number) => (
              <div key={i} style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(212,184,120,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{skill.type === 'basic' ? '①' : skill.type === 'skill' ? '②' : skill.type === 'ult' ? '③' : skill.type === 'talent' ? '④' : '⑤'}</div>
                  <div>
                    <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600 }}>{zh ? skill.name : skill.nameEn}</div>
                    <div style={{ color: 'rgba(248,246,240,0.4)', fontSize: '11px' }}>{skill.type}</div>
                  </div>
                </div>
                <p style={{ color: 'rgba(242,232,208,0.7)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>{skill.desc}</p>
              </div>
            ))}
          </div>
        )
      case 'traces':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {wikiData.traceList.map((trace: any, i: number) => (
              <div key={i} style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: trace.unlocked ? 'rgba(212,184,120,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (trace.unlocked ? 'rgba(212,184,120,0.4)' : 'rgba(255,255,255,0.1)'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: trace.unlocked ? '#d4b878' : 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{trace.unlocked ? '✓' : ''}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{trace.name}</div>
                  <p style={{ color: 'rgba(242,232,208,0.6)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>{trace.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )
      case 'eidolons':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {wikiData.eidolonList.map((e: any, i: number) => (
              <div key={i} style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '14px 16px' }}>
                <div style={{ color: '#d4b878', fontSize: '11px', marginBottom: '6px' }}>{zh ? '星魂' : 'Eidolon'} {e.level}</div>
                <div style={{ color: '#f2e8d0', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{e.name}</div>
                <p style={{ color: 'rgba(242,232,208,0.7)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        )
      case 'materials':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{zh ? '技能升级材料' : 'Skill Upgrade Materials'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {wikiData.skillMaterials.map((m: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#d4b878', fontSize: '11px', minWidth: '60px' }}>{m.level}</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {m.materials.map((mat: any, j: number) => (
                        <span key={j} style={{ background: 'rgba(212,184,120,0.1)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>{mat.name} ×{mat.count}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ color: '#d4b878', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{zh ? '角色晋阶材料' : 'Ascension Materials'}</div>
              <div style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px' }}>
                <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '8px' }}>{zh ? '满晋阶总计' : 'Total for Max Ascension'}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(wikiData.ascensionMaterials.total).map(([name, count]: any, i: number) => (
                    <span key={i} style={{ background: 'rgba(212,184,120,0.1)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>{name} ×{count}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {wikiData.ascensionMaterials.stages.map((s: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: '#d4b878', fontSize: '11px', minWidth: '60px' }}>{s.level}</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {s.materials.map((mat: any, j: number) => (
                        <span key={j} style={{ background: 'rgba(212,184,120,0.1)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px' }}>{mat.name} ×{mat.count}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'positioning':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ color: '#d4b878', fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>{zh ? '角色定位' : 'Character Positioning'}</div>
              <p style={{ color: 'rgba(242,232,208,0.8)', fontSize: '13px', lineHeight: 1.8, margin: 0 }}>{wikiData.positioning}</p>
            </div>
            <div style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ color: '#d4b878', fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>{zh ? '角色标签' : 'Character Tags'}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {wikiData.tags.map((tag: string, i: number) => (
                  <span key={i} style={{ background: 'rgba(212,184,120,0.15)', border: '1px solid rgba(212,184,120,0.3)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', color: '#d4b878' }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ color: '#d4b878', fontSize: '12px', fontWeight: 600, marginBottom: '10px' }}>{zh ? '星魂标签' : 'Eidolon Tags'}</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {wikiData.eidolonTags.map((tag: string, i: number) => (
                  <span key={i} style={{ background: 'rgba(212,184,120,0.1)', border: '1px solid rgba(212,184,120,0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', color: 'rgba(242,232,208,0.7)' }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )
      case 'stories':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {wikiData.stories.map((s: any, i: number) => (
              <div key={i} style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '16px 20px' }}>
                <div style={{ color: '#d4b878', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>{s.title}</div>
                <p style={{ color: 'rgba(242,232,208,0.8)', fontSize: '13px', lineHeight: 1.8, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        )
      case 'voices':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {voices.map((v: any, i: number) => (
              <div key={i} style={{ background: 'rgba(212,184,120,0.05)', border: '1px solid rgba(212,184,120,0.15)', borderRadius: '10px', padding: '12px 16px' }}>
                <div style={{ color: 'rgba(248,246,240,0.5)', fontSize: '11px', marginBottom: '4px' }}>{v.trigger}</div>
                <p style={{ color: 'rgba(242,232,208,0.8)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{v.text}</p>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  // wikiData 作为 fallback
  function getWikiData() {
    const data = {
      attributes: {
        baseSpeed: 106,
        energy: 110,
        levels: [
          { level: 1, hp: [163, 0], atk: [60, 0], def: [89, 0] },
          { level: 20, hp: [319, 384], atk: [118, 142], def: [173, 209] },
          { level: 30, hp: [466, 531], atk: [173, 197], def: [253, 289] },
          { level: 40, hp: [613, 679], atk: [227, 251], def: [334, 369] },
          { level: 50, hp: [761, 826], atk: [282, 306], def: [414, 449] },
          { level: 60, hp: [908, 973], atk: [336, 361], def: [494, 530] },
          { level: 70, hp: [1055, 1121], atk: [391, 415], def: [574, 610] },
          { level: 80, hp: [1203, 0], atk: [446, 0], def: [654, 0] },
        ]
      },
      skillList: [
        { name: '直观投注', nameEn: 'Straight Bet', type: 'basic', desc: '对指定敌方单体造成等同于砂金50%防御力的虚数属性伤害。', icon: '' },
        { name: '繁荣基石', nameEn: 'Cornerstone Deluxe', type: 'skill', desc: '为我方全体提供可抵消伤害的护盾【坚垣筹码】，护盾量基于砂金防御力，持续3回合。', icon: '' },
        { name: '轮盘勋爵', nameEn: 'Roulette Lord', type: 'ult', desc: '随机获得1-7点【盲注】，使指定敌方单体陷入【惊惶】状态（持续3回合），并造成等同于砂金防御力162%的虚数属性伤害；我方目标击中【惊惶】状态下的敌方时，暴击伤害提高。', icon: '' },
        { name: '枪口以右', nameEn: 'Right of the Barrel', type: 'talent', desc: '持有【坚垣筹码】的我方单体效果抵抗提高，受到攻击后砂金获得【盲注】；【盲注】达到7点后，砂金消耗7点充能发动追加攻击。', icon: '' },
        { name: '红黑之间', nameEn: 'Between Red and Black', type: 'technique', desc: '使用秘技后随机获得以下1种效果：大概率防御力提高36%、小概率防御力提高60%、一定概率防御力提高24%；下一次战斗开始时，使我方全体获得对应数值的防御力提升，持续3回合。', icon: '' },
      ],
      eidolonList: [
        { level: 1, name: '囚徒博弈', desc: '持有【坚垣筹码】的我方目标暴击伤害提高20%；施放终结技后，为我方全体提供护盾【坚垣筹码】，护盾量等同于战技提供护盾量的100%，持续3回合。', icon: '' },
        { level: 2, name: '有限理性', desc: '施放普攻时使目标的全属性抗性降低12%，持续3回合。', icon: '' },
        { level: 3, name: '最高倍率', desc: '终结技等级+2（最多不超过15级）；普攻等级+1（最多不超过10级）。', icon: '' },
        { level: 4, name: '意外绞刑', desc: '触发天赋的追加攻击时，先使砂金防御力提高40%，持续2回合，且追加攻击额外增加3段攻击段数。', icon: '' },
        { level: 5, name: '模糊厌恶', desc: '战技等级+2（最多不超过15级）；天赋等级+2（最多不超过15级）。', icon: '' },
        { level: 6, name: '猎鹿游戏', desc: '每有1个队友持有护盾，砂金造成的伤害提高50%，最高不超过150%。', icon: '' },
      ],
      traceList: [
        { name: '杠杆', desc: '若砂金防御力高于1600点，每超过100点防御力可使自身暴击率提高2%，最多提高48%。', unlocked: true },
        { name: '热手', desc: '战斗开始时，为我方全体提供护盾【坚垣筹码】，护盾量等同于战技提供护盾量的100%，持续3回合。', unlocked: true },
        { name: '宾果！', desc: '持有【坚垣筹码】的队友发动追加攻击后，为砂金积攒1点【盲注】（最多触发3次）；砂金发动天赋追加攻击后，为我方全体提供【坚垣筹码】。', unlocked: true },
      ],
      stories: [
        { level: 20, title: zh ? '角色故事·一' : 'Character Story 1', body: zh ? '通过公司内部的投诉事件，展现了砂金入职时的争议：他曾欺骗市场开拓部在茨冈尼亚投入资金、哄骗博识学会相信茨冈尼亚埋藏虫皇尸体、被茨冈尼亚酋长国谴责破坏氏族和平，但公司高层认为他的价值大于风险，决定接纳他加入战略投资部。' : 'Aventurine\'s controversial recruitment to the Strategic Investment Department...' },
        { level: 40, title: zh ? '角色故事·二' : 'Character Story 2', body: zh ? '砂金前往伊伊玛尼喀处理资产清算，被当地首领「疯牛」用俄罗斯轮盘赌挑衅，砂金在六次枪响后毫发无损，揭穿了「疯牛」和外部势力勾结的阴谋，随后翡翠出现，告知他这只是公司对他的测试，并赠予他砂金石。' : 'Aventurine travels to Iimani\'ka to handle asset liquidation...' },
        { level: 60, title: zh ? '角色故事·三' : 'Character Story 3', body: zh ? '砂金成功完成清算任务回到公司，正式获得象征权力的「砂金石」，但得知茨冈尼亚的埃维金人已经全部消亡，曾经帮助过他的人也都不在了，他对自己的人生意义产生了迷茫。' : 'After successfully completing the liquidation mission...' },
        { level: 80, title: zh ? '角色故事·四' : 'Character Story 4', body: zh ? '公司安排砂金前往匹诺康尼处理历史坏账，砂金明白这是「钻石」对他的考验，也意识到自己一直在用幸运赌人生，这次或许要为自己一直的幸运付出代价，但他也甘之如饴，期待和命运的对赌。' : 'The company assigns Aventurine to handle historical bad debts in Penacony...' },
      ],
      voices: [
        { trigger: zh ? '初次见面' : 'First Meeting', text: zh ? '不才「砂金」，隶属星际和平公司战略投资部，不良资产清算专家之一…当然，也可以是你的朋友。' : 'Aventurine, at your service. Strategic Investment Department, Interastral Peace Corporation...' },
        { trigger: zh ? '问候' : 'Greeting', text: zh ? '要不要来玩一把？最简单的猜硬币，看看今天运气如何？' : 'Care for a game? A simple coin toss to see how luck treats us today?' },
        { trigger: zh ? '道别' : 'Farewell', text: zh ? '方才的交易愉快么？目光放长远些，这会是一次双赢的选择。' : 'Was that transaction to your liking? Think long-term — this will be a win-win choice.' },
        { trigger: zh ? '星魂激活' : 'Eidolon Activation', text: zh ? '给我一颗骰子，便能扭转胜负。' : 'Give me a single die, and I can turn the tide.' },
        { trigger: zh ? '战斗开始' : 'Battle Start', text: zh ? '骰子已经掷下。' : 'The die is cast.' },
        { trigger: zh ? '终结技' : 'Ultimate', text: zh ? '一无所有？或者，赢下所有！' : 'Everything, or nothing at all!' },
        { trigger: zh ? '无法战斗' : 'Defeated', text: zh ? '满盘皆输啊…' : 'A total loss, it seems...' },
        { trigger: zh ? '战斗胜利' : 'Victory', text: zh ? '理所当然的胜利。' : 'A victory as expected.' },
      ],
      skillMaterials: [
        { level: '1→2', materials: [{ name: '思绪末屑', count: 3 }, { name: '信用点', count: '2500' }] },
        { level: '2→3', materials: [{ name: '散逸星砂', count: 3 }, { name: '思绪末屑', count: 6 }, { name: '信用点', count: '5000' }] },
        { level: '3→4', materials: [{ name: '流星棱晶', count: 3 }, { name: '印象残晶', count: 3 }, { name: '信用点', count: '10000' }] },
        { level: '4→5', materials: [{ name: '流星棱晶', count: 5 }, { name: '印象残晶', count: 4 }, { name: '信用点', count: '20000' }] },
        { level: '5→6', materials: [{ name: '流星棱晶', count: 7 }, { name: '印象残晶', count: 6 }, { name: '信用点', count: '30000' }] },
        { level: '6→7', materials: [{ name: '神体琥珀', count: 3 }, { name: '欲念碎镜', count: 3 }, { name: '信用点', count: '45000' }] },
        { level: '7→8', materials: [{ name: '蛀星孕灾的旧恶', count: 1 }, { name: '神体琥珀', count: 5 }, { name: '欲念碎镜', count: 4 }, { name: '信用点', count: '80000' }] },
        { level: '8→9', materials: [{ name: '命运的足迹', count: 1 }, { name: '蛀星孕灾的旧恶', count: 1 }, { name: '神体琥珀', count: 8 }, { name: '信用点', count: '160000' }] },
        { level: '9→10', materials: [{ name: '命运的足迹', count: 1 }, { name: '蛀星孕灾的旧恶', count: 1 }, { name: '神体琥珀', count: 14 }, { name: '信用点', count: '300000' }] },
      ],
      ascensionMaterials: {
        total: { '镇灵敕符': 65, '思绪末屑': 15, '印象残晶': 15, '欲念碎镜': 15, '信用点': 308000 },
        stages: [
          { level: '20级', materials: [{ name: '思绪末屑', count: 5 }, { name: '信用点', count: 4000 }] },
          { level: '30级', materials: [{ name: '思绪末屑', count: 10 }, { name: '信用点', count: 8000 }] },
          { level: '40级', materials: [{ name: '镇灵敕符', count: 3 }, { name: '印象残晶', count: 6 }, { name: '信用点', count: 16000 }] },
          { level: '50级', materials: [{ name: '镇灵敕符', count: 7 }, { name: '印象残晶', count: 9 }, { name: '信用点', count: 40000 }] },
          { level: '60级', materials: [{ name: '镇灵敕符', count: 20 }, { name: '欲念碎镜', count: 6 }, { name: '信用点', count: 80000 }] },
          { level: '70级', materials: [{ name: '镇灵敕符', count: 35 }, { name: '欲念碎镜', count: 9 }, { name: '信用点', count: 160000 }] },
        ]
      },
      positioning: zh ? '砂金是一名能够为我方全体提供可叠加护盾量【坚垣筹码】、并提高我方效果抵抗的防御型角色。此外，砂金还可通过多种手段获得充能点【盲注】，触发追加攻击，兼顾一定的输出能力。' : 'Aventurine is a defense-type character who can provide stackable shields [Fortified Wager] to all allies and increase effect resistance. Additionally, Aventurine can gain energy points [Blind Bet] through various means to trigger follow-up attacks, while also dealing decent damage.',
      tags: [zh ? '群体护盾' : 'Group Shield', zh ? '护盾叠加' : 'Shield Stacking', zh ? '随机' : 'Random', zh ? '暴伤提升' : 'Crit DMG Boost', zh ? '效果抵抗提升' : 'Effect RES Boost', zh ? '控制抵抗' : 'CC Resistance', zh ? '追加攻击' : 'Follow-up', zh ? '加防' : 'DEF Up', zh ? '暴击率' : 'Crit Rate'],
      eidolonTags: [zh ? '减抗' : 'RES Down', zh ? '防御力提升' : 'DEF Up', zh ? '攻击段数提升' : 'Hit Count Up', zh ? '自身伤害提升' : 'Self DMG Up'],
    }
    ;(window as any).__wikiData = data
    return data
  }

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="section-title">角色设定 · Character Profile</h2>
        <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '12px', marginBottom: '24px', marginTop: '-8px' }}>
          {zh ? '完整角色档案 · 技能数据 · 语音收录' : 'Complete Character Profile · Skill Data · Voice Collection'}
        </p>

        {/* Tab navigation */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '28px',
          background: 'rgba(26,26,26,0.8)',
          border: '1px solid rgba(212,184,120,0.2)',
          borderRadius: '10px',
          padding: '4px',
          flexWrap: 'wrap',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '9px 6px',
                fontSize: '12px',
                borderRadius: '7px',
                border: 'none',
                background: activeTab === tab.key ? 'rgba(212,184,120,0.15)' : 'transparent',
                color: activeTab === tab.key ? '#d4b878' : 'rgba(248,246,240,0.5)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                minWidth: '80px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="card-glass" style={{ padding: '24px', borderRadius: '12px' }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}
