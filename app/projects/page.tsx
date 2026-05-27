import { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my portfolio of web development projects built with modern technologies.",
};

const stats = [
  { value: "12+", label: "Tools Built" },
  { value: "50k+", label: "Installs" },
  { value: "1.2k", label: "GH Stars" },
  { value: "6yr", label: "Experience" },
];

export default function ProjectsPage() {
  return (
    <div>
      {/* ── Header ── */}
      <section className="py-section-gap bg-surface-container-lowest relative overflow-hidden">
        <div
          className="hero-glow opacity-20"
          style={{ top: "-5rem", left: "-5rem" }}
        />
        <div className="max-w-container-max mx-auto px-4 md:px-gutter relative z-10">
          <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-4">
            {'01 // PORTFOLIO'}
          </p>
          <h1 className="font-geist text-5xl md:text-7xl font-bold text-on-surface tracking-tight leading-[1.1] mb-6">
            My Projects
          </h1>
          <p className="text-lg text-slate-muted max-w-2xl leading-relaxed">
            A collection of projects I&apos;ve built, ranging from full-stack
            applications to frontend experiments. Each represents a unique
            challenge and technical mastery in the developer tooling space.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-geist text-4xl md:text-5xl font-bold text-on-surface mb-2">
                  {stat.value}
                </p>
                <p className="font-jetbrains text-xs text-slate-muted uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects Grid ── */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} {...project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <div className="glass-card rounded-4xl p-12 text-center relative overflow-hidden">
            <div
              className="hero-glow opacity-20"
              style={{ top: 0, left: "50%", transform: "translateX(-50%)" }}
            />
            <div className="relative z-10">
              <h2 className="font-geist text-3xl md:text-4xl font-bold text-on-surface mb-4">
                Have a challenging project?
              </h2>
              <p className="text-slate-muted mb-8 max-w-lg mx-auto">
                I&apos;m always open to discussing high-impact projects,
                architectural consultations, or open-source collaborations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="mailto:rishabhrathod2012@gmail.com"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary-dark rounded-2xl font-jetbrains text-xs font-semibold tracking-widest uppercase kinetic-hover"
                >
                  Start a Conversation
                </a>
                <a
                  href="https://drive.google.com/file/d/1XHhicK78OpWr3hvZA7S-gPS4_zVXtoPa/view?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-primary rounded-2xl font-jetbrains text-xs font-semibold tracking-widest uppercase transition-all text-on-surface"
                >
                  View Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
