"use client";

import { motion } from "framer-motion";
import { TrackedLink } from "@/components/TrackedLink";
import { Calendar, Clock } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  index?: number;
}

export function BlogCard({
  slug,
  title,
  description,
  date,
  readingTime,
  tags,
  index = 0,
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <TrackedLink
        href={`/blog/${slug}`}
        gaLabel={`Blog: ${title}`}
        gaLocation="blog_listing"
        className="block h-full"
      >
        <div className="glass-card rounded-2xl p-8 h-full flex flex-col kinetic-hover">
          <div className="flex items-center gap-4 text-slate-muted mb-4">
            <span className="flex items-center gap-1.5 font-jetbrains text-xs">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 font-jetbrains text-xs">
              <Clock className="h-3.5 w-3.5" />
              {readingTime}
            </span>
          </div>

          <h3 className="font-geist text-xl font-medium text-on-surface mb-3 hover:text-primary transition-colors flex-grow">
            {title}
          </h3>
          <p className="text-slate-muted text-sm leading-relaxed mb-6">
            {description}
          </p>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-surface-container rounded font-jetbrains text-[10px] text-emerald uppercase tracking-widest border border-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </TrackedLink>
    </motion.div>
  );
}
