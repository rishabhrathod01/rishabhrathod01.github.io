import { Metadata } from "next";
import { TravelCard } from "@/components/TravelCard";
import { getTravelStories } from "@/lib/mdx";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Travel Stories",
  description: "Adventures and experiences from around the world.",
};

export default async function TravelPage() {
  const stories = await getTravelStories();
  const [featured, ...rest] = stories;

  return (
    <div>
      {/* ── Header ── */}
      <section className="py-section-gap bg-surface-container-lowest relative overflow-hidden">
        <div
          className="hero-glow opacity-20"
          style={{ bottom: 0, left: "-5rem" }}
        />
        <div className="max-w-container-max mx-auto px-4 md:px-gutter relative z-10">
          <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-4">
            {'// EXPEDITIONS'}
          </p>
          <h1 className="font-geist text-5xl md:text-7xl font-bold text-on-surface tracking-tight leading-[1.1] mb-6">
            Travel Stories
          </h1>
          <p className="text-lg text-slate-muted max-w-2xl leading-relaxed">
            Documenting adventures, experiences, and stories from traveling the
            world — on bikes, drones, and everything in between.
          </p>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-4 md:px-gutter py-section-gap">
        {stories.length === 0 ? (
          <p className="text-slate-muted text-center py-16">
            No travel stories yet. Check back soon!
          </p>
        ) : (
          <>
            {/* ── Featured story ── */}
            {featured && (
              <div className="mb-16">
                <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-6">
                  {'// LATEST EXPEDITION'}
                </p>
                <Link
                  href={`/travel/${featured.slug}`}
                  className="block group"
                >
                  <div className="glass-card rounded-2xl overflow-hidden kinetic-hover">
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <Image
                        src={featured.coverImage}
                        alt={featured.title}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-90 transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/30 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 glass-card rounded-full font-jetbrains text-[10px] text-emerald uppercase tracking-widest">
                          <MapPin className="h-3 w-3" />
                          {featured.location}, {featured.country}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-slate-muted mb-4 font-jetbrains text-xs">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(featured.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {featured.readingTime}
                        </span>
                      </div>
                      <h2 className="font-geist text-3xl font-semibold text-on-surface mb-3 group-hover:text-primary transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-slate-muted leading-relaxed max-w-3xl mb-6">
                        {featured.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-primary font-semibold font-geist group-hover:gap-4 transition-all duration-300">
                        Read Story <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* ── Past Expeditions ── */}
            {rest.length > 0 && (
              <>
                <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-8">
                  {'// PAST EXPEDITIONS'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((story, index) => (
                    <TravelCard key={story.slug} {...story} index={index} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── Join the Adventure CTA ── */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <div className="glass-card rounded-4xl p-12 text-center relative overflow-hidden">
            <div
              className="hero-glow opacity-20"
              style={{ top: 0, left: "50%", transform: "translateX(-50%)" }}
            />
            <div className="relative z-10">
              <h2 className="font-geist text-3xl md:text-4xl font-bold text-on-surface mb-4">
                Join the Adventure
              </h2>
              <p className="text-slate-muted mb-8 max-w-lg mx-auto">
                Follow along for more stories, drone footage, and road-trip
                chronicles from across India and beyond.
              </p>
              <a
                href="https://www.instagram.com/rishabhrathod01"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary-dark rounded-2xl font-jetbrains text-xs font-semibold tracking-widest uppercase kinetic-hover"
              >
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
