# Contributing to IGNITE SPORTS CLUB — EST. 2026

Thank you for your interest in contributing to the **IGNITE SPORTS CLUB** open-source web platform! This document outlines our collaborative workflow, coding standards, and pull request procedures for club members and external contributors.

---

## 1. Core Principles

- **Preserve Brand Identity**: The official identity is **IGNITE SPORTS CLUB — EST. 2026**. All UI elements, themes, and interactions must strictly respect the Midnight Black (`#080B18`), Deep Navy (`#101B3D`), Electric Blue (`#287BFF`), and Cosmic Purple (`#8B5CF6`) palette.
- **Maintain Documentation Integrity**: Preserve comments, type definitions, and architectural notes.
- **Never Commit Secrets**: Never commit `.env` files, Supabase service-role keys, private API keys, or personal member data.
- **Keep PRs Focused**: Submit focused, atomic changes. Avoid monolithic pull requests that bundle unrelated features or refactors.

---

## 2. Branching Strategy

- **`main`**: The primary production-ready, stable branch. Direct commits to `main` are restricted.
- **Feature Branches**: Branch off `main` using descriptive naming:
  - `feat/sports-schedule-calendar` (new features)
  - `fix/audio-mute-persistence` (bug fixes)
  - `docs/contributing-guidelines` (documentation changes)
  - `perf/video-load-optimization` (performance improvements)
  - `a11y/modal-focus-trap` (accessibility enhancements)

```bash
# Update local main
git checkout main
git pull origin main

# Create a feature branch
git checkout -b feat/your-feature-name
```

---

## 3. Local Development Workflow

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env.local
   ```
   *Only public client-side variables prefixed with `VITE_` should be defined here.*

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Run Quality Checks Locally**:
   Before committing, always ensure linting and building pass without errors:
   ```bash
   # Linting check
   npm run lint

   # Type checking and production build test
   npm run build
   ```

---

## 4. Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` Adds a new user-facing feature or enhancement.
- `fix:` Fixes a bug or visual regression.
- `docs:` Documentation only changes.
- `style:` Formatting, indentation, or CSS whitespace changes that do not affect code logic.
- `refactor:` Code restructuring without changing external behavior.
- `perf:` Performance optimizations (e.g., bundle size reduction, lazy loading).
- `test:` Adding or improving automated tests.
- `chore:` Tooling, dependency updates, or build configuration changes.

**Example**:
```bash
git commit -m "feat(intro): add broadcast telemetry HUD to realistic video scenes"
```

---

## 5. Pull Request (PR) Process

1. **Push your branch**:
   ```bash
   git push origin feat/your-feature-name
   ```

2. **Open a Pull Request**:
   - Target the `main` branch.
   - Fill out the provided [Pull Request Template](./.github/PULL_REQUEST_TEMPLATE.md).
   - Link related issues (e.g., `Closes #12`).
   - Include before-and-after screenshots or screen recordings for any visual changes.

3. **CI Checks**:
   - Ensure all automated checks (linting, type checking, build) pass.
   - If a check fails, inspect the log, push fixes to your branch, and the checks will rerun automatically.

4. **Code Review**:
   - At least one maintainer review is required before merging.
   - Reviewers evaluate code quality, visual harmony with the IGNITE brand, mobile responsiveness, and performance.

---

## 6. Proposing Architectural Changes

For substantial changes (such as introducing new frameworks, major database integrations, or redesigning navigation flows), please **open an Issue first** for discussion and maintainer approval before writing code.
