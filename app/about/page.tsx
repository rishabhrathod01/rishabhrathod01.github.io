"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { personalInfo, skills, experience, education } from "@/lib/data";

const skillSections = [
  { label: "Languages", items: skills.languages },
  { label: "Frameworks", items: skills.frameworks },
  { label: "Tools", items: skills.tools },
  { label: "Core Focus", items: skills.design },
];

export default function AboutPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="py-section-gap bg-surface-container-lowest relative overflow-hidden">
        <div
          className="hero-glow opacity-20"
          style={{ top: "-5rem", right: "-5rem" }}
        />
        <div className="max-w-container-max mx-auto px-4 md:px-gutter relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-6">
              {'// ENGINEERING'}
            </p>
            <h1 className="font-geist text-5xl md:text-7xl font-bold text-on-surface leading-[1.1] tracking-tight mb-6">
              Architecting Tools for the{" "}
              <em className="not-italic text-primary">Modern Engineer.</em>
            </h1>
            <p className="text-lg text-slate-muted max-w-2xl leading-relaxed">
              Staff Frontend Engineer with 6+ years of experience specialising
              in building developer-centric platforms, enterprise features, and
              AI-powered tooling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Who I Am ── */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-8 md:p-12 grid md:grid-cols-3 gap-12 items-start"
          >
            <div className="md:col-span-2 space-y-6">
              <h2 className="font-geist text-3xl font-semibold text-on-surface">
                Who I Am
              </h2>
              <p className="text-slate-muted leading-relaxed text-lg">
                {personalInfo.about.long}
              </p>
              <div className="flex flex-wrap gap-6 text-sm text-slate-muted">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {personalInfo.location}
                </span>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  {personalInfo.email}
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <div className="absolute inset-0 border border-primary/20 rounded-2xl rotate-3 -z-10" />
                <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src="/about/portrait.png"
                    alt={personalInfo.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Skill Matrix ── */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-4">
              {'// CAPABILITIES'}
            </p>
            <h2 className="font-geist text-4xl font-semibold text-on-surface mb-12">
              Skill Matrix
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillSections.map((section, index) => (
              <motion.div
                key={section.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <p className="font-jetbrains text-xs text-emerald tracking-wider uppercase mb-4">
                  {section.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {section.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 bg-surface-container rounded-full font-jetbrains text-xs border border-white/10 text-on-surface"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Professional Experience ── */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-4">
              {'// CAREER'}
            </p>
            <h2 className="font-geist text-4xl font-semibold text-on-surface mb-16">
              Professional Experience
            </h2>
          </motion.div>

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <motion.div
                key={`${exp.company}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-geist text-2xl font-medium text-on-surface">
                      {exp.position}
                    </h3>
                    <p className="font-jetbrains text-xs text-primary mt-1 uppercase tracking-wider">
                      {exp.company}
                    </p>
                  </div>
                  <span className="font-jetbrains text-xs text-slate-muted whitespace-nowrap pt-1">
                    {exp.period}
                  </span>
                </div>
                <p className="text-slate-muted mb-4 leading-relaxed">
                  {exp.description}
                </p>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-slate-muted"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald mt-2 shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-4">
              {'// ACADEMIA'}
            </p>
            <h2 className="font-geist text-4xl font-semibold text-on-surface mb-12">
              Education
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">
                  <h3 className="font-geist text-xl font-medium text-on-surface">
                    {edu.institution}
                  </h3>
                  <span className="font-jetbrains text-xs text-slate-muted">
                    {edu.period}
                  </span>
                </div>
                <p className="font-jetbrains text-xs text-primary uppercase tracking-wider mb-2">
                  {edu.degree}
                </p>
                <p className="text-slate-muted text-sm">{edu.field}</p>
                <p className="text-slate-muted text-sm mt-1">{edu.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-section-gap">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-4xl p-12 text-center relative overflow-hidden"
          >
            <div
              className="hero-glow opacity-20"
              style={{ top: 0, left: "50%", transform: "translateX(-50%)" }}
            />
            <div className="relative z-10">
              <h2 className="font-geist text-3xl md:text-4xl font-bold text-on-surface mb-4">
                Interested in working together?
              </h2>
              <p className="text-slate-muted mb-8 max-w-lg mx-auto">
                I&apos;m always open to discussing new opportunities and
                collaborations.
              </p>
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-on-primary-dark rounded-2xl font-geist font-bold text-lg kinetic-hover"
              >
                Get in Touch <Mail className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
