# Customization Guide

This guide will help you personalize your portfolio to match your style and brand.

## 🎨 Quick Customization (5 Minutes)

### 1. Personal Information

Edit `lib/data.ts`:

```typescript
export const personalInfo = {
  name: "Your Full Name",
  role: "Your Job Title",
  tagline: "Your personal tagline or motto",
  email: "your.email@example.com",
  location: "Your City, Country",
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://www.linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
  },
  about: {
    short: "One paragraph about yourself",
    long: "Extended bio with more details",
  },
  resume: "/your-resume.pdf", // Add PDF to public folder
}
```

### 2. Update Skills

In the same file (`lib/data.ts`):

```typescript
export const skills = {
  languages: ["Your", "Programming", "Languages"],
  frameworks: ["Your", "Frameworks"],
  tools: ["Your", "Tools"],
  design: ["Your", "Design", "Skills"],
}
```

### 3. Add Your Projects

Replace the example projects:

```typescript
export const projects = [
  {
    title: "Your Project Name",
    description: "Brief description of what it does",
    image: "https://your-image-url.com/image.jpg",
    tags: ["Technology", "Used"],
    liveUrl: "https://your-live-site.com",
    githubUrl: "https://github.com/you/repo",
    featured: true, // Shows on homepage
  },
  // Add more projects...
]
```

### 4. Update Experience

Add your work experience:

```typescript
export const experience = [
  {
    company: "Company Name",
    position: "Your Position",
    period: "Start Year - End Year (or Present)",
    description: "What you did in this role",
    achievements: [
      "Key achievement 1",
      "Key achievement 2",
      "Key achievement 3",
    ],
  },
  // Add more experiences...
]
```

## 🎨 Styling Customization

### Color Scheme

Edit `app/globals.css` to change colors:

```css
:root {
  /* Light mode colors */
  --primary: 222.2 47.4% 11.2%;        /* Main brand color */
  --secondary: 210 40% 96.1%;           /* Secondary elements */
  --accent: 210 40% 96.1%;              /* Accent color */
  --background: 0 0% 100%;              /* Page background */
  --foreground: 222.2 84% 4.9%;         /* Text color */
  
  /* More colors... */
}

.dark {
  /* Dark mode colors */
  --primary: 210 40% 98%;
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  
  /* More colors... */
}
```

### Pre-made Color Schemes

#### Professional Blue

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}
```

#### Creative Purple

```css
:root {
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 40% 98%;
}
```

#### Energetic Orange

```css
:root {
  --primary: 24.6 95% 53.1%;
  --primary-foreground: 60 9.1% 97.8%;
}
```

#### Nature Green

```css
:root {
  --primary: 142.1 76.2% 36.3%;
  --primary-foreground: 355.7 100% 97.3%;
}
```

### Typography

Change fonts by editing `app/layout.tsx`:

```typescript
import { Inter, Roboto, Poppins } from "next/font/google"

// Choose your font
const myFont = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"] 
})

// Apply it
<body className={myFont.className}>
```

Popular font combinations:
- **Modern**: Inter + Inter
- **Professional**: Roboto + Roboto Slab
- **Creative**: Poppins + Poppins
- **Elegant**: Playfair Display + Source Sans Pro

## 🖼️ Images and Assets

### Profile Picture

Add your photo:

1. Add image to `public/images/profile.jpg`
2. Update the home page to include it

### Project Images

For project thumbnails:
- Recommended size: 800x600px
- Format: WebP or JPG
- Optimize with tools like [TinyPNG](https://tinypng.com)

### Favicon

Replace default favicon:

1. Create favicon at [Favicon.io](https://favicon.io)
2. Add files to `public/` directory:
   - `favicon.ico`
   - `apple-touch-icon.png`
   - `favicon-16x16.png`
   - `favicon-32x32.png`

Update `app/layout.tsx`:

```typescript
export const metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}
```

## 📝 Content Customization

### Homepage Sections

Edit `app/page.tsx` to:

- Reorder sections
- Remove sections you don't need
- Add new sections

Example: Remove travel CTA:

```typescript
// Comment out or delete this section
{/* 
<section className="py-20">
  <Link href="/travel">Travel Stories</Link>
</section>
*/}
```

### Navigation Menu

Edit `components/Header.tsx`:

```typescript
const navigation = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  // Add or remove items
  { name: "Contact", href: "/contact" },
]
```

### Footer

Edit `components/Footer.tsx` to customize:

- Links
- Social icons
- Copyright text
- Additional sections

## 🎭 Advanced Customization

### Animation Speed

Edit animation delays in components. For example, in `components/ProjectCard.tsx`:

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ 
    duration: 0.5,        // Change this
    delay: index * 0.1    // And this
  }}
>
```

### Card Styles

Customize cards in `components/ui/card.tsx`:

```typescript
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        // Add more classes:
        "hover:shadow-lg transition-all duration-300",
        "border-2 hover:border-primary",
        className
      )}
      {...props}
    />
  )
)
```

### Button Styles

Edit `components/ui/button.tsx` to add custom variants:

```typescript
const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        // ... existing variants
        // Add custom variant
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      },
    },
  }
)
```

Use it:

```typescript
<Button variant="gradient">Click Me</Button>
```

## 🌐 SEO Customization

### Meta Tags

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: {
    default: "Your Name - Your Title",
    template: "%s | Your Name",
  },
  description: "Your custom description for search engines",
  keywords: ["your", "keywords", "here"],
  authors: [{ name: "Your Name" }],
  // ... more SEO settings
}
```

### OpenGraph Images

Create social sharing images:

1. Size: 1200x630px
2. Add to `public/og-image.jpg`
3. Update metadata:

```typescript
openGraph: {
  images: ['/og-image.jpg'],
}
```

## 📱 Responsive Design

### Breakpoint Customization

Edit `tailwind.config.ts`:

```typescript
theme: {
  screens: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
    // Add custom breakpoints
    'tablet': '900px',
  },
}
```

Use them:

```typescript
<div className="hidden tablet:block">
  Visible on tablets and up
</div>
```

## 🔧 Component Customization

### Add New Page

1. Create file: `app/newpage/page.tsx`

```typescript
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Page",
  description: "Description of new page",
}

export default function NewPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">New Page</h1>
      {/* Your content */}
    </div>
  )
}
```

2. Add to navigation in `components/Header.tsx`

### Create Custom Component

Example: Testimonials component

Create `components/Testimonial.tsx`:

```typescript
interface TestimonialProps {
  quote: string
  author: string
  role: string
  image?: string
}

export function Testimonial({ quote, author, role, image }: TestimonialProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <p className="text-muted-foreground italic mb-4">"{quote}"</p>
      <div className="flex items-center gap-4">
        {image && (
          <img src={image} alt={author} className="w-12 h-12 rounded-full" />
        )}
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  )
}
```

Use it:

```typescript
<Testimonial
  quote="Great developer to work with!"
  author="John Doe"
  role="CEO at Company"
  image="/john.jpg"
/>
```

## 🎯 Common Customizations

### Remove Blog Section

1. Delete `app/blog` folder
2. Remove blog link from `components/Header.tsx`
3. Remove blog CTA from `app/page.tsx`
4. Delete `content/blog` folder

### Remove Travel Section

1. Delete `app/travel` folder
2. Remove travel link from `components/Header.tsx`
3. Delete `content/travel` folder

### Add Contact Form

Install form library:

```bash
npm install react-hook-form
```

Create `app/contact/page.tsx`:

```typescript
"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    // Handle form submission
    console.log(data)
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Contact Me</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <input
          {...register("name")}
          placeholder="Your Name"
          className="w-full p-2 border rounded"
        />
        <input
          {...register("email")}
          type="email"
          placeholder="Your Email"
          className="w-full p-2 border rounded"
        />
        <textarea
          {...register("message")}
          placeholder="Your Message"
          rows={5}
          className="w-full p-2 border rounded"
        />
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  )
}
```

## 🐛 Testing Your Changes

After customizing:

```bash
# 1. Check for errors
npm run build

# 2. Test locally
npm run dev

# 3. Test production build
npm run build && npm run start

# 4. Check different viewports
# Use browser dev tools responsive mode

# 5. Test dark mode
# Toggle dark mode button in header
```

## 📚 Resources

### Design Inspiration
- [Dribbble](https://dribbble.com/search/portfolio)
- [Awwwards](https://www.awwwards.com/)
- [Behance](https://www.behance.net/)

### Color Tools
- [Coolors](https://coolors.co/) - Color palette generator
- [Adobe Color](https://color.adobe.com/) - Color wheel
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)

### Icon Resources
- [Lucide Icons](https://lucide.dev/) - Already included
- [Heroicons](https://heroicons.com/)
- [Feather Icons](https://feathericons.com/)

### Image Resources
- [Unsplash](https://unsplash.com/) - Free stock photos
- [Pexels](https://www.pexels.com/) - Free stock photos
- [TinyPNG](https://tinypng.com/) - Image compression

## 💡 Pro Tips

1. **Keep it Simple**: Don't over-customize. Clean and simple often works best.

2. **Stay Consistent**: Use the same spacing, colors, and fonts throughout.

3. **Test Everything**: After every change, test on mobile and desktop.

4. **Git Commits**: Commit after each major customization:
   ```bash
   git add .
   git commit -m "Updated color scheme"
   ```

5. **Backup**: Keep your original `lib/data.ts` backed up before major changes.

6. **Performance**: After adding images, always optimize them.

7. **Accessibility**: Maintain good color contrast and keyboard navigation.

## ❓ Need Help?

- Check the main `README.md`
- Review component files for examples
- Consult [Next.js docs](https://nextjs.org/docs)
- Ask in [Next.js Discord](https://discord.gg/nextjs)

---

**Happy customizing! Make it yours! 🎨**

