import { useState } from 'react';
import { MdEditor, ToolbarNames } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { useConvexUpload } from '~/hooks/use-convex-upload';

export function MarkdownEditor({
  value,
  onChange,
  preview = false
}: {
  value: string;
  onChange: (value: string) => void;
  preview?: boolean;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const { uploadImage } = useConvexUpload();

  const handleUploadImage = async (files: File[], callback: (urls: string[]) => void) => {
    setIsUploading(true);
    try {
      const urls = await Promise.all(
        files.map(file => uploadImage(file))
      );
      callback(urls);
    } finally {
      setIsUploading(false);
    }
  };

  const toolbars: ToolbarNames[] = [
    'bold',
    'italic',
    'title',
    '-',
    'quote',
    'unorderedList',
    'orderedList',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    '-',
    'revoke',
    'next',
    'preview'
  ];

  return (
    <div className="relative">
      <MdEditor
        modelValue={value}
        onChange={onChange}
        preview={preview}
        toolbars={toolbars}
        onUploadImg={handleUploadImage}
        placeholder="Write your post content here..."
        style={{ height: '500px' }}
      />
      {isUploading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Uploading image...</span>
        </div>
      )}
    </div>
  );
}