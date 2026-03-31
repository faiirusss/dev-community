import { useFormContext, useWatch, Controller } from "react-hook-form"
import { Label } from "~/components/ui/label"
import { SectionWrapper } from "../components/layout/SectionWrapper"
import { ColorPicker } from "~/components/ui/color-picker"
import type { UpdateProfileSchema } from "~/schemas/profile"

export function BrandingSection() {
  const { control } = useFormContext<UpdateProfileSchema>()
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
        <Controller
          name="brandColor"
          control={control}
          render={({ field }) => (
            <ColorPicker
              value={field.value || "#000000"}
              onChange={field.onChange}
              onClear={() => field.onChange("#000000")}
            />
          )}
        />
      </div>
    </SectionWrapper>
  )
}
