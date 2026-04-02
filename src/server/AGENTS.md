# Server — src/server/

tRPC server setup and routers.

## STRUCTURE

```
server/
├── trpc.ts           # tRPC initialization & middleware
├── root.ts           # App router (combine all routers here)
└── routers/          # Domain routers
    ├── auth.ts       # Auth procedures
    ├── user.ts       # User procedures
    └── profile.ts    # Profile procedures
```

## CONVENTIONS

### Router Definition
```typescript
// routers/example.ts
export const exampleRouter = router({
  // Public procedure
  getAll: publicProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx, input }) => { ... }),
    
  // Protected procedure (requires auth)
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => { ... }),
})
```

### Adding a Router
1. Create `routers/{name}.ts`
2. Define router with procedures
3. Export router
4. Add to `root.ts`:
```typescript
import { exampleRouter } from "./routers/example"

export const appRouter = router({
  // ...existing routers
  example: exampleRouter,
})
```

### Context
Available in all procedures via `ctx`:
- `ctx.db` — Drizzle database client
- `ctx.session` — Better Auth session
- `ctx.user` — Current user (null if not authenticated)

## PROCEDURE TYPES

| Type | Use When | Auth Required |
|------|----------|---------------|
| `publicProcedure` | Open data | No |
| `protectedProcedure` | User-specific actions | Yes (throws UNAUTHORIZED) |

## ANTI-PATTERNS

- Don't forget Zod input validation
- Don't access DB directly — use `ctx.db`
- Don't throw raw errors — use TRPCError
- Don't forget to add router to `root.ts`
