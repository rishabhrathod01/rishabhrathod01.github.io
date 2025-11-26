# Deployment Guide

This guide covers deploying your portfolio to various platforms. Choose the one that best fits your needs.

## 📋 Pre-Deployment Checklist

Before deploying, make sure you:

- [ ] Update personal information in `lib/data.ts`
- [ ] Add your own projects
- [ ] Customize colors and theme
- [ ] Add your own blog posts and travel stories
- [ ] Update social media links
- [ ] Test locally with `npm run build && npm run start`
- [ ] Check for TypeScript errors: `npm run build`
- [ ] Test on mobile devices
- [ ] Verify all images load correctly
- [ ] Check SEO meta tags
- [ ] Update README with your information

## 🚀 Vercel (Recommended)

Vercel is made by the creators of Next.js and provides the best Next.js hosting experience.

### Why Vercel?

- ✅ Zero configuration
- ✅ Automatic deployments
- ✅ Preview deployments for PRs
- ✅ Edge network (fast globally)
- ✅ Generous free tier
- ✅ Custom domains
- ✅ Analytics built-in

### Deployment Steps

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure (if needed)**

   - Framework Preset: Next.js
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Deploy**

   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live!

5. **Custom Domain (Optional)**

   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions
   - SSL is automatic

### Environment Variables

If you add environment variables later:

1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy (or they'll be used on next deployment)

### Automatic Deployments

Every push to `main` branch automatically deploys. Every PR gets a preview deployment.

## 🌐 Netlify

Netlify is another excellent hosting platform with similar features to Vercel.

### Deployment Steps

1. **Push to GitHub** (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Netlify**

   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**

   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy site"

4. **Custom Domain**

   - Go to Site settings → Domain management
   - Add custom domain
   - Configure DNS
   - SSL is automatic

### netlify.toml (Optional)

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## 🐳 Docker

For self-hosting or deployment to platforms like AWS, DigitalOcean, or Heroku.

### Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### .dockerignore

Create a `.dockerignore` file:

```
node_modules
.next
.git
.gitignore
README.md
npm-debug.log
```

### Build and Run

```bash
# Build
docker build -t portfolio .

# Run
docker run -p 3000:3000 portfolio
```

## 🔧 Static Export (GitHub Pages, etc.)

For static hosting on GitHub Pages, S3, or any static host.

### 1. Modify next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

module.exports = nextConfig
```

### 2. Build

```bash
npm run build
```

This creates an `out` directory with static files.

### 3. Deploy to GitHub Pages

Add to `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && touch out/.nojekyll && gh-pages -d out -t true"
  }
}
```

Install gh-pages:

```bash
npm install --save-dev gh-pages
```

Deploy:

```bash
npm run deploy
```

Configure GitHub Pages to use the `gh-pages` branch.

## 🔒 Environment Variables

### Local Development

Create `.env.local`:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Production

Add environment variables in your hosting platform:

**Vercel/Netlify:**
- Go to Project Settings → Environment Variables
- Add variables
- Prefix public variables with `NEXT_PUBLIC_`

## 🎯 Performance Optimization

### Before Deployment

1. **Optimize Images**
   - Use WebP format
   - Compress images
   - Use appropriate sizes

2. **Code Splitting**
   - Already handled by Next.js
   - Use dynamic imports for large components

3. **Fonts**
   - Use `next/font` (already configured)
   - Preload important fonts

4. **Analytics**
   - Add Google Analytics or Plausible
   - Monitor Core Web Vitals

### After Deployment

1. **Test with Lighthouse**
   - Aim for 90+ scores
   - Fix any issues

2. **Monitor Performance**
   - Use Vercel Analytics or Google Analytics
   - Track Core Web Vitals

3. **SEO Check**
   - Submit sitemap to Google Search Console
   - Verify meta tags
   - Test social sharing

## 🌍 Custom Domain Setup

### Purchase Domain

Buy from:
- [Namecheap](https://namecheap.com)
- [Google Domains](https://domains.google)
- [Cloudflare](https://cloudflare.com)

### Configure DNS

#### For Vercel:

Add these records to your DNS:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

#### For Netlify:

```
Type    Name    Value
A       @       75.2.60.5
CNAME   www     your-site.netlify.app
```

### SSL Certificate

- Automatically provisioned by Vercel/Netlify
- Usually takes 5-15 minutes
- Forced HTTPS by default

## 📊 Post-Deployment

### 1. Submit Sitemap

Create `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yoursite.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://yoursite.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://yoursite.com/projects',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://yoursite.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
```

Submit to:
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### 2. Add Analytics

**Google Analytics:**

Add to `app/layout.tsx`:

```typescript
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 3. Social Media

Share your portfolio on:
- LinkedIn
- Twitter
- Reddit (r/webdev)
- Dev.to
- Hacker News (if appropriate)

## 🐛 Troubleshooting

### Build Fails

**Error: Type errors**
```bash
# Fix TypeScript errors
npm run build
# Check the errors and fix them
```

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Deployment Issues

**Images not loading:**
- Check image URLs
- Verify domains in `next.config.js`
- Use relative paths for local images

**404 on routes:**
- Verify file structure
- Check for typos in filenames
- Clear build cache

**Slow performance:**
- Optimize images
- Check bundle size
- Enable compression
- Use CDN for assets

## 📞 Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Next.js Discord](https://discord.gg/nextjs)

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] All tests passing
- [ ] Personal information updated
- [ ] Environment variables configured
- [ ] Custom domain purchased (if using)
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Images loading
- [ ] Forms working (if any)
- [ ] Analytics installed
- [ ] Sitemap submitted
- [ ] Social media cards tested
- [ ] Mobile tested
- [ ] Performance tested (Lighthouse)
- [ ] SEO checked

---

**Congratulations on deploying your portfolio! 🎉**

Remember to keep your content updated and share it with the world!

