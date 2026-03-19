import { useFormContext, useWatch } from "react-hook-form"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { SectionWrapper } from "../components/layout/SectionWrapper"
import type { UpdateProfileSchema } from "~/schemas/profile"

export function BrandingSection() {
  const { register, control } = useFormContext<UpdateProfileSchema>()
  const brandColor = useWatch({ control, name: "brandColor" }) as string

  return (
    <SectionWrapper title="Branding">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="brandColor" className="text-sm font-semibold">
          Brand color
        </Label>
        <p className="text-xs text-muted-foreground">
          Used for your profile background, borders, and accents.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            id="brandColorPicker"
            value={brandColor ?? "#000000"}
            {...register("brandColor")}
            className="h-9 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
          />
          <Input
            id="brandColor"
            {...register("brandColor")}
            maxLength={7}
            placeholder="#000000"
            className="w-28 font-mono"
          />
          <div
            className="h-9 w-9 rounded-md border"
            style={{ backgroundColor: brandColor ?? "#000000" }}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}