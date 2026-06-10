import ImageCropper from './ImageCropper'

interface ImagePickerProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}

export default function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  return (
    <ImageCropper
      value={value}
      onChange={onChange}
      label={label}
    />
  )
}
