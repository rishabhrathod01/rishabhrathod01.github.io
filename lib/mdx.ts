import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const contentDirectory = path.join(process.cwd(), 'content')

export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  readingTime: string
  content: string
}

export interface TravelStory {
  slug: string
  title: string
  date: string
  location: string
  country: string
  description: string
  coverImage: string
  readingTime: string
  content: string
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDirectory = path.join(contentDirectory, 'blog')
  
  if (!fs.existsSync(blogDirectory)) {
    return []
  }

  const files = fs.readdirSync(blogDirectory)
  
  const posts = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const filePath = path.join(blogDirectory, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      const stats = readingTime(content)

      return {
        slug: file.replace('.mdx', ''),
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags || [],
        readingTime: stats.text,
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(contentDirectory, 'blog', `${slug}.mdx`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const stats = readingTime(content)

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      tags: data.tags || [],
      readingTime: stats.text,
      content,
    }
  } catch {
    return null
  }
}

export async function getTravelStories(): Promise<TravelStory[]> {
  const travelDirectory = path.join(contentDirectory, 'travel')
  
  if (!fs.existsSync(travelDirectory)) {
    return []
  }

  const files = fs.readdirSync(travelDirectory)
  
  const stories = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const filePath = path.join(travelDirectory, file)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      const stats = readingTime(content)

      return {
        slug: file.replace('.mdx', ''),
        title: data.title,
        date: data.date,
        location: data.location,
        country: data.country,
        description: data.description,
        coverImage: data.coverImage,
        readingTime: stats.text,
        content,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return stories
}

export async function getTravelStory(slug: string): Promise<TravelStory | null> {
  try {
    const filePath = path.join(contentDirectory, 'travel', `${slug}.mdx`)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const stats = readingTime(content)

    return {
      slug,
      title: data.title,
      date: data.date,
      location: data.location,
      country: data.country,
      description: data.description,
      coverImage: data.coverImage,
      readingTime: stats.text,
      content,
    }
  } catch {
    return null
  }
}

