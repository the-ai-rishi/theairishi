# The AI Rishi — Production Deployment & Operations Guide

This manual covers build verification, deployment prerequisites, environment variables, image assets, performance optimizations, and security checks for deploying **The AI Rishi** (`https://theairishi.com`) to production.

---

## 1. Prerequisites & Stack

- **Node.js**: v18.x or v20.x
- **Framework**: Next.js 16.3+ (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

---

## 2. Environment Variables

Create `.env.local` or set environmental variables in your production host (Vercel, AWS Amplify, Netlify, or custom VPS):

```env
NEXT_PUBLIC_SITE_URL=https://theairishi.com
```

---

## 3. Local Development & Build Commands

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run production build & static generation
npm run build

# Start production server locally
npm run start
```

---

## 4. Production Checklist

1. **Clean Production Build**: Run `npm run build` and ensure exit code `0` with zero TypeScript errors.
2. **Canonical Logo Assets**: Verify that `public/brand/logo-horizontal.png` is used for headers and footers.
3. **No Hardcoded Taglines**: Confirm old tagline (`ANCIENT WISDOM. MODERN INTELLIGENCE.`) does not appear anywhere.
4. **Sitemap & Robots**: Access `/sitemap.xml` and `/robots.txt` to verify dynamic route output.
5. **Content Status Check**: Ensure draft content is marked `status: "draft"` or `enabled: false` before deploying.
6. **Images**: Ensure all Markdown images are located inside `public/content/images/<topic>/` and use relative public paths (`/content/images/...`).

---

## 5. Hosting Deployment (Vercel / Next.js)

1. Push your repository to GitHub (`main` branch).
2. Import the project into Vercel or your hosting platform.
3. Build Command: `npm run build`
4. Output Directory: `.next`
5. Node.js Version: 20.x

---

## 6. Performance & Core Web Vitals

- **Server Components**: All content, topic, guide, and project pages are server-rendered static HTML (SSG/ISR ready).
- **Asset Caching**: Static images in `public/` are cached aggressively with immutable headers by Next.js.
- **Font Optimization**: Geist font is loaded via standard Next.js font optimization.
