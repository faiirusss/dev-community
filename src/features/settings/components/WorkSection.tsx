import { FormField } from "./layout/FormField"
import { SectionWrapper } from "./layout/SectionWrapper"

export function WorkSection() {
  return (
    <SectionWrapper title="Work">
      <FormField
        label="Work"
        description="What do you do? Example: Software Engineer at Acme Inc."
        name="work"
        maxLength={200}
      />
      <FormField
        label="Education"
        description="Where did you go to school? Example: B.S. Computer Science"
        name="education"
        maxLength={200}
      />
    </SectionWrapper>
  )
}