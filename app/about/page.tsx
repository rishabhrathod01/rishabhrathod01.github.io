import Image from "next/image";
import { Mail, MapPin } from "@/components/icons";
import { Reveal } from "@/components/home/Reveal";
import { personalInfo, skills, experience, education } from "@/lib/data";

const btnPrimary =
  "inline-flex items-center gap-2 rounded-lg bg-on-surface px-3 py-2 text-base font-semibold text-surface transition-opacity hover:opacity-85 active:scale-[0.98]";
const tag =
  "rounded border border-line bg-surface px-2 py-0.5 text-xs font-semibold text-slate-muted";

const skillSections = [
  { label: "Languages", items: skills.languages },
  { label: "Frameworks", items: skills.frameworks },
  { label: "Tools", items: skills.tools },
  { label: "Core focus", items: skills.design },
];

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-12">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold text-on-surface md:text-4xl">
        {title}
      </h2>
    </Reveal>
  );
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-container-max px-4 pb-24 pt-24 md:px-6 md:pt-32">
        <Reveal className="grid items-end gap-12 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">About</p>
            <h1 className="text-gradient mt-4 max-w-[680px] text-5xl font-bold leading-none md:text-6xl">
              I build tools for the engineers who build everything else.
            </h1>
            <p className="mt-6 max-w-[680px] text-lg text-slate-muted">
              Staff frontend engineer with 7+ years of full time experience on
              developer platforms, enterprise features, and AI tooling.
            </p>
          </div>
          <div className="relative h-48 w-48 overflow-hidden rounded-2xl border border-line bg-surface-container md:h-56 md:w-56">
            <Image
              src="/about/portrait.png"
              alt={personalInfo.name}
              fill
              priority
              className="object-cover grayscale"
            />
          </div>
        </Reveal>
      </section>

      {/* Who I am */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        <Reveal className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <h2 className="text-3xl font-bold text-on-surface md:text-4xl">
            Who I am
          </h2>
          <div>
            <p className="text-lg text-slate-muted">
              {personalInfo.about.long}
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-muted">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-on-surface" />
                {personalInfo.location}
              </span>
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 transition-colors hover:text-on-surface"
              >
                <Mail className="h-4 w-4 text-on-surface" />
                {personalInfo.email}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        <SectionHeading eyebrow="Skills" title="What I work with" />
        <dl>
          {skillSections.map((section, i) => (
            <Reveal key={section.label} delay={i * 0.06}>
              <div className="grid gap-4 border-t border-line py-6 md:grid-cols-[1fr_2fr]">
                <dt className="font-bold text-on-surface">{section.label}</dt>
                <dd className="flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <span key={item} className={tag}>
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Experience */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        <SectionHeading eyebrow="Experience" title="Where I have worked" />
        <div>
          {experience.map((exp, i) => (
            <Reveal key={`${exp.company}-${i}`} delay={i * 0.04}>
              <article className="grid gap-4 border-t border-line py-8 md:grid-cols-[1fr_2fr]">
                <div>
                  <p className="eyebrow">{exp.period}</p>
                  <p className="mt-1 text-xl font-bold text-on-surface">
                    {exp.company}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">
                    {exp.position}
                  </h3>
                  <p className="mt-2 text-slate-muted">{exp.description}</p>
                  <ul className="mt-4 space-y-2">
                    {exp.achievements.map((achievement, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-slate-muted"
                      >
                        <span className="mt-2.5 h-1 w-1 shrink-0 bg-on-surface" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        <SectionHeading eyebrow="Education" title="Where I studied" />
        <div className="grid gap-4 md:grid-cols-2">
          {education.map((edu, i) => (
            <Reveal key={edu.institution} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-line bg-surface-container p-8">
                <p className="eyebrow">{edu.period}</p>
                <h3 className="mt-2 text-xl font-bold text-on-surface">
                  {edu.institution}
                </h3>
                <p className="mt-2 font-semibold text-on-surface">
                  {edu.degree}
                </p>
                <p className="mt-1 text-slate-muted">{edu.field}</p>
                <p className="mt-1 text-slate-muted">{edu.location}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        <Reveal className="max-w-[680px]">
          <h2 className="text-3xl font-bold text-on-surface md:text-4xl">
            Interested in working together?
          </h2>
          <p className="mt-4 text-lg text-slate-muted">
            I am open to new roles, developer tooling work, and collaborations.
          </p>
          <a href={`mailto:${personalInfo.email}`} className={`${btnPrimary} mt-8`}>
            Email me <Mail className="h-4 w-4" />
          </a>
        </Reveal>
      </section>
    </div>
  );
}
