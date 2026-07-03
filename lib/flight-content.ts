// Server-only: assembles the serializable content payload for the drone
// flight experience at build time. Replaces the API route the static export
// can't have. Import this ONLY from server components (app/page.tsx).

import { getBlogPosts, getTravelStories } from "@/lib/mdx";
import { personalInfo, experience, projects, droneVideos } from "@/lib/data";
import type { FlightContent } from "@/components/drone/types";

export async function buildFlightContent(): Promise<FlightContent> {
  const [blogs, travel] = await Promise.all([
    getBlogPosts(),
    getTravelStories(),
  ]);

  return {
    personal: {
      name: personalInfo.name,
      role: personalInfo.role,
      tagline: personalInfo.tagline,
      location: personalInfo.location,
      email: personalInfo.email,
      aboutShort: personalInfo.about.short,
      aboutLong: personalInfo.about.long,
      resume: personalInfo.resume,
      social: { ...personalInfo.social },
    },
    experience: experience.map(
      ({ company, position, period, description, achievements }) => ({
        company,
        position,
        period,
        description,
        achievements: [...achievements],
      })
    ),
    projects: projects
      .filter((p) => p.featured)
      .map(({ title, description, tags, liveUrl, githubUrl }) => ({
        title,
        description,
        tags: [...tags],
        liveUrl,
        githubUrl,
      })),
    // Metadata only — never pass MDX `content` bodies, they'd ship in the
    // home page's RSC payload.
    blogs: blogs.slice(0, 6).map(({ slug, title, date, readingTime, tags }) => ({
      slug,
      title,
      date,
      readingTime,
      tags: [...tags],
    })),
    travel: travel.slice(0, 6).map(({ slug, title, date, location, country }) => ({
      slug,
      title,
      date,
      location,
      country,
    })),
    videos: droneVideos.map((v) => ({ ...v })),
  };
}
