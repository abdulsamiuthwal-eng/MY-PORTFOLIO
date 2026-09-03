# 🚀 ABDUL SAMI UTHWAL — PORTFOLIO MASTER ARCHITECTURAL CONTEXT

> **Authority & Purpose**: This document serves as the single source of truth (SSOT) for the architecture, component hierarchy, credential records, security protocols, animation engines, and design systems of this portfolio. Any AI assistant or developer working on this codebase MUST strictly adhere to the patterns and behavioral rules documented here.

---

## 👤 Developer Profile & Project Identity

- **Owner / Developer**: Abdul Sami Uthwal
- **Role**: Software Engineer & AI/ML Developer | Full Stack Web & Mobile App Developer
- **Location**: Operating globally from Pakistan (Jhang, Punjab, Pakistan)
- **Contact Email**: `abdulsamiuthwal@gmail.com`
- **Contact Phone**: `+92 307 365 1919`
- **Personal AI Assistant**: **Kitty (AI Assistant)**
  - **Greeting**: `"👋 Welcome! Hi, I am Kitty! Ask me anything about ABDUL SAMI UTHWAL — his skills, projects, experience, or anything else. You can type or use the mic!"`
  - **Voice Persona**: Lily Rose (`t4U671CQHG58R11znrVj` via ElevenLabs)
- **Live Production URL**: [https://abdulsamiuthwal-portfolio.vercel.app](https://abdulsamiuthwal-portfolio.vercel.app)
- **Local Dev Server**: `http://localhost:5173/` (Vite)
- **Git Remote**: `https://github.com/abdulsamiuthwal-eng/MY-PORTFOLIO.git` (Branch: `main`)

---

## 🛠️ Complete Technology Stack & Specifications

| Layer | Technologies / Tools | Description / Configuration |
|---|---|---|
| **Core Framework** | React 19, TypeScript, Vite | Modern React with strict type safety and sub-second HMR. |
| **Styling & CSS** | Pure Vanilla CSS (`src/index.css`) | Design token system, CSS variables (`--ptf-*`), zero Tailwind CSS, GPU-composited animations. |
| **Icons** | Lucide React + Inline SVG | High-performance vector icon set. |
| **Motion & Scroll** | AOS (Animate on Scroll) + Custom GSAP / RAF | 60–120 FPS hardware-accelerated animations using `translate3d`, `scale3d`, and cubic bezier easings. |
| **AI Intelligence** | Google Gemini API (`api/chat.js`) | Multi-model rotation (`gemini-2.0-flash`, `gemini-1.5-flash`) with dynamic resilient fallback. |
| **Voice & Speech** | ElevenLabs Streaming TTS (`api/tts.js`) | Real-time audio streaming with **Lily Rose** voice on `eleven_flash_v2_5` / `multilingual_v2`. |
| **Contact Proxy** | Web3Forms (`api/web3forms.js`) | Serverless secure form forwarding proxy. |
| **Hosting / CI-CD** | Vercel Production + GitHub CI | Automated zero-downtime serverless edge deployments. |

---

## 📁 Master File Map & Component Responsibilities

### 1. Root & Configuration
- **`src/App.tsx`**: Central application orchestrator. Handles hash-based view routing (`#home`, `#contact-page`, `#project/:id`), manages AOS lifecycle, mounts the `useContentProtection` hook, and conditionally renders the desktop `<CustomScrollbar />` strictly on the main home view.
- **`src/index.css`**: Global design token stylesheet (~3,750 lines). Contains typography (`Inter`, `Amiri`), CSS variables (`--ptf-accent-1: #fa4529`, `--ptf-white-color: #ffffff`), supreme z-index cursor definitions (`2147483647`), anti-copy & anti-selection rules, momentum scrolling fixes (`html { overflow-x: clip; }`), portrait frame styling, and video footer layout.
- **`src/main.tsx`**: Application entry point mounting React root with StrictMode.

### 2. Custom Hooks & Utilities
- **`src/hooks/useContentProtection.ts`**: Comprehensive intellectual property and anti-scraping security hook. Intercepts and disables:
  - Right-click context menu (`contextmenu`)
  - Copy, cut, and select-all shortcuts (`Ctrl+C`, `Ctrl+X`, `Ctrl+A`)
  - Source inspection and DevTools (`Ctrl+U`, `Ctrl+S`, `Ctrl+P`, `F12`, `Ctrl+Shift+I/J/C`)
  - Mobile long-press callout menus (`-webkit-touch-callout: none`)
  - Drag-and-drop on images and links
  - Preserves standard typing and editing inside active `<input>` and `<textarea>` fields.
- **`src/lib/chat.ts`**: Client-side chat state management, prompt engineering context for **Kitty**, message history caching, and Gemini API stream handler.
- **`src/lib/scroll.ts`**: Smooth programmatic scrolling utility (`scrollToTop`).

### 3. Core UI Components (`src/components/`)
- **`Navbar.tsx`**: Responsive header navigation with dynamic dual-state architecture: resting full-width at top and morphing on scroll (`scrollY > 20`) into an ultra-slim, floating translucent frosted-glass capsule pill (`rgba(255, 255, 255, 0.45)` with `blur(24px)`) framed by a 1.5px continuously animated moving electric orange border beam (`@keyframes ptfMovingBorder`). Features the new high-resolution transparent "AS" serif monogram logo, direct CV access button with hover glow, and bidirectional zero-jerk mobile drawer slide transitions.
- **`Hero.tsx`**: Signature hero section (`#home`) featuring large typography, social links, CTAs, and scoped `@media (min-width: 992px)` proximity hover margins preventing mobile horizontal overflow.
- **`About.tsx`**: Biography & services section (`#biography`). Contains:
  - Left column: Bio text, contact details, services list.
  - Center column: Double oval portrait frame (`.ptf-custom--5512`) rendering `/long_portfolioprofile__upscaled (1).jpeg` with an elegant wave skeleton shimmer loading animation (`.ptf-skeleton`).
  - Right column: Dynamic stats (Years of Experience, Client Satisfaction, Projects) powered by an enhanced `CountUp` component that re-triggers on every scroll up/down via `IntersectionObserver`.
- **`Skills.tsx`**: Tech stack grid (`#skills`) showcasing categorized proficiencies (Frontend, Backend, AI/ML, DevOps, Databases).
- **`Timeline.tsx`**: Experience & Education interactive timeline (`#timeline`). Features official internship badges (`📄 Offer Letter`, `🏆 Completion Certificate`), issuer credential chips, direct portal verification links, and a full-screen PDF preview lightbox modal with dual-layer background scroll locking (`html` + `body`).
- **`Projects.tsx`**: Featured portfolio project carousel (`#project`). Implements a 3x cloned loop buffer, 1:1 touch/drag gestures, trackpad inertia dampening, and centered active highlighting.
- **`ProjectDetailPage.tsx`**: Deep-dive interactive case study page (`#project/:id`) with architecture diagrams, tech stacks, live demos, and terminal code walkthroughs.
- **`Testimonials.tsx`**: Dual-purpose section containing:
  - Client Reviews Slider (`#testimonials`): 0.65s cubic bezier glide, 280ms trackpad silence lock, and 1-slide-per-gesture protection.
  - Verified Credentials Showcase (`#certifications`): 4 clean category filter tabs, high-res certificate lightbox preview with dual-layer scroll lock, and direct portal verification.
- **`InstagramGrid.tsx`**: Dynamic social media showcase grid (`#instagram`).
- **`CircularCTA.tsx`**: Interactive rotating circular SVG contact CTA (`#circular-cta`).
- **`ContactPage.tsx`**: Full dedicated contact page (`#contact-page`) with currency dropdown, dynamic budget inputs, Web3Forms backend integration, and bottom padding seamlessly flowing into the video footer.
- **`Footer.tsx`**: Global footer containing copyright info, social links, back-to-top button, and high-impact looping black stallion smoke video background (`/horse-smoke-footer.mp4`).
- **`CustomScrollbar.tsx`**: 9-section desktop custom dot sidebar widget (positioned on left). Features top/bottom orange capsule caps, gliding active ring, section dot highlighting (`#fa4529`), left hover zone, and auto-hide timer. Restricted strictly to the main Home view.
- **`CustomCursor.tsx`**: Hardware-accelerated custom cursor with RAF interpolation and supreme `z-index: 2147483647` for uninterrupted visibility over all modal dialogs.
- **`ChatIcon.tsx`**: Floating AI assistant trigger button at bottom-right with glowing pulsating badge.
- **`ChatPanel.tsx`**: Full AI Chat panel for **Kitty**. Features greeting intro video (`robot-transforms-from-energy-orb-compressed.mp4`), message loop video (`boticon.mp4`), streaming response cursor, and voice mic input.
- **`VoiceChat.tsx`**: Hands-free full-screen Voice Mode for **Kitty**. 3-layer preloaded GPU crossfade stack (`Intro` -> `Listening` -> `Talking`), continuous hands-free VAD speech detection, instant Lily Rose filler triggers (`filler1-3.mp3`), and dynamic ElevenLabs TTS audio streaming.

### 4. Serverless API Endpoints (`api/`)
- **`api/chat.js`**: Vercel Serverless Function interfacing Google Gemini API with system prompt injection and resilient multi-model rotation.
- **`api/tts.js`**: Vercel Serverless Function interfacing ElevenLabs API for real-time MP3 audio streaming.
- **`api/web3forms.js`**: Vercel Serverless Function forwarding contact form submissions to Web3Forms.

---

## 📜 Experience Timeline & Verified Documents Catalog

All official internship documents are organized in `public/internships/`:

```text
public/internships/
├── flyrank/
│   └── OFFICIAL INTERNSHIP CONFIRMATION.pdf (Issued: Aug 4, 2026 | ID: FR-D1-8F5C4-F6835)
├── decodelabs/
│   ├── Your Offer Letter _ Decode Labs.pdf    (Issued: Jul 25, 2026)
│   └── DecodeLabs Internship Certificate.pdf  (Issued: Aug 26, 2026 | ID: AI086527)
├── devforge/
│   ├── OfferLetter_ABDUL SAMI UTHWAL.pdf                    (Issued: Jul 6, 2026)
│   ├── abdul-sami-uthwal-DFL-INT-2026-1360.pdf              (Issued: Aug 31, 2026 | ID: DFL-INT-2026-1360)
│   └── abdul-sami-uthwal-DFL-INT-2026-1360-certificate.pdf  (Issued: Aug 31, 2026 | ID: DFL-INT-2026-1360)
└── developerhub/
    ├── DHC Interns Offer Letters 8-412.pdf    (Issued: May 10, 2026 | ID: DHC-3562)
    └── Completion Certificates-267.pdf        (Issued: Jun 22, 2026 | ID: DHC-3562)
```

### Experience Items Order & Verification Portals:
1. 🥇 **FlyRank (Machine Learning Track)**
   - **Duration**: `Jul 2026 - Present`
   - **Role**: `Machine Learning Engineering Intern`
   - **Documents**: 📜 `Confirmation Letter` (Credential ID: `FR-D1-8F5C4-F6835`)
   - **Verification Portal**: `https://internship.flyrank.ai/verify?id=FR-D1-8F5C4-F6835`
2. 🥈 **DEVFORGE (AI Innovation Track)**
   - **Duration**: `Jul 2026 - Sep 2026`
   - **Role**: `AI Engineering Internship`
   - **Documents**: 📄 `Offer Letter` + 📋 `Completion Letter` + 🏆 `Completion Certificate` (Credential ID: `DFL-INT-2026-1360`)
   - **Verification Portal**: `https://devforge-internship-portal.vercel.app/verify`
3. 🥉 **DecodeLabs (Virtual Program)**
   - **Duration**: `Jul 2026 - Aug 2026`
   - **Role**: `Internship — Artificial Intelligence (AI)`
   - **Documents**: 📄 `Offer Letter` + 🏆 `Completion Certificate` (Credential ID: `AI086527`)
   - **Verification Portal**: `https://www.decodelabs.tech/verification`
4. 🏅 **Developers Hub (Engineering Cohort)**
   - **Duration**: `Apr 2026 - Jun 2026`
   - **Role**: `AI/ML Intern`
   - **Documents**: 📄 `Offer Letter` + 🏆 `Completion Certificate` (Credential ID: `DHC-3562`)
   - **Verification Portal**: `https://developershubcorp.com/`

### 📦 Scalable Experience Growth Architecture:
- `experiencesData: ExperienceItemData[]` data model in `Timeline.tsx`.
- `INITIAL_VISIBLE_COUNT = 2`: Keeps Education & Experience visually balanced.
- Zero-jerk accordion scroll open/hide drawer (`.timeline-experience-drawer` with CSS Grid `0fr ➔ 1fr` transition).
- Uiverse liquid wave hover fill button with continuous water wave animation, bubble splash, and scroll reveal entrance (`data-aos="fade-up"`).

---

## 🚀 Featured Projects Order (Carousel & Case Studies)

1. 🥇 **Vigilant Eye** — Real-Time AI Surveillance System (`#project/vigilant-eye` | Live: `https://vigilant-eye-gold.vercel.app`)
2. 🥈 **RAG Research Assistant** — RAG Chatbot with Llama 3.1 & ChromaDB (`#project/rag-chatbot`)
3. 🥉 **Rashid Dental AI Assistant** — Intelligent RAG-Powered Clinical Healthcare Bot & Appointment System (`#project/rashid-dental-ai-assistant` | Live: `https://rashid-dental-ai-assistant-3.onrender.com`)
4. 4️⃣ **AuraSentiment** — End-to-End Sentiment Analysis Web Application (`#project/aurasentiment-web-app` | Live: `https://sentiment-analysis-web-app-gcgl.vercel.app/`)
5. 5️⃣ **AI Data Classifier** — Iris Species Classification with Multi-Algorithm ML Pipeline (`#project/ai-data-classifier`)
6. 6️⃣ **CloudAssign** — Cloud-Based Assignment Submission Platform (`#project/cloud-assign`)
7. 7️⃣ **Smart Queue Management System** — Python & Firebase Backend (`#project/smart-queue`)
8. 8️⃣ **Project Census** — Android Data Collection Application (`#project/project-census`)
9. 9️⃣ **Library Management System** — C++ OOP Console Application (`#project/library-system`)

---

## 🛡️ Security & Intellectual Property Protection Specs

```css
/* Global Anti-Selection & Anti-Callout */
body, 
body *:not(input):not(textarea):not([contenteditable="true"]) {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
  -webkit-touch-callout: none !important;
}

/* Image Dragging Lockdown */
img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}

/* Anti-Print / PDF Export Blocker */
@media print {
  html, body {
    display: none !important;
    visibility: hidden !important;
  }
}
```

### Event Interception Rules:
- **`contextmenu`**: `preventDefault()` outside form fields.
- **`keydown`**: Blocks `F12`, `Ctrl+Shift+I/J/C`, `Ctrl+U`, `Ctrl+S`, `Ctrl+P`, `Ctrl+C`, `Ctrl+X`, `Ctrl+A` (outside form inputs).
- **`copy` / `cut`**: `preventDefault()` globally outside form inputs.
- **`dragstart`**: `preventDefault()` on all images and links.

---

## 🔒 Dual-Layer Viewport Scroll Locking Engine

Whenever an interactive document modal, certificate preview, or mobile navigation drawer opens:
1. **`document.documentElement.style.overflow = 'hidden'`**
2. **`document.body.style.overflow = 'hidden'`**
3. **`document.body.style.touchAction = 'none'`**
4. Modal backdrop uses `touchAction: 'none'`, `overscrollBehavior: 'contain'`, `onWheel={(e) => e.stopPropagation()}`, and `onTouchMove={(e) => e.stopPropagation()}`.
5. Modal card inside uses `touchAction: 'auto'`, `overscrollBehavior: 'contain'`, and `onClick={(e) => e.stopPropagation()}`.

---

## 🎨 Design Tokens & Visual Hierarchy

```css
:root {
  --ptf-accent-1: #fa4529;              /* Electric Vibrant Orange/Red */
  --ptf-accent-2: #e03d24;              /* Deep Accent Red */
  --ptf-text-color: #666666;            /* Medium Gray Body Text */
  --ptf-black-color: #000000;           /* True Black Heading Color */
  --ptf-white-color: #ffffff;           /* Crisp Pure White Surface */
  --ptf-border-color: #e2e8f0;          /* Subtle Slate Border */
  --ptf-font-sans: 'Inter', sans-serif; /* Clean Modern Sans */
  --ptf-font-serif: 'Amiri', serif;     /* Luxury Editorial Serif */
  --ptf-transition-duration: 300ms;
  --ptf-transition-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

## 📋 Strict Collaboration Guidelines

1. **Language**: Communicate with Sami in friendly **Roman Urdu**.
2. **Discipline**: Never touch, reformat, or alter working components unless explicitly instructed (*"is issue ko resolve kr doo iska ilawa kese chz ko ni chernaa strictly"*).
3. **Verification**: Always run `npm run build` locally before pushing to GitHub or deploying to Vercel.
4. **Deployments**: Execute `npx vercel --prod --yes` for production updates and keep GitHub `origin/main` in 100% parity.
