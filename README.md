# IGNITE SPORTS CLUB — EST. 2026

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#quality-checks)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Linter](https://img.shields.io/badge/linter-oxlint-orange)](https://oxc.rs/)

Official web portal and cinematic digital platform for **IGNITE SPORTS CLUB — EST. 2026**, the premier collegiate athletic organization uniting Football, Cricket, Badminton, and Basketball under one unstoppable banner.

---

## Brand Identity & Design System

Built on a cinematic, futuristic athletic visual language derived directly from the official IGNITE Sports Club emblem:

| Color Role | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Midnight Black** | `#080B18` | Deep primary canvas & background |
| **Deep Navy** | `#101B3D` | Surface cards, modals & containers |
| **Electric Blue** | `#287BFF` | Primary action buttons, glow & accents |
| **Cosmic Purple** | `#8B5CF6` | Secondary lighting, energy rings & badges |
| **Ice Blue** | `#62C7FF` | High-contrast highlights, HUD telemetry & borders |
| **White** | `#FFFFFF` | Primary headers & high-legibility typography |
| **Muted Silver** | `#B7C0D8` | Secondary body text & metadata labels |

Official Logo Artwork: [`public/ignite-logo.jpg`](./public/ignite-logo.jpg)

---

## Key Features

1. **Scene 1 — Tap to Enter**:
   - Atmospheric midnight canvas with real-time drifting smoke and floating cosmic dust.
   - Volumetric electric-blue and cosmic-purple light rays.
   - Minimal circular interaction indicator with pulsating core.
   - Autoplay-compliant: sound and sequence start only upon explicit visitor click or `Space`/`Enter` keypress.

2. **Realistic Sports Action Sequence**:
   - High-energy, authentic cinematic footage capturing real athletic plays:
     - **Football Arena**: Powerful penalty strike and goal finish into the net.
     - **Cricket Division**: Batsman cover drive with crisp bat-on-ball willow impact.
     - **Racquet Club**: Fast-paced overhead badminton smash and court rally.
     - **Hardwood Arena**: Player elevation jump shot and clean swish through the hoop.
   - Real-time broadcast telemetry HUD with scene progress counters (`01/04` to `04/04`).

3. **Procedural Web Audio Engine**:
   - Zero external audio file dependencies — 100% synthesized in real time via the Web Audio API.
   - Funky, syncopated ~114 BPM electronic rhythm with punchy bass, electronic kick/snare, and brass synth chord stabs.
   - Precision action sound effects: football kick & net flutter, cricket willow crack, badminton racket string whip, and basketball rim & swish.
   - Persistent mute/unmute control and instant audio termination upon skip.

4. **Scene 6 — Cosmic Fire Vortex & Logo Reveal**:
   - Swirling electric-blue and cosmic-purple flame vortex drawing energy inward.
   - Particle dissolution revealing the official IGNITE Sports Club emblem with dual celestial aura drop-shadows.

5. **Full Collegiate Sports Homepage**:
   - Interactive Sport Discipline Switcher (Football, Cricket, Basketball, Badminton).
   - Facility tours, pitch specifications, and weekly training schedules.
   - Registration & Tryout modal with accessible validation and status feedback.
   - Instant `SKIP INTRO` and persistent `REPLAY INTRO` navigation options.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/) with Fast HMR
- **3D Graphics & Animations**: [Three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/) + [GSAP](https://gsap.com/)
- **Sound Design**: Procedural Web Audio API Synthesizer
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting & Code Quality**: [Oxlint](https://oxc.rs/)

---

## Project Structure

```text
sportsclubwebite/
├── .github/                     # Open-source templates & CI workflows
│   ├── ISSUE_TEMPLATE/          # Bug report & feature request templates
│   ├── PULL_REQUEST_TEMPLATE.md # Standard PR checklist
│   └── workflows/ci.yml         # GitHub Actions build & lint verification
├── public/                      # Static assets served at root
│   ├── ignite-logo.jpg          # Official IGNITE Sports Club emblem
│   ├── favicon.svg              # Dynamic brand favicon
│   └── videos/                  # Optimized realistic sports video assets
├── src/
│   ├── assets/                  # Brand images & vectors
│   ├── components/
│   │   └── intro/               # Cinematic intro experience
│   │       ├── TapToEnter.tsx            # Scene 1: Tap to Enter
│   │       ├── CinematicVideoScene.tsx  # Scenes 2-5: Real footage & HUD
│   │       ├── FireTransitionOverlay.tsx # Scene 6: Fire vortex & logo reveal
│   │       ├── IntroControls.tsx         # HUD Mute, Skip, Replay buttons
│   │       └── SportsIntro.tsx           # Intro master orchestrator
│   ├── utils/
│   │   ├── soundSynthesizer.ts  # Web Audio procedural funk & SFX engine
│   │   └── proceduralTextures.ts# Canvas procedural textures
│   ├── App.tsx                  # Full sports club homepage & navigation
│   ├── App.css                  # Homepage styling & responsive grid
│   ├── index.css                # Global CSS variables & brand tokens
│   └── main.tsx                 # React application entry point
├── .env.example                 # Environment variable template
├── .gitignore                   # Security rules ignoring secrets & build artifacts
├── CONTRIBUTING.md              # Contributor onboarding & PR guidelines
├── CODE_OF_CONDUCT.md           # Community standards
├── SECURITY.md                  # Vulnerability disclosure policy
├── LICENSE                      # Approved open-source MIT license & trademark notice
└── package.json                 # Project dependencies & npm scripts
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher (or pnpm/yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/ignite-sports-club.git
   cd ignite-sports-club
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up local environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

---

## Quality Checks & Commands

Run these commands locally before submitting any Pull Request:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with Hot Module Replacement |
| `npm run lint` | Runs Oxlint linter across all TypeScript & TSX files |
| `npm run build` | Runs TypeScript compiler (`tsc -b`) and Vite production bundle |
| `npm run preview` | Locally serves the production build from `dist/` |

---

## Collaboration & Open Source Guidelines

We welcome contributions from club members, student developers, and sports enthusiasts!

- **Contributing Guide**: Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for branch naming, commit standards, and PR workflows.
- **Code of Conduct**: Review [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) for community standards and expectations.
- **Security Policy**: See [`SECURITY.md`](./SECURITY.md) to report vulnerabilities responsibly.
- **License**: Released under the [MIT License](./LICENSE) with official club trademark reservations.

---

## Maintainers

- **IGNITE Athletics Engineering Team** — *EST. 2026*
- For questions or coordination, open an Issue or contact the club leads.
