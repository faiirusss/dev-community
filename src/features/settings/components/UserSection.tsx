import { useFormContext } from "react-hook-form"
import { useSession } from "~/lib/auth-client"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { SectionWrapper } from "./layout/SectionWrapper"
import type { UpdateProfileSchema } from "~/schemas/profile"

export function UserSection() {
  const { register, formState: { errors } } = useFormContext<UpdateProfileSchema>()
  const { data: session } = useSession()

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
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            {session?.user?.image && (
              <AvatarImage src={session.user.image} alt={session.user.name ?? ""} />
            )}
            <AvatarFallback className="bg-muted text-sm">
              {(session?.user?.name ?? "U")[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-xs text-muted-foreground">
            Profile image is synced from your OAuth provider.
          </p>
        </div>
      </div>
    </SectionWrapper>
  )
}