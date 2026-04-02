# Work Section Card - Learnings

## Completed Task
Created `src/components/profile/ProfileWorkCard.tsx` - a React component for displaying work and education information.

## Key Patterns
- Stats card pattern: `bg-card border shadow-sm p-4 rounded-lg space-y-4`
- Field row pattern: `flex items-start gap-3`
- Icon pattern: `size={18} className="text-muted-foreground mt-0.5"`
- Text pattern: `text-sm text-muted-foreground`

## Component Details
- Props: `{ work?: string | null; education?: string | null }`
- Icons: `Briefcase` for work, `GraduationCap` for education
- Helper function `isEmpty()` handles null, undefined, empty string, and whitespace-only values
- Returns `null` if both fields are empty (renders nothing)

## Notes
- Pre-existing typecheck errors in entry-client.tsx, entry-server.tsx, __root.tsx (not related to this component)
- Component follows existing card patterns from `$username.tsx` stats card

## Task 3: Integration
- Added import: `import { ProfileWorkCard } from "~/components/profile/ProfileWorkCard";`
- Placed component inside left column (`col-span-1`) after stats card
- Props: `work={profile?.work}` and `education={profile?.education}`
- Component renders below stats card, above posts area
