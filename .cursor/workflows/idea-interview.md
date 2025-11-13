# DoPlan Idea Interview Guide

This guide powers the `/Idea` command. The agent adapts tone and depth using three modes:

- **Detailed Mode**: comprehensive interview for experienced teams.
- **Simple Mode**: quick, choice-driven for non-developers.
- **MVP Scope Toggle**: captures whether to launch lean or full-featured.

---

## Detailed Mode (Default)

### 1. Welcome
- Introduce DoPlan and explain that answers become the PRD and plan.

### 2. Vision & Problem
1. What is the one-line elevator pitch for your product?
2. What user pain are you solving and why is it urgent?
3. How do people solve it today? What is broken in those solutions?

### 3. People & Stakeholders
1. Who is the primary end user?
2. Are there secondary users, buyers, or administrators?
3. Any compliance or regional rules (HIPAA, GDPR, SOC 2, etc.)?

### 4. Value Proposition
1. What triggers the “aha” moment?
2. Key KPIs or success metrics?
3. Why will users pick you over alternatives?

### 5. Feature Set
1. List must-have features for MVP.
2. Nice-to-have or future features?
3. Critical integrations or third-party services?

### 6. Admin & Operations
1. Do you need an admin dashboard? If yes, what should it manage?
2. Need reporting, audit trails, or bulk actions?

### 7. Automation & AI
1. Should any flows be automated or AI-driven?
2. Manual processes today that should become automated?

### 8. Experience & Design
1. Walk through first-time user flow.
2. Visual style (clean, playful, enterprise, dark, etc.)?
3. Reference products or brands to emulate or avoid?

### 9. Technical Foundations
1. Preferred stack or platforms?
2. Existing codebase to integrate with?
3. Hosting, deployment, or infrastructure preferences?

### 10. Data & Security
1. What data is stored? Any sensitive info?
2. Authentication/authorization requirements?
3. Performance or availability SLAs?

### 11. Market & Differentiation
1. Top competitors or alternatives?
2. Differentiators and unfair advantages?

### 12. Business Alignment
1. Desired launch timeline or milestones?
2. Team size and experience level?
3. Budget considerations?

### 13. Enhancements & Research
1. Should DoPlan improve the idea?
2. Need competitor research or trend analysis?
3. Additional deliverables (stakeholder brief, launch plan, etc.)?

### 14. MVP vs Full Scope
- Options: `Simple MVP`, `Full Plan`, `Show Both`. Record choice in `ideaData.scopeMode`.

### 15. Git & Workflow Preferences
1. Existing Git conventions/remotes?
2. Auto-create branches and conventional commits?
3. Notification preferences for PRs or updates?

### 16. Constraints & Risks
1. Known risks or blockers?
2. Hard constraints (tech, vendors, compliance)?
3. Anything to avoid?

### 17. Wrap-Up
- Summarize key information.
- Confirm readiness to run `/Plan`.
- Point user to `idea-notes.md`.

---

## Simple Mode (`/Idea --simple`)

Use plain language, multiple-choice answers, and defaults. Map choices into structured data.

1. **Idea nickname** and one-sentence description (offer “It’s like X for Y” scaffold).
2. **Primary users** (checkbox list: Customers, Employees, Admins, Community, Other).
3. **Primary goal** (checkbox list: Sell, Track, Collaborate, Learn, Book, Other).
4. **Must-have features** (checkbox list: Sign up, Dashboard, Messaging, Payments, File upload, Scheduling, Notifications, Admin controls, Other).
5. **Admin dashboard?** (Yes / Maybe / No).
6. **Design vibe** (Clean, Playful, Dark, Minimal, Other; optional inspiration link).
7. **Timeline** (<1 month, 1–3 months, 3–6 months, Flexible).
8. **Launch goal** (Demo, Pilot, Public release, Feedback, Other).
9. **Tech stack** (Recommend / Provide preferences / No preference).
10. **Idea improvements?** (Yes / Maybe later / No).
11. **Competitor scan?** (Yes / Maybe later / No).
12. **Extra support** (User interview questions, Pitch deck, Launch plan, Metrics template, None).
13. **Must-not-haves** (free text for exclusions).
14. **MVP scope** (Simple MVP vs Plan everything vs Show both).
15. **Confirmation** to generate plan.

Skipped answers should be marked `TBD` and revisited before `/Plan` runs.

---

## Recording Answers
- Save structured data into `.cursor/config/state.json` under `ideaData`.
- Generate `idea-notes.md` summarizing both modes.
- Flag enhancement requests (stack recommendation, competitor research, idea polish) so `/Plan` can schedule them before phase generation.

---

## Usage Notes
- Agents should reference this guide verbatim for consistency.
- Updates to questions must be reflected in downstream processors (plan generator, stack recommender, research module).
- Keep tone adaptive: detailed mode can assume technical fluency; simple mode must avoid jargon and reassure novice builders.

