import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'

export default function EventPage() {
  const { t, lang } = useLang()
  const { content } = useContent()
  const events = content.events as {
    mysteryDesc?: Record<string, string>;
    hangzhouDesc?: Record<string, string>;
    groups?: Record<string, string>;
  } || {}

  const mysteryDesc = events.mysteryDesc || {}
  const hangzhouDesc = events.hangzhouDesc || {}
  const groups = events.groups || {}

  const getVal = (obj: Record<string, string>, fallback: string) => {
    return obj[lang] || obj.zh || fallback
  }

  return (
    <div style={{ padding: '32px 0', minHeight: '100vh' }}>
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">

        {/* 页面标题 */}
        <div style={{ marginBottom: '36px' }}>
          <h1 className="section-title" style={{ borderLeft: 'none', paddingLeft: 0, marginBottom: '8px' }}>
            {t('event_title')}
          </h1>
          <p style={{ color: 'rgba(248,246,240,0.4)', fontSize: '13px' }}>
            {lang === 'zh' ? '砂金相关活动与社群信息' : lang === 'en' ? 'Aventurine events & community info' : lang === 'ja' ? 'アヴェンチュリン関連イベント＆コミュニティ' : '아벤투린 관련 이벤트 및 커뮤니티'}
          </p>
        </div>

        {/* ===== 神秘企划 ===== */}
        <div className="card-glass" style={{ padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>🎭</span>
            <h2 style={{ color: '#d4b878', fontSize: '18px', fontWeight: 700, margin: 0 }}>
              {t('event_mystery')}
            </h2>
            <span style={{
              background: 'rgba(212,184,120,0.15)', color: '#d4b878',
              fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600,
              border: '1px solid rgba(212,184,120,0.3)',
            }}>
              {lang === 'zh' ? '筹备中' : lang === 'en' ? 'In Progress' : lang === 'ja' ? '準備中' : '준비 중'}
            </span>
          </div>
          <p style={{ color: 'rgba(242,232,208,0.65)', fontSize: '13px', lineHeight: '1.8', margin: 0 }}>
            {getVal(mysteryDesc, lang === 'zh' ? '神秘企划正在建设中，敬请期待...' : 'Mystery project under construction, stay tuned...')}
          </p>
        </div>

        {/* ===== 杭州ONLY ===== */}
        <div className="card-glass" style={{ padding: '28px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>🏙️</span>
            <h2 style={{ color: '#d4b878', fontSize: '18px', fontWeight: 700, margin: 0 }}>
              {t('event_hangzhou')}
            </h2>
            <span style={{
              background: 'rgba(176,160,216,0.15)', color: '#b0a0d8',
              fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: 600,
              border: '1px solid rgba(176,160,216,0.3)',
            }}>
              {lang === 'zh' ? '预计2027年' : lang === 'en' ? 'Expected 2027' : lang === 'ja' ? '2027年予定' : '2027년 예정'}
            </span>
          </div>
          <p style={{ color: 'rgba(242,232,208,0.65)', fontSize: '13px', lineHeight: '1.8', margin: 0 }}>
            {getVal(hangzhouDesc, t('event_hangzhou_desc'))}
          </p>
        </div>

        {/* ===== 应援群聊 ===== */}
        <div>
          <h2 className="section-title" style={{ marginBottom: '20px' }}>{t('event_groups')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { key: 'weibo', icon: '🔴', label: t('event_weibo'), value: groups.weibo || '' },
              { key: 'douyin', icon: '🎵', label: t('event_douyin'), value: groups.douyin || '' },
              { key: 'qq', icon: '💬', label: t('event_qq'), value: groups.qq || '' },
              { key: 'xiaohongshu', icon: '📕', label: t('event_xiaohongshu'), value: groups.xiaohongshu || '' },
              { key: 'wechat', icon: '💚', label: t('event_wechat'), value: groups.wechat || '' },
            ].map(g => (
              <div key={g.key} className="card-glass card-hover" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{g.icon}</span>
                  <span style={{ color: '#f2e8d0', fontSize: '14px', fontWeight: 600 }}>{g.label}</span>
                </div>
                {g.value ? (
                  <div style={{
                    background: 'rgba(212,184,120,0.08)', border: '1px solid rgba(212,184,120,0.2)',
                    borderRadius: '8px', padding: '10px 14px',
                    color: '#d4b878', fontSize: '13px', fontWeight: 500,
                    wordBreak: 'break-all',
                  }}>
                    {g.value}
                  </div>
                ) : (
                  <div style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(212,184,120,0.2)',
                    borderRadius: '8px', padding: '10px 14px',
                    color: 'rgba(248,246,240,0.3)', fontSize: '12px', fontStyle: 'italic',
                  }}>
                    {t('event_qr_placeholder')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
