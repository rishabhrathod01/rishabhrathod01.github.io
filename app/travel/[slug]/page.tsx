import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react"
import { getTravelStory, getTravelStories } from "@/lib/mdx"
import { MDXContent } from "@/components/MDXContent"
import { Button } from "@/components/ui/button"

interface TravelStoryPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const stories = await getTravelStories()
  return stories.map((story) => ({
    slug: story.slug,
  }))
}

export async function generateMetadata({ params }: TravelStoryPageProps): Promise<Metadata> {
  const story = await getTravelStory(params.slug)

  if (!story) {
    return {
      title: "Story Not Found",
    }
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
  }
}

export default async function TravelStoryPage({ params }: TravelStoryPageProps) {
  const story = await getTravelStory(params.slug)

  if (!story) {
    notFound()
  }

  const formattedDate = new Date(story.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-4xl mx-auto">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/travel">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Travel Stories
          </Link>
        </Button>

        <div className="relative h-[400px] w-full rounded-xl overflow-hidden mb-8">
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{story.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{story.location}, {story.country}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{story.readingTime}</span>
            </div>
          </div>

          <p className="text-lg text-muted-foreground">{story.description}</p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXContent source={story.content} />
        </div>

        <footer className="mt-12 pt-8 border-t">
          <Button asChild>
            <Link href="/travel">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Stories
            </Link>
          </Button>
        </footer>
      </article>
    </div>
  )
}

