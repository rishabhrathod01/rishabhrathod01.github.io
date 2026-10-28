import { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { Reveal } from "@/components/home/Reveal";
import { ArrowRight } from "@/components/icons";
import { getBlogPosts } from "@/lib/mdx";
import { personalInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles about web development, programming, and technology.",
};

const btnPrimary =
  "inline-flex items-center gap-2 rounded-lg bg-on-surface px-3 py-2 text-base font-semibold text-surface transition-opacity hover:opacity-85 active:scale-[0.98]";
const tag =
  "rounded border border-line bg-surface px-2 py-0.5 text-xs font-semibold text-slate-muted";

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div>
      {/* Header */}
      <section className="mx-auto max-w-container-max px-4 pb-24 pt-24 md:px-6 md:pt-32">
        <Reveal>
          <p className="eyebrow">Blog</p>
          <h1 className="text-gradient mt-4 max-w-[680px] text-5xl font-bold leading-none md:text-6xl">
            Writing
          </h1>
          <p className="mt-6 max-w-[680px] text-lg text-slate-muted">
            Notes on frontend engineering, developer tooling, and what I am
            learning along the way.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        {posts.length === 0 ? (
          <p className="text-slate-muted">No posts yet.</p>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Reveal className="mb-16">
                <p className="eyebrow mb-4">Latest post</p>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group block rounded-2xl border border-line bg-surface-container p-8 transition-colors hover:bg-surface-container-high md:p-12"
                >
                  <p className="eyebrow">
                    {new Date(featured.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    · {featured.readingTime}
                  </p>
                  <h2 className="mt-4 max-w-[760px] text-3xl font-bold text-on-surface md:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-[680px] text-lg text-slate-muted">
                    {featured.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {featured.tags.map((t) => (
                      <span key={t} className={tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 font-semibold text-on-surface">
                    Read the post
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            )}

            {/* Rest of posts */}
            {rest.length > 0 && (
              <>
                <p className="eyebrow mb-4">Earlier posts</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {rest.map((post, index) => (
                    <BlogCard key={post.slug} {...post} index={index} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* Follow CTA */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-6">
        <Reveal className="max-w-[680px]">
          <h2 className="text-3xl font-bold text-on-surface md:text-4xl">
            Get new posts as they land
          </h2>
          <p className="mt-4 text-lg text-slate-muted">
            I share every new article on engineering and developer tooling on X.
          </p>
          <a
            href={personalInfo.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnPrimary} mt-8`}
          >
            Follow on X
          </a>
        </Reveal>
      </section>
    </div>
  );
}
