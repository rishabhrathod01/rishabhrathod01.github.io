"use client";

import { TrackedLink } from "@/components/TrackedLink";
import { Reveal } from "@/components/home/Reveal";

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
    month: "short",
    day: "numeric",
  });

  return (
    <Reveal delay={(index % 2) * 0.08} className="h-full">
      <TrackedLink
        href={`/blog/${slug}`}
        gaLabel={`Blog: ${title}`}
        gaLocation="blog_listing"
        className="flex h-full flex-col rounded-2xl border border-line bg-surface-container p-6 transition-colors hover:bg-surface-container-high md:p-8"
      >
        <p className="eyebrow">
          {formattedDate} · {readingTime}
        </p>
        <h3 className="mt-3 text-xl font-bold text-on-surface">{title}</h3>
        <p className="mt-2 flex-grow text-slate-muted">{description}</p>
        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-line bg-surface px-2 py-0.5 text-xs font-semibold text-slate-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </TrackedLink>
    </Reveal>
  );
}
