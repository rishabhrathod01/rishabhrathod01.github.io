import Image from "next/image";
import Link from "next/link";
import { script } from "@/lib/fonts";
import { getBlogPosts } from "@/lib/mdx";
import { personalInfo } from "@/lib/data";
import {
  ArrowDown,
  ArrowRight,
  Plane,
} from "@/components/icons";
import { GithubIcon, LinkedinIcon, XIcon, YoutubeIcon } from "@/components/SocialIcons";
import { Reveal } from "@/components/home/Reveal";
import { LifeTimeline } from "@/components/home/LifeTimeline";
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
  const latestPosts = (await getBlogPosts()).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      {/* Full-bleed photo: background faded out, cutout of me on top, both
          from the same 4:3 frame so they line up exactly. */}
      <section className="relative overflow-hidden md:min-h-[760px]">
        <div className="relative z-10 mx-auto max-w-container-max px-4 pb-12 pt-24 md:flex md:min-h-[760px] md:items-end md:px-6 md:pb-32 md:pt-24">
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
                "ask Claude to alter divs.",
                "ship mobile apps.",
                "build agentic UX.",
                "solve challenging problems.",
                "love building dev tools.",
                "like capturing drone shots.",
                "like slow travelling.",
                "love riding my bike.",
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

      {/* Life story: one winding line from Silvassa to now */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6 md:pt-40">
        <Chapter
          id="story"
          title={
            <>
              The{" "}
              <span className={`${script.className} text-4xl md:text-5xl`}>
                story
              </span>{" "}
              so far
            </>
          }
        />
        <LifeTimeline />
        <Reveal className="mt-14">
          <Link href="/about" className={btnSecondary}>
            Detailed work experience <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      {/* Explore: writing and the drone. Projects and trips live on the timeline. */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        <Chapter title="Explore" />
        <div className="gap-4 sm:columns-2 lg:columns-3">
          {latestPosts.map((post) => (
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
        <Reveal className="mt-6">
          <Link href="/blog" className={btnSecondary}>
            Read the blog <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      {/* Say hello */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
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
            The best way to reach me is a message on LinkedIn. I reply about
            frontend roles, developer tools, or the best drone spots in
            Karnataka.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href={personalInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={btnPrimary}
            >
              <LinkedinIcon className="h-4 w-4" /> Message me on LinkedIn
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
