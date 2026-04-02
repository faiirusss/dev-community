import { createFileRoute } from "@tanstack/react-router";
import { CreatePostPage } from "~/features/posts/pages/CreatePostPage";

export const Route = createFileRoute("/_authenticated/posts/new")({
  component: CreatePostPage,
});