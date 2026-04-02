import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { EditPostPage } from "~/features/posts/pages/EditPostPage";

const getPost = createServerFn({ method: "GET" })
  .handler(async ({ data }) => {
    const { postId } = (data ?? {}) as { postId: string };
    
    const { auth } = await import("~/lib/auth");
    const { db } = await import("~/db");
    const { posts } = await import("~/db/schema");
    const { eq } = await import("drizzle-orm");

    const request = getRequest();
    if (!request) {
      throw new Error("Request not available");
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      throw new Error("You must be logged in to edit posts");
    }

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      throw notFound();
    }

    if (post.authorId !== session.user.id) {
      throw new Error("You are not authorized to edit this post");
    }

    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      publishedAt: post.publishedAt?.toISOString() ?? null,
      scheduledAt: post.scheduledAt?.toISOString() ?? null,
      editedAt: post.editedAt?.toISOString() ?? null,
    };
  });

export const Route = createFileRoute("/_authenticated/posts/$postId/edit")({
  loader: async ({ params }) => {
    return getPost({ data: { postId: params.postId } } as any);
  },
  component: EditPostPage,
});