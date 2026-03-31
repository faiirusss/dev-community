import { LucideIcon } from "lucide-react";

interface ProfileInfoCardProps {
  title: string;
  content?: string | null;
  icon?: LucideIcon;
}

function isEmpty(value: string | null | undefined): boolean {
  if (value === null || value === undefined) return true;
  return value.trim().length === 0;
}

export function ProfileInfoCard({ title, content, icon: Icon }: ProfileInfoCardProps) {
  if (isEmpty(content)) {
    return null;
  }

  return (
    <div className="bg-card border shadow-sm p-4 rounded-lg">
      <h3 className="font-semibold text-foreground mb-3">{title}</h3>
      <div className="flex items-start gap-3">
        {Icon && <Icon size={18} className="text-muted-foreground mt-0.5 shrink-0" />}
        <p className="text-sm text-muted-foreground">{content}</p>
      </div>
    </div>
  );
}
