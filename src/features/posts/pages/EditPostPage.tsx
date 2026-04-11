import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "~/routes/_authenticated/posts/\$postId.edit";
import { trpc } from "~/lib/trpc";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import { CoverImageUpload } from "../components/CoverImageUpload";
import { TitleInput } from "../components/TitleInput";
import { TagsInput } from "../components/TagsInput";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { PostStats } from "../components/PostStats";
import { ExitConfirmationDialog } from "../components/ExitConfirmationDialog";
import { postFormSchema, generateSlug } from "../forms/post";
import type { PostFormSchema } from "../forms/post";

export function EditPostPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const post = Route.useLoaderData();
  const [showPreview, setShowPreview] = useState(false);

  const methods = useForm<PostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      slug: post.slug,
      coverImage: post.coverImage || "",
      coverImageAlt: "",
      description: post.description || "",
      tags: [],
      published: post.published,
      scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : null,
      canonicalUrl: post.canonicalUrl || "",
    },
    mode: "onChange",
  });

  const { handleSubmit, watch, register, setValue, formState: { errors, isSubmitting } } = methods;
  const content = watch("content");

  const updatePost = trpc.posts.update.useMutation({
    onSuccess: (data) => {
      toast({ title: "Post updated!", description: "Your changes have been saved." });
      navigate({ to: "/" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = async (data: PostFormSchema) => {
    await updatePost.mutateAsync({ ...data, id: post.id });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    register("title").onChange(e);
    if (!post.slug || post.slug === generateSlug(post.title)) {
      setValue("slug", generateSlug(newTitle));
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen pb-24 relative">
        <ExitConfirmationDialog onConfirm={() => navigate({ to: "/" })} />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-4 text-sm text-muted-foreground">
            Editing post • Last edited {post.editedAt ? new Date(post.editedAt).toLocaleDateString() : "never"}
          </div>

          <div className="mb-6">
            <CoverImageUpload
              value={watch("coverImage")}
              onChange={(url) => setValue("coverImage", url || "")}
              onAltChange={(alt) => setValue("coverImageAlt", alt)}
              altValue={watch("coverImageAlt")}
            />
          </div>

          <div className="mb-4">
            <TitleInput {...register("title")} error={errors.title?.message} />
          </div>

          <div className="mb-6">
            <TagsInput
              value={watch("tags") || []}
              onChange={(tags) => setValue("tags", tags)}
            />
          </div>

          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`px-3 py-1 text-sm ${!showPreview ? "font-medium" : "text-muted-foreground"}`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`px-3 py-1 text-sm ${showPreview ? "font-medium" : "text-muted-foreground"}`}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="mb-8">
            <MarkdownEditor
              value={content}
              onChange={(value) => setValue("content", value)}
              preview={showPreview}
            />
            {errors.content && (
              <p className="text-sm text-destructive mt-2">{errors.content.message}</p>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <PostStats content={content} />

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/" })}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || updatePost.isPending}
              >
                {updatePost.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}