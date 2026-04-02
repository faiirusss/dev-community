# Work Section Card for Profile Page

## TL;DR

> **Quick Summary**: Add a work section card to the user profile page (`/$username`) that displays the user's work and education information. Update the tRPC router to return these fields, create a card component, and integrate it into the profile page.
>
> **Deliverables**:
> - Updated tRPC `getByUsername` procedure returning `work` and `education` fields
> - New `ProfileWorkCard` component displaying work/education info
> - Integrated card inprofile page below existing stats card
>
> **EstimatedEffort**: Quick (2-3 small tasks)
> **Parallel Execution**: NO - sequential dependency
> **Critical Path**: tRPC update → Card component → Profile integration

---

##Context

### Original Request
Create a card to showwork section (coding and personal) from user at username page with a clear commit message.

### Interview Summary
**Key Discussions**:
- **Card Structure**: Single combined card with Work and Education sections
- **Empty Fields**: Hide fields without data (no placeholders)
- **Fields to Display**: Work + Education (basic fields from database)
- **Testing**: No automated tests, Agent-Executed QA Scenarios only

**Research Findings**:
- **Database**: `work` and `education` fields already exist in `users` table as plain text columns
- **tRPC Gap**: `getByUsername` procedure does NOT currently return these fields
- **Profile Page**: Has placeholder area (lines 158-161) where card should go
- **Card Pattern**: `bg-card border shadow-sm p-4 rounded-lg` matching existing stats card

### Metis Review
**Identified Gaps** (addressed):
- **Card title**: Will use "Work" as the header (simple and clear)
- **Icons**: Will use Briefcase for Work, GraduationCap for Education (Lucide icons already in use)
- **Both empty**: Will hide entire card if both fields are empty
- **Whitespace handling**: Will treat whitespace-only values as empty
- **Text overflow**: Will wrap text naturally (200char max from schema)

---

## Work Objectives

### Core Objective
Display the user's work and education information on their public profile page in a clean, consistent card component that matches the existing UI patterns.

### Concrete Deliverables
- `src/server/routers/profile.ts` — Updated `getByUsername` query to include `work` and `education`
- `src/components/profile/ProfileWorkCard.tsx` — New card component for work/education display
- `src/routes/$username.tsx` — Integrated ProfileWorkCard in the profile grid

### Definition of Done
- [ ] tRPC query returns `work` and `education` fields
- [ ] ProfileWorkCard renders work and education with icons
- [ ] Empty fields are hidden (not shown with placeholders)
- [ ] Entire card hidden when both fields are empty
- [ ] Whitespace-only values treated as empty
- [ ] Card matches existing profile card styling

### Must Have
- Work and education fields returned from API
- Card component with conditional rendering
- Integration into profile page

### Must NOT Have (Guardrails)
- **NO** structured work/education fields (company, title, dates) — schema is plain text
- **NO** edit functionality on profile page — editing is in `/settings`
- **NO** "Add work" / "Add education" buttons — display only
- **NO** feature directory structure — keep component simple
- **NO** automated tests — Agent-Executed QA Scenarios only
- **NO** XSS concerns — React handles text rendering

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None (user opted out)
- **Framework**: N/A
- **Agent-Executed QA**: REQUIRED for all tasks

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Sequential — tRPC first, then UI):
├── Task 1: Update tRPC query to return work/education [quick]
├── Task 2: Create ProfileWorkCard component [quick]
└── Task 3: Integrate card into profile page [quick]

Critical Path: Task 1 → Task 2 → Task 3
```

### Dependency Matrix

- **1**: — — 2, 3
- **2**: 1 — 3
- **3**: 1, 2 — —

### Agent Dispatch Summary

- **1**: **1** — T1 → `quick`
- **2**: **1** — T2 → `quick`
- **3**: **1** — T3 → `quick`

---

## TODOs

- [x] 1. Update tRPC Query to Return Work and Education Fields

  **What to do**:
  - Add `work: users.work` and `education: users.education` to the select statement in `getByUsername` procedure
  - The fields already exist in the database schema
  - Type inference is automatic — no manual type changes needed

  **Must NOT do**:
  - Do NOT modify the database schema
  - Do NOT add new fields (like company, title)
  - Do NOT change any other procedures

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file, 2-line change, straightforward
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (first task)
  - **Blocks**: Task 2, Task 3
  - **Blocked By**: None

  **References** (CRITICAL):

  **Pattern References**:
  - `src/server/routers/profile.ts:15-28` - Existing select statement pattern

  **API/Type References**:
  - `src/db/schema/users.ts:35-36` - Work and education field definitions

  **WHY Each Reference Matters**:
  - `profile.ts:15-28`: Shows the exact select pattern tofollow for adding new fields
  - `users.ts:35-36`: Confirms field names and types (plain text)

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```Scenario: API returns work and education fields
    Tool: Bash (curl)
    Preconditions: Dev server running on localhost:3000
    Steps:
      1. curl -s "http://localhost:3000/api/trpc/profile.getByUsername?input=%7B%22json%22%3A%7B%22username%22%3A%22testuser%22%7D%7D"
      2. Parse JSON response and check for 'work' and 'education' fields
    Expected Result: Response contains 'work' and 'education' fields in data object
    Failure Indicators: Fields missing from response, or error in response
    Evidence: .sisyphus/evidence/task-1-api-returns-fields.txt
  ```

  **Evidence to Capture**:
  - [ ] curl response showing work and education fields present

  **Commit**: YES
  - Message: `feat(profile): add work and education fields to getByUsername query`
  - Files: `src/server/routers/profile.ts`
  - Pre-commit: `npm run typecheck`

---

- [x] 2. Create ProfileWorkCard Component

  **What to do**:
  - Create `src/components/profile/ProfileWorkCard.tsx`
  - Display work and education with Briefcase and GraduationCap icons
  - Hide fields that are null, empty, or whitespace-only
  - Hide entire card if both fields are empty
  - Match existing card styling: `bg-card border shadow-sm p-4 rounded-lg`

  **Must NOT do**:
  - Do NOT add edit buttons or links
  - Do NOT add "Add work" CTAs
  - Do NOT create feature directory structure
  - Do NOT use different styling from existing cards

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple component, follows existing patterns
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (second task)
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References** (CRITICAL):

  **Pattern References**:
  - `src/routes/$username.tsx:142-155` - Existing stats card pattern to match
  - `src/components/ui/card.tsx` - shadcn Card component structure

  **External References**:
  - Lucide icons: `Briefcase`, `GraduationCap` from "lucide-react"

  **WHY Each Reference Matters**:
  - `$username.tsx:142-155`: Shows the exact styling pattern (`bg-card border shadow-sm p-4 rounded-lg`) and layout structure
  - `card.tsx`: Shows Card composition pattern if using full Card component

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```Scenario: Card renders with work and education
    Tool: Playwright
    Preconditions: Dev server running, user "testuser" has work="Software Engineer" and education="MIT"
    Steps:
      1. Navigate to http://localhost:3000/testuser
      2. Wait for profile to load
      3. Check for presence of work card
      4. Verify work field shows "Software Engineer" with Briefcase icon
      5. Verify education field shows "MIT" with GraduationCap icon
    Expected Result: Card visible with both fields displayed correctly
    Failure Indicators: Card not found, fields missing, icons not present
    Evidence: .sisyphus/evidence/task-2-card-renders.png

  Scenario: Card hides empty fields
    Tool: Playwright
    Preconditions: Dev server running, user "workonly" has work="Developer" and education=null
    Steps:
      1. Navigate to http://localhost:3000/workonly
      2. Wait for profile to load
      3. Check for work field presence
      4. Verify education field is NOT rendered
    Expected Result: Only work field visible, education field hidden
    Failure Indicators: Both fields shown, education shows empty or placeholder
    Evidence: .sisyphus/evidence/task-2-hides-empty.png

  Scenario: Card hidden when both fields empty
    Tool: Playwright
    Preconditions: Dev server running, user "emptyuser" has work=null and education=null
    Steps:
      1. Navigate to http://localhost:3000/emptyuser
      2. Wait for profile to load
      3. Check for work card absence
    Expected Result: Work card not rendered at all
    Failure Indicators: Empty card visible, or card with placeholders
    Evidence: .sisyphus/evidence/task-2-hidden-when-empty.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshot showing card with work and education
  - [ ] Screenshot showing card with only work (education hidden)
  - [ ] Screenshot showing no card when both empty

  **Commit**: YES (groups with Task 3)
  - Message: `feat(profile): add ProfileWorkCard component and integrate into profile page`
  - Files: `src/components/profile/ProfileWorkCard.tsx`, `src/routes/$username.tsx`
  - Pre-commit: `npm run typecheck`

---

- [x] 3. Integrate ProfileWorkCard into Profile Page

  **What to do**:
  - Import ProfileWorkCard in `$username.tsx`
  - Replace the empty placeholder div (lines 158-161) with ProfileWorkCard
  - Pass `work` and `education` from profile data
  - Card should appear below the stats card in the left column

  **Must NOT do**:
  - Do NOT change the grid layout structure
  - Do NOT move the stats card
  - Do NOT add to the right column (posts area)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single import and component placement
  - **Skills**: []
    - No special skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (third task)
  - **Blocks**: —
  - **Blocked By**: Task 1, Task 2

  **References** (CRITICAL):

  **Pattern References**:
  - `src/routes/$username.tsx:25-32` - How profile data is fetched and used
  - `src/routes/$username.tsx:139-155` - Stats card placement in left column

  **WHY Each Reference Matters**:
  - `$username.tsx:25-32`: Shows how to access profile data from tRPC query
  - `$username.tsx:139-155`: Shows exact placement location for the new card

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```Scenario: Work card appears on profile page
    Tool: Playwright
    Preconditions: Dev server running, user has work/education data
    Steps:
      1. Navigate to http://localhost:3000/testuser
      2. Verify page loads without errors
      3. Scroll to work card location (below stats card)
      4. Verify work card is visible in left column
      5. Verify card styling matches stats card (same bg-card, border, shadow, rounded)
    Expected Result: Work card visible and styled correctly
    Failure Indicators: Card not found, styling mismatch, console errors
    Evidence: .sisyphus/evidence/task-3-integrated.png

  Scenario: Full flow - API to UI
    Tool: Bash (curl) + Playwright
    Preconditions: Dev server running
    Steps:
      1. curl -s "http://localhost:3000/api/trpc/profile.getByUsername?input=%7B%22json%22%3A%7B%22username%22%3A%22testuser%22%7D%7D" | jq '.result.data.work, .result.data.education'
      2. Navigate Playwright to http://localhost:3000/testuser
      3. Verify work card shows same values as API response
    Expected Result: UI displays exact values from API
    Failure Indicators: Mismatchbetween API and UI values
    Evidence: .sisyphus/evidence/task-3-full-flow.txt, .sisyphus/evidence/task-3-full-flow.png
  ```

  **Evidence to Capture**:
  - [ ] API response showing work/education values
  - [ ] Screenshot showing those exact values in UI

  **Commit**: YES (combined with Task 2)
  - Message: `feat(profile): add ProfileWorkCard component and integrate into profile page`
  - Files: `src/components/profile/ProfileWorkCard.tsx`, `src/routes/$username.tsx`
  - Pre-commit: `npm run typecheck`

---

## Final Verification Wave (MANDATORY)

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists. For each "Must NOT Have": search codebase for forbidden patterns. Check evidence files exist. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run typecheck`. Review all changed files for: `as any`/`@ts-ignore`, unused imports, console.log. Check AI slop: excessive comments, generic names.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task. Test cross-task integration (card shows correct data from API). Test edge cases: empty fields, whitespace values. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec was built. Check "Must NOT do" compliance.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Commit 1**: `feat(profile): add work and education fields to getByUsername query`
  - Files: `src/server/routers/profile.ts`
  - Pre-commit: `npm run typecheck`

- **Commit 2**: `feat(profile): add ProfileWorkCard component and integrate into profile page`
  - Files: `src/components/profile/ProfileWorkCard.tsx`, `src/routes/$username.tsx`
  - Pre-commit: `npm run typecheck`

---

## Success Criteria

### Verification Commands
```bash
# Type check
npm run typecheck  # Expected: No errors

# API test
curl -s "http://localhost:3000/api/trpc/profile.getByUsername?input=%7B%22json%22%3A%7B%22username%22%3A%22testuser%22%7D%7D" | jq '.result.data | keys'
# Expected: Contains "work" and "education"
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] No type errors
- [ ] Card renders with data
- [ ] Card hides empty fields
- [ ] Card hidden when both empty
- [ ] Styling matches existing cards