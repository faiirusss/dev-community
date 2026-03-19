import { FormField } from "./layout/FormField"
import { SectionWrapper } from "./layout/SectionWrapper"

export function PersonalSection() {
  return (
    <SectionWrapper title="Personal">
      <FormField
        label="Pronouns"
        description="What are your preferred pronouns? Example: she/her, he/him, they/them"
        name="pronouns"
        maxLength={50}
      />
    </SectionWrapper>
  )
}