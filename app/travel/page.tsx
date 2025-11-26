import { Metadata } from "next"
import { TravelCard } from "@/components/TravelCard"
import { getTravelStories } from "@/lib/mdx"

export const metadata: Metadata = {
  title: "Travel Stories",
  description: "Adventures and experiences from around the world.",
}

export default async function TravelPage() {
  const stories = await getTravelStories()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Stories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Documenting my adventures, experiences, and stories from traveling around the world.
          </p>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No travel stories yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <TravelCard key={story.slug} {...story} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

