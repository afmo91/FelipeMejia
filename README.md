# Felipe Mejia Portfolio (Next.js 14)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000

Generate protected CV PDFs after editing `data/cv/base.json` or files in `data/cv/tweaks`:

```bash
npm run lint:cv
npm run generate:cv-pdfs
```

Regenerate the derived 3D portrait data after replacing `public/assets/user.jpg`:

```bash
npm run generate:portrait
```

## Environment Variables
Create `.env.local`:

```env
AUTH_SECRET=replace_this_with_random_secret
AUTH_USERNAME=admin
AUTH_PASSWORD=securePassword123
```

## Features
- Next.js 14 App Router + TypeScript
- Tailwind CSS dark theme
- Fixed reactive 3D point-cloud portrait from derived portrait data
- Blog from markdown
- Homepage sections for About, Resume, Portfolio, and Contact
- Interactive resume timeline from structured CV JSON
- Protected CV pages and static PDF downloads behind NextAuth middleware
