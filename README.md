# FelipeOS

Premium personal portfolio and commercial workspace for Felipe Mejia: product, growth and AI systems, public CV, proof of work, and private admin tooling.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Framer Motion for workspace transitions
- NextAuth credentials login for private admin access
- Local JSON CV data for the MVP
- React PDF generation for CV PDFs

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local`:

```env
AUTH_SECRET=replace_this_with_random_secret
AUTH_USERNAME=admin
AUTH_PASSWORD=securePassword123
```

## CV Workflow

The public CV is visible at `/cv` and downloadable at `/cv/felipe-mejia-public-cv.pdf`.

Source files:

- `data/cv/public.json`: public CV source of truth
- `data/cv/base.json`: mirrored public CV for existing scripts
- `data/cv/versions/*.json`: tailored application versions
- `public/cv/felipe-mejia-public-cv.pdf`: public downloadable PDF

Generate CV PDFs after editing CV JSON:

```bash
npm run lint:cv
npm run generate:cv-pdfs
```

The `/admin` workspace is protected by NextAuth and can edit the public CV JSON locally, create tailored versions, and link to available PDF downloads. Local JSON writes are suitable for this MVP/admin workflow; before multi-user production editing, move CV storage to a database or managed CMS.

## Features

- FelipeOS Command Center with Services, Systems, Proof of Work, Experience, CV, Contact, and Hey Felipe command dock
- Commercial services for AI workflow sprints, growth audits, AI assistant builds, and MVP/product builds
- Safe representative proof-of-work case studies without client-sensitive data
- Public CV page and download
- Footer-only admin access
- Private admin CV workspace
