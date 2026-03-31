import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useFormContext } from "react-hook-form"
import { useSession } from "~/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { SectionWrapper } from "./layout/SectionWrapper"
import type { UpdateProfileSchema } from "~/schemas/profile"
import { Loader2 } from "lucide-react"
import { useConvexUpload } from "~/hooks/use-convex-upload"
import { useEffect, useState } from "react"
import { useStorageUrl } from "~/hooks/use-storage-url"

export function UserSection() {
  
  const { 
    register, 
    formState: { errors }, 
    watch, 
    setValue 
  } = useFormContext<UpdateProfileSchema>()
  const { data: session } = useSession()
  
  const { uploadImage } = useConvexUpload()
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const currentImage = watch("image") || session?.user?.image

  // Photos are stored as storage IDs, fetch URLs from Convex
  const { url: imageUrl, isLoading: imageLoading } = useStorageUrl(currentImage);
  const displayImage = previewUrl || imageUrl || currentImage;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    setIsUploading(true);
    setUploadError(null);

    try {
      const storageId = await uploadImage(file);
      setValue("image", storageId, { shouldDirty: true, shouldValidate: true });

    } catch (err) {
      
      setUploadError(err instanceof Error ? err.message : "Upload image failed.");
    } finally {

      setIsUploading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <SectionWrapper title="User">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
        <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
        <Input
          id="email"
          value={session?.user?.email ?? ""}
          disabled
          className="opacity-60"
        />
        <p className="text-xs text-muted-foreground">
          Email is managed by your auth provider and cannot be changed here.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
        <Input
          id="username"
          {...register("username")}
          aria-invalid={!!errors.username}
        />
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-semibold">Profile image</Label>
        <div className="flex items-center gap-4">
          <div className="relative flex shrink-0">
            <Avatar className={`size-12 transition-opacity duration-300 ${isUploading ? 'opacity-50' : 'opacity-100'}`}>
              {imageLoading ? (
                <AvatarFallback className="bg-muted" />
              ) : (previewUrl || imageUrl) ? (
                <AvatarImage 
                  src={previewUrl || imageUrl || undefined} 
                  alt={session?.user?.name ?? ""} 
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-muted text-lg">
                  {(session?.user?.name ?? "U")[0]?.toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-5 animate-spin text-primary" />
              </div>
            )}
          </div>

          <label className="flex flex-col gap-2 w-full p-2 border border-border rounded cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                className="max-w-[300px] cursor-pointer text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:font-medium file:border-input file:bg-input/30 file:text-foreground hover:file:bg-input/50 file:cursor-pointer file:text-sm file:font-medium transition-colors focus-visible:outline-none"
                disabled={isUploading}
                onChange={handleFileChange}
              />
            </div>
            
            {uploadError && (
              <p className="text-xs text-destructive">{uploadError}</p>
            )}
          </label>
        </div>
      </div>
    </SectionWrapper>
  )
}