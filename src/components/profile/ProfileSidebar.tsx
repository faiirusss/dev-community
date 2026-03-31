import { ProfileInfoCard } from "./ProfileInfoCard";
import { Code, BookOpen, Wrench, Briefcase, GraduationCap, Handshake } from "lucide-react";

interface ProfileSidebarProps {
  skills?: string | null;
  currentlyLearning?: string | null;
  currentlyHacking?: string | null;
  availableFor?: string | null;
  work?: string | null;
  education?: string | null;
}

export function ProfileSidebar({
  skills,
  currentlyLearning,
  currentlyHacking,
  availableFor,
  work,
  education,
}: ProfileSidebarProps) {
  return (
    <div className="space-y-4">
      <ProfileInfoCard
        title="Skills/Languages"
        content={skills}
        icon={Code}
      />
      <ProfileInfoCard
        title="Currently learning"
        content={currentlyLearning}
        icon={BookOpen}
      />
      <ProfileInfoCard
        title="Currently hacking on"
        content={currentlyHacking}
        icon={Wrench}
      />
      <ProfileInfoCard
        title="Available for"
        content={availableFor}
        icon={Handshake}
      />
      <ProfileInfoCard
        title="Work"
        content={work}
        icon={Briefcase}
      />
      <ProfileInfoCard
        title="Education"
        content={education}
        icon={GraduationCap}
      />
    </div>
  );
}
