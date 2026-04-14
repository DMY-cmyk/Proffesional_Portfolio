import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { SkillPill } from '@/components/ui/skill-pill'
import { getSkills } from '@/data/content'

export function SkillsSection() {
  const skills = getSkills()

  return (
    <SectionWrapper id="skills">
      <SectionHeading title="Skills" sectionNumber="05" label="Practice" />
      <div className="grid gap-10 md:grid-cols-3">
        {skills.map((category) => (
          <div key={category.category}>
            <h3 className="font-display text-lg font-medium mb-4 pb-2 border-b border-border">
              {category.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((s) => (
                <SkillPill key={s.name} name={s.name} context={s.context} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
