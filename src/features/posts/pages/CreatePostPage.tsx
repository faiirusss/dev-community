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
import { ExitConfirmationDialog } from "../components/ExitConfirmationDialog";
import { useAutosave } from "../hooks/useAutosave";
import type { SaveDraftSchema } from "~/schemas/posts";

export function CreatePostPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
  const [canonicalUrl, setCanonicalUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);

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
      setCreatedPostId(data.id);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePost = trpc.posts.update.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const saveOrUpdatePost = async (data: PostFormSchema) => {
    if (createdPostId) {
      return updatePost.mutateAsync({ ...data, id: createdPostId });
    } else {
      const result = await createPost.mutateAsync(data);
      setCreatedPostId(result.id);
      return result;
    }
  };

  const onSubmit = async (data: PostFormSchema) => {
    try {
      await saveOrUpdatePost({ ...data, published: true });
      toast({
        title: "Post published!",
        description: "Your post has been published successfully.",
      });
      navigate({ to: "/" });
    } catch {
    }
  };

  const onSaveDraft = async () => {
    try {
      const data = methods.getValues();
      await saveOrUpdatePost({ ...data, published: false });
      toast({
        title: "Draft saved!",
        description: "Your draft has been saved successfully.",
      });
      navigate({ to: "/" });
    } catch {
    }
  };

  const onSchedule = async (date: Date) => {
    try {
      const data = methods.getValues();
      await saveOrUpdatePost({
        ...data,
        published: false,
        scheduledAt: date,
      });
      toast({
        title: "Post scheduled!",
        description: `Your post has been scheduled for ${formatDateTime(date)}.`,
      });
      navigate({ to: "/" });
    } catch {
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen pb-24 relative"
      >
        <ExitConfirmationDialog onConfirm={() => navigate({ to: "/" })} />
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

        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
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
                isSubmitting={isSubmitting || createPost.isPending || updatePost.isPending}
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

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}
