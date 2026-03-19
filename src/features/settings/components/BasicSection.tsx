import { FormField } from "./layout/FormField"
import { SectionWrapper } from "./layout/SectionWrapper"

export function BasicSection() {
  return (
    <SectionWrapper title="Basic">
      <FormField
        label="Website URL"
        name="websiteUrl"
        maxLength={200}
      />
      <FormField
        label="Location"
        name="location"
        maxLength={100}
      />
      <FormField
        label="Bio"
        name="bio"
        maxLength={200}
        multiline
      />
    </SectionWrapper>
  )
}