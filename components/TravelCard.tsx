"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TravelCardProps {
  slug: string
  title: string
  description: string
  date: string
  location: string
  country: string
  coverImage: string
  readingTime: string
  index?: number
}

export function TravelCard({
  slug,
  title,
  description,
  date,
  location,
  country,
  coverImage,
  readingTime,
  index = 0,
}: TravelCardProps) {
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
      <Link href={`/travel/${slug}`}>
        <Card className="overflow-hidden h-full hover:shadow-lg transition-all hover:border-primary">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardHeader>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location}, {country}</span>
              </div>
            </div>
            <CardTitle className="hover:text-primary transition-colors">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

