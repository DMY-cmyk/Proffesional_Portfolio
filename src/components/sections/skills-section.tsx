'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/section-wrapper'
import { SectionHeading } from '@/components/ui/section-heading'
import { Card } from '@/components/ui/card'
import { getSkills, getAwards, getCourses } from '@/data/content'
import { formatDate } from '@/utils/format-date'
import { StaggerChildren } from '@/components/motion/stagger-children'
import type { SkillItem } from '@/types/content'

function SkillBar({ skill }: { skill: SkillItem }) {
  return (
    <div className="rounded-lg border border-border bg-card/80 p-3">
      <span className="text-sm font-medium text-foreground">{skill.name}</span>
      <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

export function SkillsSection() {
  const skills = getSkills()
  const awards = getAwards()
  const courses = getCourses()

  return (
    <SectionWrapper id="skills">
      <SectionHeading title="Skills & Achievements" sectionNumber="04" label="Expertise" />

      <div className="space-y-8 mb-12">
        {skills.map((category) => (
          <div key={category.category}>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {category.category}
            </h3>
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
              {category.items.map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {awards.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Awards & Achievements
          </h3>
          <StaggerChildren className="grid gap-4 md:grid-cols-2">
            {awards.map((award) => (
              <Card key={award.title}>
                <h4 className="font-semibold text-foreground">{award.title}</h4>
                <p className="text-sm text-muted-foreground">{award.issuer}</p>
                <p className="text-sm text-gold-accent mt-1">
                  {formatDate(award.date)}
                </p>
                {award.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {award.description}
                  </p>
                )}
              </Card>
            ))}
          </StaggerChildren>
        </div>
      )}

      {courses.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Courses & Training
          </h3>
          <StaggerChildren className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.name}>
                <h4 className="font-semibold text-foreground">{course.name}</h4>
                <p className="text-sm text-muted-foreground">{course.provider}</p>
                <p className="text-sm text-gold-accent mt-1">
                  {formatDate(course.date)}
                </p>
              </Card>
            ))}
          </StaggerChildren>
        </div>
      )}
    </SectionWrapper>
  )
}