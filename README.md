# Rishabh Rathod - Personal Website

## ✨ Features

- **Modern Stack**: Next.js 15 App Router, TypeScript, TailwindCSS
- **Blog System**: MDX-powered blog with syntax highlighting
- **Travel Stories**: Dedicated section for travel experiences
- **SEO Optimized**: Meta tags, OpenGraph, and semantic HTML
- **Dark Mode**: Beautiful dark theme with smooth transitions
- **Animations**: Framer Motion for smooth, professional animations
- **Responsive**: Mobile-first design that works on all devices
- **Performance**: Optimized images, code splitting, and lazy loading
- **Type Safe**: Full TypeScript coverage
- **Design System**: Reusable UI components with shadcn/ui

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository** (if not already done)

```bash
git clone <your-repo-url>
cd portfolio
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
portfolio/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with header/footer
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── about/                   # About page
│   ├── projects/                # Projects page
│   ├── blog/                    # Blog listing and posts
│   │   └── [slug]/             # Dynamic blog post pages
│   └── travel/                  # Travel stories listing and posts
│       └── [slug]/             # Dynamic travel story pages
├── components/                   # React components
│   ├── ui/                      # shadcn UI components
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── Header.tsx               # Navigation header
│   ├── Footer.tsx               # Site footer
│   ├── ProjectCard.tsx          # Project display card
│   ├── BlogCard.tsx             # Blog post card
│   ├── TravelCard.tsx           # Travel story card
│   └── MDXContent.tsx           # MDX content renderer
├── content/                      # MDX content
│   ├── blog/                    # Blog posts
│   │   ├── getting-started-with-nextjs.mdx
│   │   ├── mastering-typescript.mdx
│   │   └── react-performance-optimization.mdx
│   └── travel/                  # Travel stories
│       ├── tokyo-adventures.mdx
│       ├── iceland-road-trip.mdx
│       └── bali-serenity.mdx
├── lib/                         # Utility functions
│   ├── utils.ts                # Utility helpers
│   ├── mdx.ts                  # MDX processing
│   └── data.ts                 # Site data (projects, experience, etc.)
├── public/                      # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
└── next.config.js              # Next.js config
```

## 🎨 Customization

### Personal Information

Edit `lib/data.ts` to update your personal information:

```typescript
export const personalInfo = {
  name: "Your Name",
  role: "Your Role",
  tagline: "Your tagline",
  email: "your@email.com",
  // ... more fields
};
```

### Projects

Add or modify projects in `lib/data.ts`:

```typescript
export const projects = [
  {
    title: "Project Name",
    description: "Project description",
    image: "image-url",
    tags: ["React", "Next.js"],
    liveUrl: "https://...",
    githubUrl: "https://...",
    featured: true,
  },
  // ... more projects
];
```

### Blog Posts

Create new blog posts in `content/blog/`:

```mdx
---
title: "Your Blog Post Title"
date: "2024-11-26"
description: "Brief description"
tags: ["JavaScript", "React"]
---

# Your Blog Post Title

Your content here...
```

### Travel Stories

Create new travel stories in `content/travel/`:

```mdx
---
title: "Your Travel Story"
date: "2024-11-26"
location: "City"
country: "Country"
description: "Brief description"
coverImage: "image-url"
---

# Your Travel Story

Your story here...
```

### Colors and Theming

Modify colors in `tailwind.config.ts` and `app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... more colors */
}
```

### Components

All UI components are in the `components/` directory. They use shadcn/ui patterns and can be easily customized.

## 📝 Content Management

### Adding Blog Posts

1. Create a new `.mdx` file in `content/blog/`
2. Add frontmatter with required fields
3. Write your content using Markdown/MDX
4. The blog will automatically include it

### Adding Travel Stories

1. Create a new `.mdx` file in `content/travel/`
2. Add frontmatter with required fields (including `coverImage`)
3. Write your story using Markdown/MDX
4. The travel page will automatically include it

### MDX Features

- **Syntax Highlighting**: Code blocks are automatically highlighted
- **GitHub Flavored Markdown**: Tables, task lists, strikethrough
- **Custom Components**: Use React components in your MDX
- **Auto-linking Headings**: Headings get automatic anchor links

## 🎯 SEO Optimization

The site includes:

- Dynamic meta tags for each page
- OpenGraph tags for social sharing
- Twitter Card support
- Semantic HTML structure
- Automatic sitemap generation
- Reading time calculation
- Structured data (can be extended)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy with one click
4. Connect custom domain (optional)

### Netlify

1. Push your code to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Deploy

### Other Platforms

Build the production version:

```bash
npm run build
npm run start
```

The site will be available on `http://localhost:3000`

## 🛠️ Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🧰 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Content**: [MDX](https://mdxjs.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Syntax Highlighting**: [rehype-highlight](https://github.com/rehypejs/rehype-highlight)

## 📦 Key Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^18.3.1",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^11.0.0",
  "next-mdx-remote": "^4.4.1",
  "gray-matter": "^4.0.3",
  "rehype-highlight": "^7.0.0"
}
```

## 🎨 Design Philosophy

The design follows these principles:

- **Clean & Minimal**: Focus on content, not clutter
- **Professional**: Suitable for showcasing work
- **Modern**: Contemporary design patterns
- **Accessible**: WCAG compliant, keyboard navigable
- **Performant**: Fast loading, optimized assets
- **Responsive**: Mobile-first approach

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome)

## 🤝 Contributing

This is a personal portfolio template. Feel free to:

- Fork and customize for your own use
- Report bugs or issues
- Suggest improvements
- Share your customized version

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips

1. **Images**: Use optimized images (WebP format recommended)
2. **Content**: Keep blog posts under 2000 words for better engagement
3. **SEO**: Use descriptive titles and meta descriptions
4. **Performance**: Test with Lighthouse regularly
5. **Accessibility**: Always include alt text for images
6. **Git**: Commit regularly with descriptive messages

## 🐛 Troubleshooting

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

### MDX Not Rendering

- Check frontmatter format (must be valid YAML)
- Ensure file extension is `.mdx`
- Verify file is in correct directory (`content/blog` or `content/travel`)

### Styling Issues

- Clear Tailwind cache: `rm -rf .next`
- Check class names for typos
- Verify Tailwind config is correct

## 📞 Support

For issues or questions:

1. Check this README
2. Review the code comments
3. Check Next.js documentation
4. Open an issue on GitHub

## 🎉 Acknowledgments

- Design inspiration from various modern portfolio websites
- Built with amazing open-source tools
- Icons from Lucide
- Images from Unsplash

---

**Built with ❤️ using Next.js and TypeScript**

Happy coding! 🚀
