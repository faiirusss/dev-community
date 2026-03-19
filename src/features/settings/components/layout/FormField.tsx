import { useWatch, useFormContext } from "react-hook-form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import type { UpdateProfileSchema } from "~/schemas/profile"

interface CountedFieldProps {
  label: string
  description?: string
  name: keyof UpdateProfileSchema
  maxLength?: number
  multiline?: boolean
  disabled?: boolean
}

export function FormField({
  label,
  description,
  name,
  maxLength = 200,
  multiline = false,
  disabled = false,
}: CountedFieldProps) {
  const { register, control } = useFormContext<UpdateProfileSchema>()
  const value = useWatch({ control, name }) as string | undefined
  const len = (value ?? "").length

  const Comp = multiline ? Textarea : Input

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name} className="text-sm font-semibold">
        {label}
      </Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <Comp
        id={name}
        disabled={disabled}
        maxLength={maxLength}
        {...register(name)}
      />
      <span className="self-end text-xs text-muted-foreground">
        {len}/{maxLength}
      </span>
    </div>
  )
}