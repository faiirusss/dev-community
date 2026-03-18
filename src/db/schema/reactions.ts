import { pgTable, uuid, text, timestamp, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { posts } from './posts'

export const reactionTypeEnum = pgEnum('reaction_type', [
  'like',
  'unicorn',
  'exploding_head',
  'raised_hands',
  'fire',
])

export const reactions = pgTable(
  'reactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: reactionTypeEnum('type').notNull(),
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqueReaction: uniqueIndex('unique_reaction').on(
      table.postId,
      table.userId,
      table.type
    ),
  })
)

export const reactionsRelations = relations(reactions, ({ one }) => ({
  post: one(posts, {
    fields: [reactions.postId],
    references: [posts.id],
  }),
  users: one(users, {
    fields: [reactions.userId],
    references: [users.id],
  }),
}))

export type Reaction = typeof reactions.$inferSelect
export type NewReaction = typeof reactions.$inferInsert