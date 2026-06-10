import { FormGroup, TextInput, ArrayEditor } from '../pages/AdminPage'

interface SupportRecordEditorProps {
  content: {
    pageTitle: string;
    records: { date: string; title: string; location: string; city: string; lat: number; lng: number; desc: string; image: string; tag: string; howToJoin: string }[];
    year2025Summary?: string;
    year2026Summary?: string;
  };
  onUpdate: (path: string, value: any) => void;
}

export default function SupportRecordEditor({ content, onUpdate }: SupportRecordEditorProps) {
  return (
    <div>
      <FormGroup label="页面标题">
        <TextInput 
          value={content.pageTitle} 
          onChange={v => onUpdate('supportRecord.pageTitle', v)} 
        />
      </FormGroup>

      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '8px' }}>
        📋 年度总结文本
      </h3>
      <FormGroup label="2025年一周年总结">
        <textarea
          value={content.year2025Summary || ''}
          onChange={(e) => onUpdate('supportRecord.year2025Summary', e.target.value)}
          style={{
            width: '100%', minHeight: '120px', padding: '10px',
            background: '#121212', border: '1px solid rgba(212,184,120,0.2)',
            borderRadius: '8px', color: '#f8f6f0', fontSize: '13px', outline: 'none',
            resize: 'vertical', fontFamily: 'inherit',
          }}
        />
      </FormGroup>
      <FormGroup label="2026年二周年总结">
        <textarea
          value={content.year2026Summary || ''}
          onChange={(e) => onUpdate('supportRecord.year2026Summary', e.target.value)}
          style={{
            width: '100%', minHeight: '120px', padding: '10px',
            background: '#121212', border: '1px solid rgba(212,184,120,0.2)',
            borderRadius: '8px', color: '#f8f6f0', fontSize: '13px', outline: 'none',
            resize: 'vertical', fontFamily: 'inherit',
          }}
        />
      </FormGroup>

      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>
        生贺应援记录列表
      </h3>
      
      <ArrayEditor
        title="应援记录"
        items={content.records}
        onChange={v => onUpdate('supportRecord.records', v)}
        fields={[
          { key: 'date', label: '日期' },
          { key: 'title', label: '活动标题' },
          { key: 'tag', label: '标签（大屏/生贺/咖啡/线下等）' },
          { key: 'city', label: '城市（用于搜索筛选）' },
          { key: 'location', label: '详细地址' },
          { key: 'lat', label: '纬度（地图定位）' },
          { key: 'lng', label: '经度（地图定位）' },
          { key: 'desc', label: '描述', multiline: true },
          { key: 'howToJoin', label: '如何参加', multiline: true },
          { key: 'image', label: '图片', type: 'image' },
        ]}
        onAdd={() => onUpdate('supportRecord.records', [
          ...content.records,
          { date: '', title: '', location: '', city: '', lat: 0, lng: 0, desc: '', image: '', tag: '', howToJoin: '' }
        ])}
      />
      
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        background: 'rgba(212,184,120,0.05)', 
        border: '1px solid rgba(212,184,120,0.15)', 
        borderRadius: '8px',
        fontSize: '12px',
        color: 'rgba(248,246,240,0.6)',
      }}>
        <div style={{ color: '#d4b878', marginBottom: '8px', fontSize: '13px' }}>💡 编辑提示</div>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>city 字段</strong>：用于城市搜索筛选，如「上海」「北京」「东京」</li>
          <li><strong>lat/lng 字段</strong>：地图坐标，可从百度地图拾取坐标系统获取</li>
          <li><strong>howToJoin 字段</strong>：填写具体的参与方式（线上/线下报名渠道）</li>
          <li>日期格式建议：2024.03、2024.03.15</li>
          <li>标签用于分类，如：大屏、生贺、咖啡、线下等</li>
          <li>详细地址用于在地图弹窗中展示完整位置信息</li>
        </ul>
      </div>
    </div>
  )
}
