import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Clock } from "lucide-react";

export function PublishOptions({
  onSaveDraft,
  onPublish,
  onSchedule,
  isSubmitting,
  scheduledAt,
  onScheduledAtChange,
  canonicalUrl,
  onCanonicalUrlChange,
  description,
  onDescriptionChange,
}: {
  onSaveDraft: () => void;
  onPublish: () => void;
  onSchedule: (date: Date) => void;
  isSubmitting: boolean;
  scheduledAt?: Date | null;
  onScheduledAtChange: (date: Date | null) => void;
  canonicalUrl?: string;
  onCanonicalUrlChange: (url: string) => void;
  description?: string;
  onDescriptionChange: (desc: string) => void;
}) {
  const [isScheduled, setIsScheduled] = useState(false);

  const handlePublish = () => {
    if (isScheduled && scheduledAt) {
      onSchedule(scheduledAt);
    } else {
      onPublish();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onSaveDraft}
        disabled={isSubmitting}
      >
        Save draft
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline">
            <Clock className="w-4 h-4 mr-2" />
            {scheduledAt ? `Scheduled for ${formatDate(scheduledAt)}` : "Schedule"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="schedule"
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
              />
              <Label htmlFor="schedule">Schedule for later</Label>
            </div>

            {isScheduled && (
              <div className="space-y-2">
                <Label>Publish date</Label>
                <Input
                  type="datetime-local"
                  onChange={(e) => onScheduledAtChange(new Date(e.target.value))}
                />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        type="button"
        onClick={handlePublish}
        disabled={isSubmitting}
        className="bg-primary text-primary-foreground"
      >
        {isSubmitting ? "Publishing..." : "Publish"}
      </Button>
    </div>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}