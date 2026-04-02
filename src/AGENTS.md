# Source Code — src/

Main application source directory.

## STRUCTURE

```
src/
├── routes/           # File-based TanStack Router routes
├── features/         # Feature-sliced modules
├── server/           # tRPC server setup
├── db/               # Database schema & connection
├── components/       # Shared UI components
│   ├── ui/           # shadcn/ui primitives
│   └── layout/       # Layout components (Header, PageContainer)
├── lib/              # Core utilities
│   ├── auth.ts       # Better Auth server instance
│   ├── auth-client.ts
│   ├── trpc.ts       # tRPC React client
│   └── utils.ts      # cn() utility
├── hooks/            # Custom React hooks
├── styles/           # Global CSS
├── schemas/          # Zod validation schemas
├── env.ts            # Environment variable validation
└── entry-*.tsx       # App entry points
```

## CONVENTIONS

### Path Alias
- **Always use `~/`**: `import { auth } from "~/lib/auth"`
- Maps to `./src/*` via tsconfig

### File Organization
- **Routes**: Co-locate with feature modules when possible
- **Components**: UI primitives in `components/ui/`, layout in `components/layout/`
- **Hooks**: Single-purpose hooks in `hooks/`, named `use-{purpose}.ts`

### TypeScript
- Strict mode enabled
- React JSX transform
- ES2022 target

## WHERE TO ADD

| What | Where | Pattern |
|------|-------|---------|
| New page | `routes/*.tsx` or `features/{name}/pages/` | File-based routing |
| Shared component | `components/ui/` or `components/layout/` | Export named |
| Custom hook | `hooks/use-{name}.ts` | Export function |
| Zod schema | `schemas/{domain}.ts` | Export const |
| Utility | `lib/utils.ts` or new file | Export named |

## ANTI-PATTERNS

- Don't create deep nesting (max 3 levels)
- Don't mix feature code with shared code
- Don't import from `../..` — use `~/` instead
