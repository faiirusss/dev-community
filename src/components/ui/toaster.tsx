import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5",
            t.variant === "destructive"
              ? "border-destructive bg-destructive text-white"
              : "border-border bg-card text-card-foreground"
          )}
        >
          <div className="flex flex-col gap-1">
            {t.title && (
              <p className="text-sm font-semibold leading-none">{t.title}</p>
            )}
            {t.description && (
              <p className="text-sm opacity-90">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
