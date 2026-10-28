import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowLeft } from "@/components/icons";
import { getTravelStory, getTravelStories } from "@/lib/mdx";
import { MDXContent } from "@/components/MDXContent";

const btnSecondary =
  "inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-base font-semibold text-on-surface transition-colors hover:bg-surface-container active:scale-[0.98]";

/** When there are no MDX stories, static export still needs ≥1 param; this slug is never linked. */
const STATIC_EXPORT_EMPTY_SLUG = "__static_export_placeholder__";

interface TravelStoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const stories = await getTravelStories();
  if (stories.length === 0) {
    return [{ slug: STATIC_EXPORT_EMPTY_SLUG }];
  }
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({
  params,
}: TravelStoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === STATIC_EXPORT_EMPTY_SLUG) {
    return { title: "Travel Stories" };
  }
  const story = await getTravelStory(slug);

  if (!story) {
    return {
      title: "Story Not Found",
    };
  }

  return {
    title: story.title,
    description: story.description,
    openGraph: {
      title: story.title,
      description: story.description,
      type: "article",
      publishedTime: story.date,
      images: [{ url: story.coverImage }],
    },
  };
}

export default async function TravelStoryPage({
  params,
}: TravelStoryPageProps) {
  const { slug } = await params;
  if (slug === STATIC_EXPORT_EMPTY_SLUG) {
    redirect("/travel");
  }
  const story = await getTravelStory(slug);

  if (!story) {
    notFound();
  }

  const formattedDate = new Date(story.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-[760px] px-4 pb-24 pt-24 md:px-6 md:pt-32">
      <article>
        <Link href="/travel" className={`${btnSecondary} mb-12`}>
          <ArrowLeft className="h-4 w-4" />
          All stories
        </Link>

        <header className="mb-12">
          <p className="eyebrow flex flex-wrap items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {story.location}, {story.country} · {formattedDate} ·{" "}
            {story.readingTime}
          </p>
          <h1 className="text-gradient mt-4 max-w-[680px] text-5xl font-bold leading-none md:text-6xl">
            {story.title}
          </h1>
          <p className="mt-6 max-w-[680px] text-lg text-slate-muted">
            {story.description}
          </p>
        </header>

        <div className="relative mb-12 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-surface-container md:aspect-[16/9]">
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <MDXContent source={story.content} />

        <footer className="mt-16">
          <Link href="/travel" className={btnSecondary}>
            <ArrowLeft className="h-4 w-4" />
            Back to all stories
          </Link>
        </footer>
      </article>
    </div>
  );
}
