# IRON Creator OS

**AI-Powered Content Engine for Livestream Creators**

IRON Creator OS turns one livestream into a complete content engine. AI automatically detects viral moments, generates 30+ short-form clips with captions and hooks, then publishes them across every social platform — while also producing sponsorship reports, revenue dashboards, and community management tools.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | TailwindCSS + shadcn/ui |
| **Auth** | Clerk |
| **Database** | PostgreSQL via Supabase + Prisma ORM |
| **Payments** | Stripe |
| **AI** | OpenAI (GPT-4o, Whisper) |
| **State** | Zustand + TanStack Query |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |

## Architecture

Full architecture documentation is in [`/home/team/shared/architecture/`](/home/team/shared/architecture/):
- [System Architecture](/home/team/shared/architecture/SYSTEM_ARCHITECTURE.md)
- [Database Schema](/home/team/shared/architecture/DATABASE_SCHEMA.md)
- [API Design](/home/team/shared/architecture/API_DESIGN.md)
- [Page Design](/home/team/shared/architecture/PAGE_DESIGN.md)

## Getting Started

### Prerequisites

- Node.js 18+
- Bun or npm
- A Supabase project
- Clerk account
- Stripe account
- OpenAI API key

### Setup

1. **Clone and install dependencies:**

```bash
cd iron-creator-os
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Fill in all required environment variables (see `.env.example` for documentation).

3. **Set up the database:**

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Or create and apply migrations (production)
npx prisma migrate dev --name init
```

4. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | TypeScript type checking |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create and apply migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed the database |

## Project Structure

```
src/
├── app/                     # App Router pages + layouts
│   ├── (auth)/              # Auth pages (sign-in, sign-up, OAuth)
│   ├── (dashboard)/         # Main app shell with sidebar
│   │   ├── dashboard/       # Overview dashboard
│   │   ├── streams/         # Stream management
│   │   ├── clips/           # Clip library + editor
│   │   ├── publishing/      # Social publishing queue
│   │   ├── analytics/       # Dashboards
│   │   ├── sponsorships/    # Campaign management
│   │   ├── revenue/         # Revenue tracking
│   │   ├── community/       # Community inbox
│   │   └── settings/        # Account + team settings
│   ├── (admin)/             # Admin panel
│   └── api/                 # API route handlers
├── components/              # Reusable UI components
│   ├── ui/                  # shadcn/ui primitives
│   ├── layout/              # App shell, sidebar, navbar
│   └── shared/              # Cross-module shared components
├── lib/                     # Business logic + clients
│   ├── supabase/            # Supabase client + helpers
│   ├── clerk/               # Clerk helpers
│   ├── stripe/              # Stripe helpers
│   ├── openai/              # OpenAI helpers
│   ├── db/                  # Prisma client singleton
│   └── utils/               # Generic utilities
├── hooks/                   # Custom React hooks
├── stores/                  # Zustand stores
├── types/                   # Shared TypeScript types
└── config/                  # App configuration constants
prisma/
└── schema.prisma            # Database schema
```

## Design System

IRON Creator OS uses a dark-first design system with:
- Deep navy background (`#0A0A0F`)
- Purple-blue accent (`#6C5CE7`)
- Glassmorphism on elevated surfaces
- Custom animations (fade-in, slide-up, scale-in)
- Inter for body text, JetBrains Mono for code

## License

Proprietary. All rights reserved.
