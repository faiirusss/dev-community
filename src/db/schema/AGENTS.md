# Database Schema — src/db/schema/

Drizzle ORM schema definitions for PostgreSQL.

## STRUCTURE

```
db/schema/
├── index.ts          # Barrel exports (ALWAYS add new tables here)
├── auth.ts           # Session, account, verification (Better Auth)
├── users.ts          # User profiles
├── posts.ts          # Blog posts
├── tags.ts           # Post tags
├── post_tags.ts      # Junction table
├── comments.ts       # Post comments
├── reactions.ts      # Post reactions (likes, etc)
├── follows.ts        # User follows
└── bookmarks.ts      # Saved posts
```

## CONVENTIONS

### Table Definition
```typescript
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  // snake_case for DB columns
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
```

### Relations
```typescript
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))
```

### Types
```typescript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

## ANTI-PATTERNS

- **DON'T** forget to export from `index.ts`
- **DON'T** use camelCase for DB column names (use snake_case)
- **DON'T** modify tables without generating migrations

## WORKFLOW

1. Define table in new or existing file
2. Add relations if needed
3. Export types
4. Add to `index.ts` barrel
5. Run `npm run db:generate`
6. Run `npm run db:migrate`
