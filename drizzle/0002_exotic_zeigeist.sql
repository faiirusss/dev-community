CREATE TABLE "drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid,
	"author_id" text NOT NULL,
	"title" text,
	"content" text,
	"cover_image" text,
	"cover_image_alt" text,
	"description" text,
	"tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"share_key" text,
	CONSTRAINT "drafts_share_key_unique" UNIQUE("share_key")
);
--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "scheduled_at" timestamp;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "reading_time" integer;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "word_count" integer;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "edited_at" timestamp;--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;