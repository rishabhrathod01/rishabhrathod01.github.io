# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # Run ESLint
npm run export     # Build for static export (used before deploy)
npm run deploy     # Build + deploy to GitHub Pages via gh-pages CLI
```

There are no tests in this project.

## Architecture

This is a **Next.js 15 App Router** personal portfolio, statically exported to GitHub Pages.

### Key constraint: static export

`next.config.js` sets `output: 'export'` and disables image optimization (`unoptimized: true`). This means:

- No server-side features (no API routes, no middleware)
- All pages must be statically renderable at build time
- Dynamic routes (`/blog/[slug]`, `/travel/[slug]`) require `generateStaticParams()`

### Content system

Blog posts live in `content/blog/` and travel stories in `content/travel/` as `.mdx` files. `lib/mdx.ts` handles all content loading — it reads files at build time, parses YAML frontmatter with `gray-matter`, and computes reading time.

**Blog post frontmatter:**

```yaml
title: "Post Title"
date: "2025-02-16"
description: "Brief description"
tags: ["Tag1", "Tag2"]
author: "Author Name"
coverImage: "optional-url"
```

**Travel story frontmatter:**

```yaml
title: "Story Title"
date: "2025-02-16"
location: "City"
country: "Country"
description: "Brief description"
coverImage: "image-url"
```

### Personal data

All personal info, experience, and skills are centralized in `lib/data.ts`. Edit there rather than scattered across components.

### Styling

TailwindCSS with a CSS variable-based color system (HSL values defined in `globals.css`). Dark mode via class toggling — the toggle script runs in `app/layout.tsx` using `localStorage`. Framer Motion handles animations.

### UI components

shadcn/ui components live in `components/ui/`. Lucide React is used for icons. Radix UI provides the accessible primitives underneath shadcn/ui.

### Routes

| Route            | Purpose                       |
| ---------------- | ----------------------------- |
| `/`              | Home                          |
| `/about`         | About page                    |
| `/projects`      | Projects listing              |
| `/blog`          | Blog listing                  |
| `/blog/[slug]`   | Individual blog post (MDX)    |
| `/travel`        | Travel stories listing        |
| `/travel/[slug]` | Individual travel story (MDX) |

### MDX rendering

`components/MDXContent.tsx` renders MDX. The pipeline uses `react-markdown` with `remark-gfm`, `rehype-highlight` (syntax highlighting), and `rehype-slug` (anchor links on headings).
