# Issue Organization & Initial Issue Backlog

This document defines the recommended GitHub issue label taxonomy and proposes prioritized initial issues for the **IGNITE SPORTS CLUB — EST. 2026** platform.

---

## 1. Recommended GitHub Issue Labels

| Label | Color | Description |
| :--- | :--- | :--- |
| `good first issue` | `#7057ff` | Suitable for new student contributors or first-time open-source contributors |
| `frontend` | `#287BFF` | User interface, CSS design tokens, React components, and layouts |
| `3d-animation` | `#8B5CF6` | Three.js, React Three Fiber, GSAP timelines, and canvas shaders |
| `backend` | `#006b75` | Supabase, Firebase, API integrations, and database schemas |
| `accessibility` | `#1d76db` | Keyboard accessibility, screen reader support, WCAG AA, reduced motion |
| `performance` | `#d4c5f9` | Asset optimization, Core Web Vitals, video compression, lazy loading |
| `bug` | `#d73a4a` | Something isn't working as expected or a visual regression occurred |
| `documentation` | `#0075ca` | Improvements or additions to documentation, README, or guides |

---

## 2. Proposed Initial Issues

### Issue 1: [A11Y] Complete Focus Trap and Screen Reader ARIA Live for Join Modal
- **Labels**: `accessibility`, `frontend`, `good first issue`
- **Description**: Ensure the Registration / Tryout modal traps keyboard focus when opened and returns focus to the trigger button when closed. Add `aria-live="polite"` feedback for form submission states.
- **Acceptance Criteria**:
  - `Tab` and `Shift+Tab` cycle only within modal elements while open.
  - Pressing `Escape` closes modal and restores focus to "JOIN CLUB" trigger.
  - Screen readers announce submission errors or success messages clearly.

### Issue 2: [PERF] Add Video Preload Telemetry & Low-Bandwidth Fallback
- **Labels**: `performance`, `3d-animation`, `frontend`
- **Description**: Add connection detection (`navigator.connection`) to automatically serve lighter-resolution MP4 clips or poster frames on slow 3G mobile connections.
- **Acceptance Criteria**:
  - Intro detects network constraints gracefully.
  - Video loading displays a minimal progress ring if assets take >1s to buffer.
  - No stutter or audio desynchronization during playback.

### Issue 3: [FEAT] Interactive Calendar Filter for Team Training Schedules
- **Labels**: `frontend`, `enhancement`
- **Description**: Allow visitors on the homepage to toggle training schedules by day of the week (Mon–Sun) or sport discipline with quick calendar export (ICS download).
- **Acceptance Criteria**:
  - Filter buttons for All, Mon/Wed/Fri, and Tue/Thu/Sat schedules.
  - "Add to Calendar (.ics)" download link for each sport's recurring session.

### Issue 4: [TEST] Configure Vitest and React Testing Library for Quality Checks
- **Labels**: `testing`, `documentation`, `good first issue`
- **Description**: Introduce Vitest and React Testing Library to test `soundSynthesizer.ts` audio state logic, texture generators, and form validation utilities without manual testing.
- **Acceptance Criteria**:
  - Add `npm run test` script to `package.json`.
  - Unit tests for sound toggle state persistence and form validation logic.
  - Integrated into `.github/workflows/ci.yml`.

### Issue 5: [DOCS] Interactive Contributor Component Storybook / Architecture Guide
- **Labels**: `documentation`
- **Description**: Document all design tokens (`--bg-midnight`, `--color-primary-blue`, etc.), button styles (`.sports-cut-button`), and how to add new sports cards in a contributor guide.
- **Acceptance Criteria**:
  - Markdown reference guide with visual token swatch tables in `docs/architecture.md`.
  - Clear guide on extending the `SPORTS_DATA` array in `App.tsx`.
