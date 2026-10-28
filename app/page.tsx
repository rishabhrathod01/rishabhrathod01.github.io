import Image from "next/image";
import Link from "next/link";
import { getBlogPosts, getTravelStories } from "@/lib/mdx";
import { personalInfo, experience, projects } from "@/lib/data";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Plane,
  Twitter,
} from "@/components/icons";
import { Reveal } from "@/components/home/Reveal";
import { TaglineReveal } from "@/components/home/TaglineReveal";

const btnPrimary =
  "inline-flex items-center gap-2 rounded-lg bg-on-surface px-3 py-2 text-base font-semibold text-surface transition-opacity hover:opacity-85 active:scale-[0.98]";
const btnSecondary =
  "inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-base font-semibold text-on-surface transition-colors hover:bg-surface-container active:scale-[0.98]";

function Chapter({
  n,
  title,
  id,
}: {
  n: string;
  title: string;
  id?: string;
}) {
  return (
    <Reveal className="mb-8">
      <p id={id} className="eyebrow scroll-mt-28">
        Chapter {n}
      </p>
      <h2 className="mt-2 text-3xl font-bold text-on-surface md:text-4xl">
        {title}
      </h2>
    </Reveal>
  );
}

function fmtDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default async function HomePage() {
  const [posts, trips] = await Promise.all([
    getBlogPosts(),
    getTravelStories(),
  ]);
  const latestPosts = posts.slice(0, 3);
  const trip = trips[0];

  // Appsmith appears twice (two roles); show the company once on the timeline.
  const timeline = experience
    .filter((e, i) => experience.findIndex((x) => x.company === e.company) === i)
    .slice(0, 4)
    .map((e) => {
      const roles = experience.filter((x) => x.company === e.company);
      const start = roles[roles.length - 1].period.split(" - ")[0];
      const end = e.period.split(" - ")[1];
      return { ...e, period: `${start} – ${end}` };
    });

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-container-max items-center gap-8 px-4 pb-24 pt-24 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 md:px-6 md:pt-32">
        <Reveal className="md:order-2">
          <Image
            src="/about/portrait.png"
            alt={personalInfo.name}
            width={288}
            height={288}
            priority
            className="h-32 w-32 rounded-[28%] object-cover grayscale md:h-64 md:w-64 lg:h-72 lg:w-72"
          />
        </Reveal>
        <Reveal>
          <h1 className="text-gradient max-w-[680px] text-5xl font-bold leading-none md:text-6xl">
            Hi, I&apos;m Rishabh. I build tools for developers, and fly drones
            on weekends.
          </h1>
          <p className="mt-6 max-w-[680px] text-lg text-slate-muted">
            Staff frontend engineer at Prophecy in Bengaluru. Before that,
            Appsmith, Streak AI, and three startups that taught me React
            Native.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <a href="#story" className={btnPrimary}>
              Read my story <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href={personalInfo.resume}
              target="_blank"
              rel="noopener noreferrer"
              className={btnSecondary}
            >
              Download resume
            </a>
          </div>
          <div className="mt-8 flex gap-4 text-slate-muted">
            {[
              { label: "GitHub", href: personalInfo.social.github, Icon: Github },
              { label: "LinkedIn", href: personalInfo.social.linkedin, Icon: Linkedin },
              { label: "X", href: personalInfo.social.twitter, Icon: Twitter },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-colors hover:text-on-surface"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Tagline reveal */}
      <section className="mx-auto max-w-[760px] px-4 py-24 md:px-6">
        <TaglineReveal text="In 2018 I shipped my first React Native app for a food startup. Since then I have cut a bundle by 65%, made an engine 200% faster, and lost a drone in its first week." />
      </section>

      {/* Chapter one: work */}
      <section className="mx-auto max-w-[760px] px-4 py-24 md:px-6">
        <Chapter n="one" title="Where I have worked" id="story" />
        <ol className="relative space-y-10 pl-8">
          <span
            aria-hidden
            className="absolute bottom-2 left-[5px] top-2 w-px bg-line"
          />
          {timeline.map((exp, i) => (
            <Reveal key={exp.company} delay={i * 0.06}>
              <li className="relative">
                <span
                  aria-hidden
                  className={`absolute -left-8 top-1.5 h-[11px] w-[11px] rounded-[3px] border border-on-surface ${
                    i === 0 ? "bg-on-surface" : "bg-surface"
                  }`}
                />
                <p className="eyebrow">{exp.period}</p>
                <h3 className="mt-1 text-2xl font-bold text-on-surface">
                  {exp.company}
                </h3>
                <p className="mt-1 text-sm font-semibold text-slate-muted">
                  {exp.position}
                </p>
                <p className="mt-2 text-slate-muted">{exp.achievements[0]}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-10">
          <Link href="/about" className={btnSecondary}>
            Full experience <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      {/* Chapter two: projects */}
      <section className="py-24">
        <div className="mx-auto max-w-[760px] px-4 md:px-6">
          <Chapter n="two" title="Things I made" />
        </div>
        <div className="overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:px-6">
          <div className="mx-auto flex max-w-container-max gap-4">
            {projects.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 0.08}
                className={i % 2 ? "w-[280px] shrink-0 md:w-[320px]" : "w-[320px] shrink-0 md:w-[420px]"}
              >
                <a
                  href={p.liveUrl || p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl border border-line bg-surface-container ${
                      i % 2 ? "aspect-[3/4]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      className="object-cover grayscale transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="mt-4 flex items-center gap-1 text-xl font-bold text-on-surface">
                    {p.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="mt-1 line-clamp-2 text-slate-muted">
                    {p.description}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-[760px] px-4 md:px-6">
          <Link href="/projects" className={btnSecondary}>
            All projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Chapter three: writing and trips */}
      <section className="mx-auto max-w-[760px] px-4 py-24 md:px-6">
        <Chapter n="three" title="Notes and trips" />
        <div className="gap-4 sm:columns-2">
          {latestPosts.slice(0, 1).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
          {trip && (
            <Reveal className="mb-4 break-inside-avoid">
              <Link
                href={`/travel/${trip.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-surface-container"
              >
                {trip.coverImage && (
                  <Image
                    src={trip.coverImage}
                    alt=""
                    fill
                    className="object-cover grayscale transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
                <div className="absolute inset-x-4 bottom-4 rounded-xl border border-line bg-surface/90 p-4 backdrop-blur">
                  <span className="eyebrow">Travel</span>
                  <p className="mt-1 font-bold text-on-surface">{trip.title}</p>
                </div>
              </Link>
            </Reveal>
          )}
          {latestPosts.slice(1).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
          <Reveal className="mb-4 break-inside-avoid">
            <div className="rounded-2xl border border-line bg-surface-container p-6">
              <Plane className="h-6 w-6 text-on-surface" />
              <h3 className="mt-3 text-xl font-bold text-on-surface">
                Fly through this portfolio
              </h3>
              <p className="mt-2 text-slate-muted">
                A DJI Mini 4 Pro over an island made of my work. Best on a
                laptop with a keyboard.
              </p>
              <Link href="/fly" className={`${btnSecondary} mt-4`}>
                Take flight
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal className="mt-6 flex flex-wrap gap-2">
          <Link href="/blog" className={btnSecondary}>
            Read the blog <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/travel" className={btnSecondary}>
            Travel stories
          </Link>
        </Reveal>
      </section>

      {/* Chapter four: contact */}
      <section className="mx-auto max-w-[760px] px-4 py-24 md:px-6">
        <Chapter n="four" title="Say hello" />
        <Reveal>
          <p className="max-w-[560px] text-lg text-slate-muted">
            I reply to every email about frontend roles, developer tools, or
            the best drone spots in Karnataka.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <a href={`mailto:${personalInfo.email}`} className={btnPrimary}>
              Email me
            </a>
            <a
              href={personalInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={btnSecondary}
            >
              Connect on LinkedIn
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function PostCard({
  post,
}: {
  post: { slug: string; title: string; date: string; readingTime: string };
}) {
  return (
    <Reveal className="mb-4 break-inside-avoid">
      <Link
        href={`/blog/${post.slug}`}
        className="group block rounded-2xl border border-line bg-surface-container p-6 transition-colors hover:bg-surface-container-high"
      >
        <span className="inline-block rounded border border-line bg-surface px-2 py-0.5 text-xs font-semibold text-slate-muted">
          Blog
        </span>
        <h3 className="mt-3 text-xl font-bold text-on-surface">{post.title}</h3>
        <p className="eyebrow mt-3">
          {fmtDate(post.date)} · {post.readingTime}
        </p>
      </Link>
    </Reveal>
  );
}
