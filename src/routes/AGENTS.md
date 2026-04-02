# Routes — src/routes/

File-based TanStack Router routes.

## STRUCTURE

```
routes/
├── __root.tsx           # Root layout (providers, meta, scripts)
├── index.tsx            # Home page (/)
├── login.tsx            # Login page (/login)
├── register.tsx         # Register page (/register)
├── $username.tsx        # User profile (/username)
├── _authenticated.tsx   # Auth guard layout
└── _authenticated/      # Protected routes
    ├── dashboard.tsx    # Dashboard (/dashboard)
    └── settings/        # Settings routes
        ├── route.tsx    # Settings layout
        └── index.tsx    # Settings page (/settings)
```

## CONVENTIONS

### Route Files
- `index.tsx` → `/`
- `login.tsx` → `/login`
- `$param.tsx` → dynamic route (`/:param`)
- `_layout.tsx` → layout wrapper (no URL segment)
- `_authenticated/` → protected routes under guard

### Route Definition
```typescript
export const Route = createFileRoute('/path')({
  component: MyComponent,
  beforeLoad: async () => { /* auth check */ },
  loader: async () => { /* data fetching */ },
})
```

### Auth Guard Pattern
```typescript
// _authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/login' })
  },
})
```

## ANTI-PATTERNS

- **DON'T** modify `routeTree.gen.ts` — auto-generated
- **DON'T** use `../` imports — use `~/` alias
- **DON'T** put heavy logic in route files — delegate to features

## AUTO-GENERATION

TanStack Router scans `src/routes/` and generates `routeTree.gen.ts`.  
After adding/modifying routes, the dev server auto-updates the tree.
