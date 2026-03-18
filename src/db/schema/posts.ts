import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { postTags } from './post_tags'
import { comments } from './comments'
import { reactions } from './reactions'
import { bookmarks } from './bookmarks'

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  published: boolean('published').default(false).notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  postTags: many(postTags),
  comments: many(comments),
  reactions: many(reactions),
  bookmarks: many(bookmarks),
}))

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert