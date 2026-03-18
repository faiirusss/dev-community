import { pgTable, uuid, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { postTags } from './post_tags'

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color').default('#000000').notNull(),
})

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}))

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert