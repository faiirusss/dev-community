import { createFileRoute } from "@tanstack/react-router";
import { DraftPreviewPage } from "~/features/posts/pages/DraftPreviewPage";

export const Route = createFileRoute("/_authenticated/drafts/$shareKey")({
  component: DraftPreviewPage,
});