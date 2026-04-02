import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { posts } from './posts'

export const drafts = pgTable('drafts', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title'),
  content: text('content'),
  coverImage: text('cover_image'),
  coverImageAlt: text('cover_image_alt'),
  description: text('description'),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  shareKey: text('share_key').unique(),
})

export const draftsRelations = relations(drafts, ({ one }) => ({
  post: one(posts, {
    fields: [drafts.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [drafts.authorId],
    references: [users.id],
  }),
}))

export type Draft = typeof drafts.$inferSelect
export type NewDraft = typeof drafts.$inferInsert