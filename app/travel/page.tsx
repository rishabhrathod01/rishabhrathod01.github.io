import { Metadata } from "next";
import { TravelCard } from "@/components/TravelCard";
import { Reveal } from "@/components/home/Reveal";
import { getTravelStories } from "@/lib/mdx";
import { personalInfo } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "@/components/icons";

export const metadata: Metadata = {
  title: "Travel Stories",
  description: "Adventures and experiences from around the world.",
};

const btnPrimary =
  "inline-flex items-center gap-2 rounded-lg bg-on-surface px-3 py-2 text-base font-semibold text-surface transition-opacity hover:opacity-85 active:scale-[0.98]";

export default async function TravelPage() {
  const stories = await getTravelStories();
  const [featured, ...rest] = stories;

  return (
    <div>
      {/* Header */}
      <section className="mx-auto max-w-container-max px-4 pb-24 pt-24 md:px-6 md:pt-32">
        <Reveal>
          <p className="eyebrow">Travel</p>
          <h1 className="text-gradient mt-4 max-w-[680px] text-5xl font-bold leading-none md:text-6xl">
            Travel stories
          </h1>
          <p className="mt-6 max-w-[680px] text-lg text-slate-muted">
            Trips on bikes, with drones, and everything in between, written
            down so I remember them.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        {stories.length === 0 ? (
          <p className="text-slate-muted">No travel stories yet.</p>
        ) : (
          <>
            {/* Featured story */}
            {featured && (
              <Reveal className="mb-16">
                <p className="eyebrow mb-4">Latest trip</p>
                <Link
                  href={`/travel/${featured.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface-container sm:aspect-[16/9]"
                >
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    priority
                    className="object-cover grayscale transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-4 bottom-4 max-w-[560px] rounded-xl border border-line bg-surface/90 p-6 backdrop-blur md:inset-x-8 md:bottom-8">
                    <p className="eyebrow flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {featured.location}, {featured.country} ·{" "}
                      {new Date(featured.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}{" "}
                      · {featured.readingTime}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-on-surface md:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-slate-muted">
                      {featured.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 font-semibold text-on-surface">
                      Read the story
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )}

            {/* Past trips */}
            {rest.length > 0 && (
              <>
                <p className="eyebrow mb-4">Past trips</p>
                <div className="gap-4 sm:columns-2">
                  {rest.map((story, index) => (
                    <TravelCard key={story.slug} {...story} index={index} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* Instagram CTA */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        <Reveal className="max-w-[680px]">
          <h2 className="text-3xl font-bold text-on-surface md:text-4xl">
            More from the road
          </h2>
          <p className="mt-4 text-lg text-slate-muted">
            Drone footage and road trip photos from across India and beyond.
          </p>
          <a
            href={personalInfo.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnPrimary} mt-8`}
          >
            Follow on Instagram
          </a>
        </Reveal>
      </section>
    </div>
  );
}
