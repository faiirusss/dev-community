import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { trpc } from "~/lib/trpc";
import { useToast } from "~/hooks/use-toast";
import {
  postFormSchema,
  defaultPostValues,
  type PostFormSchema,
} from "../forms/post";
import { CoverImageUpload } from "../components/CoverImageUpload";
import { TitleInput } from "../components/TitleInput";
import { TagsInput } from "../components/TagsInput";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { PostStats } from "../components/PostStats";
import { PublishOptions } from "../components/PublishOptions";
import { useAutosave } from "../hooks/useAutosave";
import type { SaveDraftSchema } from "~/schemas/posts";

export function CreatePostPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [canonicalUrl, setCanonicalUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const methods = useForm<PostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: defaultPostValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;
  const content = watch("content");
  const title = watch("title");

  const autosaveData: SaveDraftSchema = {
    title,
    content,
    coverImage: watch("coverImage"),
    coverImageAlt: watch("coverImageAlt"),
    description: watch("description"),
    tags: watch("tags"),
  };

  const { isSaving, lastSavedAt } = useAutosave(autosaveData, {
    enabled: true,
    interval: 30000,
  });

  const createPost = trpc.posts.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Post published!",
        description: "Your post has been published successfully.",
      });
      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: PostFormSchema) => {
    await createPost.mutateAsync(data);
  };

  const onSaveDraft = async () => {
    const data = methods.getValues();
    await createPost.mutateAsync({ ...data, published: false });
  };

  const onSchedule = async (date: Date) => {
    const data = methods.getValues();
    await createPost.mutateAsync({
      ...data,
      published: false,
      scheduledAt: date,
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen pb-24">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-6">
            <CoverImageUpload
              value={watch("coverImage")}
              onChange={(url) => setValue("coverImage", url)}
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

          <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`px-3 py-1 text-sm transition-colors ${
                  !showPreview
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`px-3 py-1 text-sm transition-colors ${
                  showPreview
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
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
              <p className="text-sm text-destructive mt-2">
                {errors.content.message}
              </p>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <PostStats content={content} />

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {isSaving
                  ? "Saving..."
                  : lastSavedAt
                    ? `Saved ${formatTime(lastSavedAt)}`
                    : "Unsaved"}
              </span>

              <PublishOptions
                onSaveDraft={onSaveDraft}
                onPublish={handleSubmit(onSubmit)}
                onSchedule={onSchedule}
                isSubmitting={isSubmitting || createPost.isPending}
                scheduledAt={scheduledAt}
                onScheduledAtChange={setScheduledAt}
                canonicalUrl={canonicalUrl}
                onCanonicalUrlChange={setCanonicalUrl}
                description={description}
                onDescriptionChange={setDescription}
              />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}