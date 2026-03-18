# DEV Community Clone

A dev.to-like platform built with modern TypeScript full-stack technologies.

## Tech Stack

- **Framework**: TanStack Start (React 19)
- **Routing**: TanStack Router (file-based)
- **Data Fetching**: TanStack Query + tRPC
- **Authentication**: Better Auth (email/password + GitHub OAuth)
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS v4 + Lucide React
- **Container**: Docker + Docker Compose

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/) & Docker Compose
- [GitHub OAuth App](https://github.com/settings/developers) (for GitHub login)

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url> devto-clone
cd devto-clone
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your values. See [SETUP_ENV.md](./SETUP_ENV.md) for detailed instructions on each variable.

### 3. Start PostgreSQL

```bash
docker compose up postgres -d
```

Wait for the healthcheck to pass:

```bash
docker compose ps  # STATUS should show "healthy"
```

### 4. Run Database Migrations

Generate and apply the initial migration:

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply Drizzle migrations |
| `npm run db:push` | Push schema directly (dev only) |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |
| `npm run typecheck` | Run TypeScript type checking |

## Docker (Full Stack)

To run both the app and PostgreSQL in Docker:

```bash
# Build and start everything
docker compose up --build -d

# Run migrations inside the app container
docker compose exec app npm run db:migrate

# View logs
docker compose logs -f app
```

## Drizzle Studio

View and manage your database with Drizzle Studio:

```bash
npm run db:studio
```

Then open [https://local.drizzle.studio](https://local.drizzle.studio) in your browser.

## Project Structure

```
devto-clone/
├── src/
│   ├── components/ui/    # shadcn/ui components
│   ├── db/               # Database schema & connection
│   │   ├── schema.ts     # Drizzle schema
│   │   └── index.ts      # DB connection
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Shared utilities
│   │   ├── auth.ts       # Better Auth server instance
│   │   ├── auth-client.ts # Better Auth client
│   │   ├── trpc.ts       # tRPC React client
│   │   └── utils.ts      # cn() utility
│   ├── routes/           # File-based routes
│   │   ├── __root.tsx    # Root layout
│   │   ├── index.tsx     # Home page (/)
│   │   ├── login.tsx     # Login page (/login)
│   │   ├── register.tsx  # Register page (/register)
│   │   ├── _authenticated.tsx  # Protected route guard
│   │   ├── _authenticated/
│   │   │   └── dashboard.tsx   # Protected dashboard
│   │   └── api/
│   │       ├── auth/$.ts       # Better Auth API handler
│   │       └── trpc/$.ts       # tRPC API handler
│   ├── server/           # tRPC server
│   │   ├── trpc.ts       # tRPC init & middleware
│   │   └── routers/      # tRPC routers
│   ├── styles/           # Global CSS
│   ├── env.ts            # Zod env validation
│   ├── router.tsx        # Router config
│   ├── entry-client.tsx  # Client entry
│   └── entry-server.tsx  # Server entry (SSR)
├── drizzle/              # Generated migrations
├── docker-compose.yml
├── Dockerfile
├── drizzle.config.ts
├── vite.config.ts
└── package.json
```

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page (shows user info if logged in) |
| `/login` | Public | Login with email/password or GitHub |
| `/register` | Public | Create a new account |
| `/dashboard` | Protected | Authenticated-only dashboard |

## License

MIT
