import Image from "next/image";
import Link from "next/link";
import { script } from "@/lib/fonts";
import { getBlogPosts, getTravelStories } from "@/lib/mdx";
import { personalInfo, experience, projects } from "@/lib/data";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Plane,
} from "@/components/icons";
import { GithubIcon, LinkedinIcon, XIcon, YoutubeIcon } from "@/components/SocialIcons";
import { Reveal } from "@/components/home/Reveal";
import { TaglineReveal } from "@/components/home/TaglineReveal";
import { RotatingText } from "@/components/home/RotatingText";

const btnPrimary =
  "inline-flex items-center gap-2 rounded-lg bg-on-surface px-3 py-2 text-base font-semibold text-surface transition-opacity hover:opacity-85 active:scale-[0.98]";
const btnSecondary =
  "inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-base font-semibold text-on-surface transition-colors hover:bg-surface-container active:scale-[0.98]";

function Chapter({ title, id }: { title: React.ReactNode; id?: string }) {
  return (
    <Reveal className="mb-8">
      <h2
        id={id}
        className="scroll-mt-28 text-3xl font-bold text-on-surface md:text-4xl"
      >
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
      {/* Full-bleed photo: background faded out, cutout of me on top, both
          from the same 4:3 frame so they line up exactly. */}
      <section className="relative overflow-hidden md:min-h-[760px]">
        <div className="relative z-10 mx-auto max-w-container-max px-4 pb-12 pt-24 md:flex md:min-h-[760px] md:items-end md:px-6 md:pb-12 md:pt-24">
        <Reveal className="md:max-w-[52%]">
          {/* Gradient per line, not on the h1: a parent background-clip:text
              paints the rotating line at full strength and hides its fade. */}
          <h1 className="max-w-[680px] text-5xl font-bold leading-none md:text-6xl">
            <span className="text-gradient">
              Hi, I&apos;m{" "}
              <span className={`${script.className} text-6xl md:text-7xl`}>
                Rishabh
              </span>
              .
            </span>
            <RotatingText
              prefix="I"
              phrases={[
                "solve complex problems.",
                "build dev tools.",
                "ship mobile apps.",
                "build AI agents.",
                "fly drones.",
                "ride solo on my bike.",
                "automate my chores.",
                "write about what I learn.",
              ]}
            />
          </h1>
          <p className="mt-6 max-w-[680px] text-lg text-slate-muted">
            To pay my bills, I work as a staff frontend engineer at{" "}
            <a
              href="https://www.prophecy.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface underline decoration-line underline-offset-4 transition-colors hover:decoration-on-surface"
            >
              Prophecy
            </a>
            .
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
              { label: "GitHub", href: personalInfo.social.github, Icon: GithubIcon },
              { label: "LinkedIn", href: personalInfo.social.linkedin, Icon: LinkedinIcon },
              { label: "X", href: personalInfo.social.twitter, Icon: XIcon },
              { label: "YouTube", href: personalInfo.social.youtube, Icon: YoutubeIcon },
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
        </div>
        {/* 13:3 frame: the photo on the right, a soft extension of it on the
            left so the backdrop reaches the left edge on wide screens. On
            phones only the original 4:3 photo (right end) shows. */}
        <Reveal className="relative aspect-[4/3] w-full md:absolute md:bottom-0 md:right-[-30%] md:aspect-[13/3] xl:right-[-15%] md:h-[125%] md:w-auto">
          <Image
            src="/about/hero-bg.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 3300px, 100vw"
            className="object-cover object-right opacity-20 grayscale [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_45%),linear-gradient(to_top,transparent,black_25%)] md:[mask-image:linear-gradient(to_right,transparent_40%,black_70%),linear-gradient(to_top,transparent,black_25%),linear-gradient(to_bottom,transparent_15%,black_35%)]"
          />
          <Image
            src="/about/hero-person.webp"
            alt={personalInfo.name}
            fill
            priority
            sizes="(min-width: 768px) 3300px, 100vw"
            className="object-cover object-right"
          />
        </Reveal>
      </section>

      {/* Tagline reveal: three short paragraphs zig-zagging down the page,
          script font on a few words */}
      <section className="mx-auto flex max-w-container-max flex-col gap-12 px-4 py-24 md:gap-20 md:px-6 md:pt-40">
        <TaglineReveal
          className="max-w-[560px] text-3xl md:text-4xl"
          parts={[
            "In 2018 I shipped my first mobile app, for a food delivery startup. Then I built a no-code algo trading platform for crypto at Streak.",
          ]}
        />
        <div className="md:ml-auto md:w-1/2">
          <TaglineReveal
            className="max-w-[560px] text-3xl md:text-4xl"
            parts={[
              "After that, I worked on the low-code JS evaluation engine at Appsmith, while doing",
              {
                text: "solo bike rides to Goa",
                href: "/travel/mulki-goa-bike-trip",
                className: `${script.className} text-4xl md:text-5xl`,
              },
              "and capturing",
              { text: "drone shots.", href: "https://youtu.be/WhWniSMK5bY" },
            ]}
          />
        </div>
        <TaglineReveal
          className="max-w-[560px] text-3xl md:text-4xl"
          parts={[
            "Now I lead the agentic user experience at Prophecy, built for analysts. In my free time I learn calisthenics and capture drone shots on trips to",
            { text: "Himachal,", href: "https://youtu.be/qVIHJk79q9c" },
            { text: "Coorg,", href: "https://youtu.be/NV87I6aqU18" },
            { text: "Wayanad,", href: personalInfo.social.droneInstagram },
            {
              text: "and beyond.",
              href: personalInfo.social.youtube,
              className: `${script.className} text-4xl md:text-5xl`,
            },
          ]}
        />
      </section>

      {/* Chapter one: work */}
      <section className="mx-auto max-w-[760px] px-4 py-24 md:px-6">
        <Chapter title="Where I have worked" id="story" />
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
          <Chapter title="Things I made" />
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
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <span aria-hidden className="color-reveal" />
                    {p.preAI && (
                      <span className="absolute left-4 top-4 rounded-full border border-line bg-surface px-3 py-0.5 text-xs font-semibold text-slate-muted">
                        Pre-AI era
                      </span>
                    )}
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
        <Chapter title="Notes and trips" />
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
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                )}
                <span aria-hidden className="color-reveal" />
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
            <div className="ic-host rounded-2xl border border-line bg-surface-container p-6">
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
        <Chapter
          title={
            <>
              Say{" "}
              <span className={`${script.className} text-4xl md:text-5xl`}>
                hello
              </span>
            </>
          }
        />
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
