"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  index?: number;
}

export function ProjectCard({
  title,
  description,
  image,
  tags,
  liveUrl,
  githubUrl,
  featured = false,
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card rounded-2xl overflow-hidden group kinetic-hover h-full flex flex-col"
    >
      <div className="aspect-video bg-surface-container-highest relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
        />
        {featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-primary text-on-primary-dark rounded-full font-jetbrains text-[10px] font-bold tracking-widest uppercase">
              FEATURED
            </span>
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="font-geist text-2xl font-medium text-on-surface mb-3">
          {title}
        </h3>
        <p className="text-base text-slate-muted mb-6 leading-relaxed flex-grow">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-surface-container rounded font-jetbrains text-[10px] text-emerald uppercase tracking-widest border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg hover:border-primary transition-colors text-sm text-on-surface"
            >
              <ExternalLink className="h-4 w-4" /> Demo
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
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
  );
}
