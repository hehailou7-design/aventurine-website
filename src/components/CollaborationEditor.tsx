import { FormGroup, TextInput, ArrayEditor } from '../pages/AdminPage'

interface CollaborationEditorProps {
  content: {
    storesTitle: string;
    merchTitle: string;
    stores: any[];
    merch: any[];
  };
  onUpdate: (path: string, v: any) => void;
}

export default function CollaborationEditor({ content, onUpdate }: CollaborationEditorProps) {
  return (
    <div>
      <FormGroup label="门店标题">
        <TextInput value={content.storesTitle} onChange={v => onUpdate('collaboration.storesTitle', v)} />
      </FormGroup>
      <FormGroup label="周边标题">
        <TextInput value={content.merchTitle} onChange={v => onUpdate('collaboration.merchTitle', v)} />
      </FormGroup>

      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>联名合作门店</h3>
      <ArrayEditor
        title="门店"
        items={content.stores}
        fields={[
          { key: 'name', label: '名称' },
          { key: 'city', label: '城市' },
          { key: 'time', label: '时间' },
          { key: 'category', label: '类别' },
          { key: 'image', label: '图片', type: 'image' },
        ]}
        onAdd={() => onUpdate('collaboration.stores', [...content.stores, { name: '', city: '', time: '', category: '', image: '' }])}
        onChange={(items) => onUpdate('collaboration.stores', items)}
      />

      <h3 style={{ color: '#d4b878', fontSize: '14px', marginTop: '24px', marginBottom: '12px' }}>官方周边图鉴</h3>
      <ArrayEditor
        title="周边"
        items={content.merch}
        fields={[
          { key: 'name', label: '名称' },
          { key: 'price', label: '价格' },
          { key: 'version', label: '版本' },
          { key: 'type', label: '类型' },
          { key: 'image', label: '图片', type: 'image' },
        ]}
        onAdd={() => onUpdate('collaboration.merch', [...content.merch, { name: '', price: '', version: '', type: '', image: '' }])}
        onChange={(items) => onUpdate('collaboration.merch', items)}
      />
    </div>
  )
}
