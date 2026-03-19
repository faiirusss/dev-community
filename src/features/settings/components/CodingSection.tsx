import { FormField } from "./layout/FormField"
import { SectionWrapper } from "./layout/SectionWrapper"

export function CodingSection() {
  return (
    <SectionWrapper title="Coding">
      <FormField
        label="Currently learning"
        description="What are you learning right now? What are the new tools and languages you're picking up?"
        name="currentlyLearning"
        maxLength={200}
        multiline
      />
      <FormField
        label="Available for"
        description="What kind of collaborations or discussions are you available for?"
        name="availableFor"
        maxLength={200}
        multiline
      />
      <FormField
        label="Skills / Languages"
        description="What tools and languages are you most experienced with?"
        name="skills"
        maxLength={200}
        multiline
      />
      <FormField
        label="Currently hacking on"
        description="What projects are currently occupying most of your time?"
        name="currentlyHacking"
        maxLength={200}
        multiline
      />
    </SectionWrapper>
  )
}