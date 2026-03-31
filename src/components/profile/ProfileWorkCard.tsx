import { Briefcase, GraduationCap } from "lucide-react";

interface ProfileWorkCardProps {
  work?: string | null;
  education?: string | null;
}

function isEmpty(value: string | null | undefined): boolean {
  if (value === null || value === undefined) return true;
  return value.trim().length === 0;
}

export function ProfileWorkCard({ work, education }: ProfileWorkCardProps) {
  const workEmpty = isEmpty(work);
  const educationEmpty = isEmpty(education);

  if (workEmpty && educationEmpty) {
    return null;
  }

  return (
    <div className="bg-card border shadow-sm p-4 rounded-lg space-y-4">
      {work && !workEmpty && (
        <div className="flex items-start gap-3">
          <Briefcase size={18} className="text-muted-foreground mt-0.5" />
          <span className="text-sm text-muted-foreground">{work}</span>
        </div>
      )}
      {education && !educationEmpty && (
        <div className="flex items-start gap-3">
          <GraduationCap size={18} className="text-muted-foreground mt-0.5" />
          <span className="text-sm text-muted-foreground">{education}</span>
        </div>
      )}
    </div>
  );
}
