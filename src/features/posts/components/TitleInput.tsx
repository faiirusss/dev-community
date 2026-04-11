import { forwardRef } from "react";
import { useWatch } from "react-hook-form";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export const TitleInput = forwardRef<HTMLTextAreaElement, { error?: string }>(
  ({ error, ...props }, ref) => {
    const title = useWatch({ name: "title" }) as string;
    const charCount = title?.length || 0;
    const isOverLimit = charCount > 140;

    return (
      <div className="space-y-2">
        <Label htmlFor="title" className="sr-only">
          Post Title
        </Label>
        <Textarea
          id="title"
          ref={ref}
          placeholder="New post title here..."
          className="text-3xl font-bold border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2 min-h-15 bg-transparent"
          {...props}
        />
        <div className="flex justify-end">
          <span
            className={`text-xs ${isOverLimit ? "text-yellow-600" : "text-muted-foreground"}`}
          >
            {charCount}/150
          </span>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

TitleInput.displayName = "TitleInput";
