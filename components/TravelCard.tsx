import Image from "next/image";
import Link from "next/link";
import { MapPin } from "@/components/icons";
import { Reveal } from "@/components/home/Reveal";

interface TravelCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  location: string;
  country: string;
  coverImage: string;
  readingTime: string;
  index?: number;
}

export function TravelCard({
  slug,
  title,
  description,
  date,
  location,
  country,
  coverImage,
  readingTime,
  index = 0,
}: TravelCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  return (
    <Reveal delay={(index % 2) * 0.08} className="mb-4 break-inside-avoid">
      <Link href={`/travel/${slug}`} className="group block">
        <div
          className={`relative overflow-hidden rounded-2xl border border-line bg-surface-container ${
            index % 2 ? "aspect-[4/3]" : "aspect-[3/4]"
          }`}
        >
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span aria-hidden className="color-reveal" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded border border-line bg-surface/90 px-2 py-0.5 text-xs font-semibold text-slate-muted backdrop-blur">
            <MapPin className="h-3 w-3" />
            {location}, {country}
          </span>
        </div>
        <p className="eyebrow mt-4">
          {formattedDate} · {readingTime}
        </p>
        <h3 className="mt-1 text-xl font-bold text-on-surface">{title}</h3>
        <p className="mt-1 line-clamp-2 text-slate-muted">{description}</p>
      </Link>
    </Reveal>
  );
}
