"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Twitter, Mail, Download } from "lucide-react";
import { personalInfo, experience, projects } from "@/lib/data";

export default function HomePage() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 2);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glow1Ref.current) {
        const x = (window.innerWidth - e.clientX * 0.02) / 20;
        const y = (window.innerHeight - e.clientY * 0.02) / 20;
        glow1Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (glow2Ref.current) {
        const x = (window.innerWidth - e.clientX * 0.04) / 20;
        const y = (window.innerHeight - e.clientY * 0.04) / 20;
        glow2Ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          ref={glow1Ref}
          className="hero-glow"
          style={{ top: "-5rem", left: "-5rem" }}
        />
        <div
          ref={glow2Ref}
          className="hero-glow opacity-50"
          style={{ bottom: 0, right: 0 }}
        />

        <div className="max-w-container-max mx-auto px-4 md:px-gutter grid md:grid-cols-2 gap-12 items-center w-full py-20 relative z-10">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 glass-card rounded-full text-emerald font-jetbrains text-xs">
              <span className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
              Available for new opportunities
            </div>

            <div>
              <h1 className="font-geist text-5xl md:text-7xl font-bold text-on-surface tracking-tight leading-[1.1] mb-2">
                {personalInfo.name}
              </h1>
              <h2 className="font-geist text-2xl text-primary font-medium mb-6">
                {personalInfo.role}
              </h2>
              <p className="text-lg text-slate-muted max-w-lg leading-relaxed">
                {personalInfo.tagline}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary-dark rounded-xl font-geist font-bold text-lg kinetic-hover"
              >
                View Projects <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-primary rounded-xl font-geist font-medium text-lg transition-all text-on-surface"
              >
                Read Blog
              </Link>
            </div>

            <div className="flex gap-6 text-slate-muted">
              <a
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-2 font-jetbrains text-xs tracking-wider"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-2 font-jetbrains text-xs tracking-wider"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href={personalInfo.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-2 font-jetbrains text-xs tracking-wider"
              >
                <Twitter className="h-4 w-4" /> Twitter
              </a>
            </div>
          </motion.div>

          {/* Right: portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-[400px] md:h-[400px]">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl rotate-6 -z-10" />
              <div className="absolute inset-0 border border-emerald/20 rounded-3xl -rotate-3 -z-10" />
              <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-surface-container-high relative group">
                <Image
                  src="/about/portrait.png"
                  alt={personalInfo.name}
                  fill
                  priority
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent opacity-60" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── About Summary ── */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-4">
                {'01 // ABOUT ME'}
              </p>
              <p className="font-geist text-2xl text-on-surface leading-relaxed">
                I am a software developer with expertise in JavaScript, React,
                and React Native. I specialize in creating{" "}
                <span className="text-emerald">
                  high-performance developer tools
                </span>{" "}
                and enterprise-scale applications that prioritize efficiency and
                elite user experience.
              </p>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all duration-300"
                >
                  Learn more about my journey{" "}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div>
              <div className="glass-card p-6 rounded-xl">
                <p className="font-jetbrains text-xs text-emerald mb-3 tracking-wider uppercase">
                  Primary Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {["TypeScript", "React", "Next.js", "React Native"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-surface-container rounded-full font-jetbrains text-xs border border-white/10 text-on-surface"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <section className="py-section-gap" id="projects">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-4">
                {'02 // WORK'}
              </p>
              <h2 className="font-geist text-4xl font-semibold text-on-surface">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden md:flex items-center gap-2 text-slate-muted hover:text-on-surface transition-colors text-sm"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-stack-gap">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden group kinetic-hover"
              >
                <div className="aspect-video bg-surface-container-highest relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  />
                  {project.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-on-primary-dark rounded-full font-jetbrains text-[10px] font-bold tracking-widest uppercase">
                        FEATURED
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="font-geist text-2xl font-medium text-on-surface mb-3">
                    {project.title}
                  </h3>
                  <p className="text-base text-slate-muted mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-surface-container rounded font-jetbrains text-[10px] text-emerald uppercase tracking-widest border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg hover:border-primary transition-colors text-sm text-on-surface"
                      >
                        Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg hover:border-primary transition-colors text-sm text-on-surface"
                      >
                        <Github className="h-4 w-4" /> Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience Timeline ── */}
      <section className="py-section-gap bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <div className="mb-16">
            <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-4">
              {'03 // JOURNEY'}
            </p>
            <h2 className="font-geist text-4xl font-semibold text-on-surface">
              Experience
            </h2>
          </div>

          <div className="relative">
            {/* Continuous center line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10" />

            <div className="space-y-16">
              {experience.slice(0, 3).map((exp, index) => (
                <motion.div
                  key={`${exp.company}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative grid md:grid-cols-2 gap-8 md:gap-16 pl-6 md:pl-0"
                >
                  {/* Mobile left border */}
                  <div className="md:hidden absolute left-0 top-2 bottom-2 w-px bg-white/10" />
                  <div className="md:hidden absolute left-[-3px] top-2 w-1.5 h-1.5 rounded-full bg-primary" />

                  {index % 2 === 0 ? (
                    <>
                      <div className="md:text-right">
                        <h3 className="font-geist text-2xl font-medium text-on-surface">
                          {exp.position}
                        </h3>
                        <p className="font-jetbrains text-xs text-primary mt-1 mb-3 uppercase tracking-wider">
                          {exp.company} {'//'} {exp.period}
                        </p>
                        <p className="text-slate-muted max-w-md md:ml-auto leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                      <div className="hidden md:flex items-start justify-start pt-1">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            index === 0
                              ? "bg-primary ring-4 ring-primary/10 shadow-[0_0_15px_rgba(192,193,255,0.4)]"
                              : "bg-slate-muted ring-4 ring-white/5"
                          }`}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="hidden md:flex items-start justify-end pt-1">
                        <div className="w-4 h-4 rounded-full bg-slate-muted ring-4 ring-white/5" />
                      </div>
                      <div>
                        <h3 className="font-geist text-2xl font-medium text-on-surface">
                          {exp.position}
                        </h3>
                        <p className="font-jetbrains text-xs text-primary mt-1 mb-3 uppercase tracking-wider">
                          {exp.company} {'//'} {exp.period}
                        </p>
                        <p className="text-slate-muted max-w-md leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
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
            className="glass-card rounded-4xl p-12 md:p-24 text-center relative overflow-hidden"
          >
            <div
              className="hero-glow opacity-30"
              style={{ top: 0, left: "50%", transform: "translateX(-50%)" }}
            />
            <div className="relative z-10">
              <h2 className="font-geist text-4xl md:text-6xl font-bold text-on-surface mb-8">
                Let&apos;s Work Together
              </h2>
              <p className="text-lg text-slate-muted max-w-2xl mx-auto mb-12 leading-relaxed">
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-on-primary-dark rounded-2xl font-geist font-bold text-xl kinetic-hover"
                >
                  Get in Touch <Mail className="h-5 w-5" />
                </a>
                <a
                  href={personalInfo.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 border border-white/10 hover:border-primary rounded-2xl font-geist font-medium text-xl transition-all text-on-surface"
                >
                  Download Resume <Download className="h-5 w-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
