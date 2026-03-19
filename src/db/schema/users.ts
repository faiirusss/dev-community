import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { posts } from './posts'
import { comments } from './comments'
import { reactions } from './reactions'
import { bookmarks } from './bookmarks'
import { follows } from './follows'
import { session, account } from './auth'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  username: text('username').unique(),

  // basic section
  bio: text('bio'),
  location: text('location'),
  websiteUrl: text('website_url'),

  // coding section
  currentlyLearning: text('currently_learning'),
  availableFor: text('available_for'),
  skills: text('skills'),
  currentlyHacking: text('currently_hacking'),

  // personal section
  pronouns: text('pronouns'),

  // work section
  work: text('work'),
  education: text('education'),

  // branding section
  brandColor: text('brand_color').default('#000000'),
})

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  reactions: many(reactions),
  bookmarks: many(bookmarks),
  sessions: many(session),
  accounts: many(account),
  followers: many(follows, { relationName: 'following' }),
  following: many(follows, { relationName: 'follower' }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert