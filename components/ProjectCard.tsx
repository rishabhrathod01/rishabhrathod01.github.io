import Image from "next/image";
import { Github, ExternalLink } from "@/components/icons";
import { Reveal } from "@/components/home/Reveal";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  index?: number;
  large?: boolean;
  className?: string;
}

const btnSecondary =
  "inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-base font-semibold text-on-surface transition-colors hover:bg-surface-container-high active:scale-[0.98]";
const tag =
  "rounded border border-line bg-surface px-2 py-0.5 text-xs font-semibold text-slate-muted";

export function ProjectCard({
  title,
  description,
  image,
  tags,
  liveUrl,
  githubUrl,
  featured = false,
  index = 0,
  large = false,
  className,
}: ProjectCardProps) {
  return (
    <Reveal delay={(index % 2) * 0.08} className={className}>
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-container">
        <div
          className={`relative overflow-hidden ${
            large ? "aspect-[4/3]" : "aspect-square"
          }`}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover grayscale transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {featured && (
            <span className={`absolute left-4 top-4 ${tag}`}>Featured</span>
          )}
        </div>

        <div className="flex flex-grow flex-col p-6 md:p-8">
          <h3 className="text-2xl font-bold text-on-surface">{title}</h3>
          <p className="mt-2 flex-grow text-slate-muted">{description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className={tag}>
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={btnSecondary}
              >
                Open the app <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={btnSecondary}
              >
                <Github className="h-4 w-4" /> View source
              </a>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
