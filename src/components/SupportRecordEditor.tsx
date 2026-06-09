import { FormGroup, TextInput, ArrayEditor } from '../pages/AdminPage'

interface SupportRecordEditorProps {
  content: {
    pageTitle: string;
    records: { date: string; title: string; location: string; desc: string; image: string; tag: string }[];
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

      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>
        应援记录列表（左图右文布局）
      </h3>
      
      <ArrayEditor
        title="应援记录"
        items={content.records}
        onChange={v => onUpdate('supportRecord.records', v)}
        fields={[
          { key: 'date', label: '日期' },
          { key: 'title', label: '标题' },
          { key: 'location', label: '地点' },
          { key: 'desc', label: '描述', multiline: true },
          { key: 'image', label: '图片', type: 'image' },
          { key: 'tag', label: '标签' },
        ]}
        onAdd={() => onUpdate('supportRecord.records', [
          ...content.records,
          { date: '', title: '', location: '', desc: '', image: '', tag: '' }
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
          <li>每条记录会以「左侧图片 + 右侧文字」的布局显示</li>
          <li>图片建议使用 16:9 或 4:3 比例，高度统一为 100px</li>
          <li>日期格式建议：2024.03、2024.03.15</li>
          <li>标签用于分类，如：线下、大屏、联名、周边等</li>
        </ul>
      </div>
    </div>
  )
}
