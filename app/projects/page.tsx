import { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/home/Reveal";
import { personalInfo, projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my portfolio of web development projects built with modern technologies.",
};

const btnPrimary =
  "inline-flex items-center gap-2 rounded-lg bg-on-surface px-3 py-2 text-base font-semibold text-surface transition-opacity hover:opacity-85 active:scale-[0.98]";
const btnSecondary =
  "inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-base font-semibold text-on-surface transition-colors hover:bg-surface-container active:scale-[0.98]";

const stats = [
  { value: "4+", label: "Tools built" },
  { value: "2k+", label: "Installs" },
  { value: "8yr", label: "Experience" },
];

export default function ProjectsPage() {
  return (
    <div>
      {/* Header */}
      <section className="mx-auto max-w-container-max px-4 pb-24 pt-24 md:px-6 md:pt-32">
        <Reveal>
          <p className="eyebrow">Projects</p>
          <h1 className="text-gradient mt-4 max-w-[680px] text-5xl font-bold leading-none md:text-6xl">
            Things I made
          </h1>
          <p className="mt-6 max-w-[680px] text-lg text-slate-muted">
            Small tools, each built to fix a problem I kept running into.
          </p>
          <dl className="mt-12 flex flex-wrap gap-12">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="eyebrow">{stat.label}</dt>
                <dd className="mt-1 text-4xl font-bold text-on-surface">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Projects: alternating wide and narrow columns */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
          {projects.map((project, index) => {
            const large = index % 4 === 0 || index % 4 === 3;
            return (
              <ProjectCard
                key={project.title}
                {...project}
                index={index}
                large={large}
                className={large ? "md:col-span-7" : "md:col-span-5"}
              />
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        <Reveal className="max-w-[680px]">
          <h2 className="text-3xl font-bold text-on-surface md:text-4xl">
            Have a hard problem to build?
          </h2>
          <p className="mt-4 text-lg text-slate-muted">
            I am open to high impact projects, architecture reviews, and open
            source collaborations.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href={personalInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={btnPrimary}
            >
              Message me on LinkedIn
            </a>
            <a
              href={personalInfo.resume}
              target="_blank"
              rel="noopener noreferrer"
              className={btnSecondary}
            >
              View resume
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
