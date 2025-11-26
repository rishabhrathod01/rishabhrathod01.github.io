"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BlogCardProps {
  slug: string
  title: string
  description: string
  date: string
  readingTime: string
  tags: string[]
  index?: number
}

export function BlogCard({
  slug,
  title,
  description,
  date,
  readingTime,
  tags,
  index = 0,
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${slug}`}>
        <Card className="h-full hover:shadow-lg transition-all hover:border-primary">
          <CardHeader>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime}</span>
              </div>
            </div>
            <CardTitle className="hover:text-primary transition-colors">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

