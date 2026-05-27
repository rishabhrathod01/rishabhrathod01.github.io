import { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles about web development, programming, and technology.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div>
      {/* ── Header ── */}
      <section className="py-section-gap bg-surface-container-lowest relative overflow-hidden">
        <div
          className="hero-glow opacity-20"
          style={{ top: "-5rem", right: "-5rem" }}
        />
        <div className="max-w-container-max mx-auto px-4 md:px-gutter relative z-10">
          <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-4">
            {'// WRITING'}
          </p>
          <h1 className="font-geist text-5xl md:text-7xl font-bold text-on-surface tracking-tight leading-[1.1] mb-6">
            Tech Blog
          </h1>
          <p className="text-lg text-slate-muted max-w-2xl leading-relaxed">
            Thoughts, tutorials, and insights about web development,
            programming, and the latest in tech.
          </p>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-4 md:px-gutter py-section-gap">
        {posts.length === 0 ? (
          <p className="text-slate-muted text-center py-16">
            No blog posts yet. Check back soon!
          </p>
        ) : (
          <>
            {/* ── Featured post ── */}
            {featured && (
              <div className="mb-16">
                <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-6">
                  {'// LATEST'}
                </p>
                <a href={`/blog/${featured.slug}`} className="block group">
                  <div className="glass-card rounded-2xl p-8 md:p-12 kinetic-hover">
                    <div className="flex items-center gap-4 text-slate-muted mb-4 font-jetbrains text-xs">
                      <span>{new Date(featured.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                      <span>·</span>
                      <span>{featured.readingTime}</span>
                    </div>
                    <h2 className="font-geist text-3xl md:text-4xl font-semibold text-on-surface mb-4 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-slate-muted text-lg leading-relaxed mb-6 max-w-3xl">
                      {featured.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featured.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-surface-container rounded font-jetbrains text-[10px] text-emerald uppercase tracking-widest border border-white/10"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </div>
            )}

            {/* ── Rest of posts ── */}
            {rest.length > 0 && (
              <>
                <p className="font-jetbrains text-xs font-semibold tracking-widest uppercase text-primary mb-8">
                  {'// ALL POSTS'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post, index) => (
                    <BlogCard key={post.slug} {...post} index={index} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ── Newsletter CTA ── */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter">
          <div className="glass-card rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-geist text-2xl font-semibold text-on-surface mb-2">
                Stay ahead of the curve
              </h3>
              <p className="text-slate-muted">
                Follow me for the latest articles on engineering and developer
                tooling.
              </p>
            </div>
            <a
              href={`https://twitter.com/rishabhrathod01`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary-dark rounded-2xl font-jetbrains text-xs font-semibold tracking-widest uppercase kinetic-hover"
            >
              Follow on X
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
