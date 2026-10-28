import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/components/icons";
import { getBlogPost, getBlogPosts } from "@/lib/mdx";
import { MDXContent } from "@/components/MDXContent";
import { CurriculumTodoList } from "@/components/CurriculumTodoList";
import { TrackedLink } from "@/components/TrackedLink";

const btnSecondary =
  "inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-base font-semibold text-on-surface transition-colors hover:bg-surface-container active:scale-[0.98]";

const CURRICULUM_TODO_SLUG = "system-design-learning-path-12-week-curriculum";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-[760px] px-4 pb-24 pt-24 md:px-6 md:pt-32">
      <div className="sticky top-16 z-40 -mx-4 mb-8 bg-surface/90 px-4 py-2 backdrop-blur md:-mx-6 md:px-6">
        <TrackedLink
          href="/blog"
          gaLabel="Back to Blog"
          gaLocation="blog_post_sticky"
          className={btnSecondary}
        >
          <ArrowLeft className="h-4 w-4" />
          All posts
        </TrackedLink>
      </div>

      <article>
        <header className="mb-12">
          <p className="eyebrow">
            {formattedDate} · {post.readingTime}
          </p>
          <h1 className="text-gradient mt-4 max-w-[680px] text-5xl font-bold leading-none md:text-6xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-6 max-w-[680px] text-lg text-slate-muted">
              {post.description}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-line bg-surface px-2 py-0.5 text-xs font-semibold text-slate-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {slug === CURRICULUM_TODO_SLUG ? (
          <CurriculumTodoList />
        ) : (
          <MDXContent source={post.content} />
        )}

        <footer className="mt-16">
          <TrackedLink
            href="/blog"
            gaLabel="Back to All Posts"
            gaLocation="blog_post_footer"
            className={btnSecondary}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </TrackedLink>
        </footer>
      </article>
    </div>
  );
}
