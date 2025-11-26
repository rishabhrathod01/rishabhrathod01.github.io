import { Metadata } from "next"
import { BlogCard } from "@/components/BlogCard"
import { getBlogPosts } from "@/lib/mdx"

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles about web development, programming, and technology.",
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tech Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, programming, and the latest in tech.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} {...post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

