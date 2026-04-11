import { useState, useCallback, useEffect } from "react";
import { useConvexUpload } from "~/hooks/use-convex-upload";
import { useStorageUrl } from "~/hooks/use-storage-url";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { X, ImagePlus, Loader2 } from "lucide-react";

export function CoverImageUpload({
  value,
  onChange,
  onAltChange,
  altValue,
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  onAltChange?: (alt: string) => void;
  altValue?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { uploadImage } = useConvexUpload();
  const { url: resolvedImageUrl, isLoading: imageLoading } = useStorageUrl(value);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        await uploadFile(file);
      }
    },
    [uploadImage]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setIsUploading(true);
    setError(null);
    try {
      const storageId = await uploadImage(file);
      onChange(storageId);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (value) {
    const displayUrl = previewUrl || resolvedImageUrl;
    
    return (
      <div className="relative">
        {imageLoading && !previewUrl ? (
          <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <img
            src={displayUrl || undefined}
            alt={altValue || "Cover"}
            className="w-full h-64 object-cover rounded-lg"
          />
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleRemove}
          >
            <X className="w-4 h-4 mr-1" /> Remove
          </Button>
        </div>
        {onAltChange && (
          <div className="mt-2">
            <Input
              placeholder="Alt text for cover image"
              value={altValue || ""}
              onChange={(e) => onAltChange(e.target.value)}
              className="text-sm"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      {isUploading && previewUrl ? (
        <div className="relative mb-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      ) : (
        <ImagePlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      )}
      <p className="text-muted-foreground mb-4">
        {isUploading
          ? "Uploading..."
          : "Drag and drop a cover image, or click to browse"}
      </p>
      {error && (
        <p className="text-destructive text-sm mb-4">{error}</p>
      )}
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="cover-image-input"
        disabled={isUploading}
      />
      <Button type="button" variant="outline" asChild>
        <label
          htmlFor="cover-image-input"
          className={`cursor-pointer ${isUploading ? "pointer-events-none opacity-50" : ""}`}
        >
          Add a cover image
        </label>
      </Button>
    </div>
  );
}