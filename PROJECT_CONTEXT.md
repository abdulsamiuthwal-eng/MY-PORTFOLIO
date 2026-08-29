# 🚀 ABDUL SAMI UTHWAL — PORTFOLIO PROJECT CONTEXT

> **Purpose**: This document provides the complete, authoritative architectural, historical, and behavioral context of this repository for any AI assistant/agent starting a new session.

---

## 👤 Developer Profile & Project Identity
- **Owner / Developer**: Abdul Sami Uthwal
- **Role**: Software Engineer & AI/ML Developer | Full Stack Web & Mobile App Developer
- **Personal AI Assistant**: **Kitty (AI Assistant)**
- **Assistant Welcome Greeting**:
  `"👋 Welcome! Hi, I am Kitty! Ask me anything about ABDUL SAMI UTHWAL — his skills, projects, experience, or anything else. You can type or use the mic!"`
- **Live Production URL**: [https://abdulsamiuthwal-portfolio.vercel.app](https://abdulsamiuthwal-portfolio.vercel.app)
- **Local Dev Server**: `http://localhost:5173/` (Vite)

---

## 🛠️ Technology Stack & Architecture
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Pure Modern CSS (`src/index.css`) + Scoped Inline Styles for dynamic animations (NO Tailwind CSS)
- **Icons**: Lucide React + custom SVG icons
- **Animations**: AOS (Animate on Scroll) + Custom 60 FPS GPU Compositor Keyframes (`translate3d`, `scale3d`)
- **Backend / Serverless**:
  - `api/chat.js` (Vercel Serverless Function — Google Gemini API with resilient multi-key fallback)
  - `api/tts.js` (Vercel Serverless Function — ElevenLabs real-time streaming Text-To-Speech with **Lily Rose** voice `t4U671CQHG58R11znrVj` on `eleven_flash_v2_5` / `multilingual_v2`)
  - `api/web3forms.js` (Vercel Serverless Function — Web3Forms contact submission proxy)
- **Deployment**: GitHub (`origin/main`) synced directly with Vercel Production CLI (`npx vercel --prod --yes`)

---

## 📁 Key File Structure & Responsibilities

| File Path | Description / Responsibilities |
|---|---|
| `src/App.tsx` | Main root app, routing between Home view, `#contact-page`, `#project/:id`, AOS lifecycle management, and passing `isContactPage` state to `Footer`. |
| `src/index.css` | Global styles, typography (`Inter`, `Amiri`), CSS variables (`--ptf-accent-1: #fa4529`), custom cursor classes, native scrollbar hiding rules, momentum scrolling (`html { overflow-x: clip; }`), and contact footer video background styling. |
| `src/components/CustomScrollbar.tsx` | 9-section desktop custom dot sidebar widget (positioned on left-side). Features top/bottom orange capsule caps, gliding active ring, section dot highlighting (`#fa4529`), left hover zone, and auto-hide timer. Throttled with `requestAnimationFrame`. |
| `src/components/ChatIcon.tsx` | Floating AI assistant trigger button at bottom-right. Manages chat opening/closing state, unread counter, and audio recording. |
| `src/components/ChatPanel.tsx` | Full AI Chat panel for **Kitty**. Includes greeting intro video (`robot-transforms-from-energy-orb-compressed.mp4` — Concept 3 energy orb morph compressed to 1.5MB, NO `currentTime` seek to prevent mobile freeze), message video loop (`boticon.mp4`), streaming response cursor, voice mic input, glowing rotating glassy orange orb button, and smooth 60 FPS open/close GPU scale animations. |
| `src/components/VoiceChat.tsx` | Full-screen Hands-Free Voice Mode for **Kitty**. 3-layer preloaded GPU crossfade stack (`Intro` -> `Listening` -> `Talking`), continuous hands-free VAD speech detection, instant Lily Rose filler triggers (`filler1-3.mp3`), dynamic real-time ElevenLabs TTS audio streaming (`api/tts.js` with Lily Rose voice `t4U671CQHG58R11znrVj`), and strict hardware microphone abort on close. |
| `src/components/CustomCursor.tsx` | Hardware-accelerated custom cursor with `will-change: transform` and `requestAnimationFrame` interpolation. |
| `src/components/Navbar.tsx` | Desktop & mobile responsive header, menu drawer with backdrop blur, and smooth section navigation links. |
| `src/components/Hero.tsx` | Hero introduction section (`#home`) with avatar, social badges, CTAs, and title: `Software Engineer & AI/ML Developer`. |
| `src/components/About.tsx` | Biography section (`#biography`). |
| `src/components/Skills.tsx` | Tech stack showcase (`#skills`). |
| `src/components/Timeline.tsx` | Experience & Education interactive timeline (`#timeline`). |
| `src/components/Projects.tsx` | Featured portfolio projects slider (`#project`) with seamless 3x clone buffer loop, responsive drag/touch swipe, and centered item highlighting. |
| `src/components/ProjectDetailPage.tsx` | Deep-dive project view (`#project/:id`). |
| `src/components/Testimonials.tsx` | Client reviews slider (`#testimonials`) + Verified Credentials Showcase (`#certifications`). Includes 1:1 gesture-locked slider physics, seamless infinite loop, and certificate lightbox modals. |
| `src/components/InstagramGrid.tsx` | Instagram social feed cards (`#instagram`). |
| `src/components/CircularCTA.tsx` | Circular interactive SVG contact CTA (`#circular-cta`). |
| `src/components/ContactPage.tsx` | Full dedicated Contact page (`#contact-page`) with currency dropdown, dynamic budget inputs, Web3Forms email integration, and seamless bottom padding merge into the video footer. |
| `src/components/Footer.tsx` | Copyright info, social links, throttled back-to-top button, and dynamic `#contact-page` full-width looping horse smoke video background (`/horse-smoke-footer.mp4`). |
| `public/horse-smoke-footer.mp4` | High-impact cinematic black horse galloping with fluid trailing black smoke background video (~2.1 MB) for the Contact Page footer. |
| `api/chat.js` | Serverless Gemini API integration with model rotation & fallback. |
| `api/tts.js` | Serverless ElevenLabs TTS integration with Lily Rose voice. |

---

## 🎠 Testimonials & Slider Engineering Specs

### 1. Testimonials Slider (`#testimonials`) Architecture:
- **3x Cloned Loop Buffer**: Original list is cloned 3x (`[...testimonials, ...testimonials, ...testimonials]`). Initial state starts at `currentIndex = N` (the middle set).
- **Seamless Boundary Jump**: On `onTransitionEnd`, if `currentIndex >= 2 * N`, instantly warps without CSS transition to `currentIndex - N`; if `currentIndex < N`, instantly warps to `currentIndex + N`. An active `useEffect` triggers forced reflow to guarantee zero visual flash.
- **Trackpad / Wheel Event Silence Engine**:
  - Non-passive event listener attached directly to `containerRef.current`.
  - Direction Discrimination: If `abs(deltaX) <= abs(deltaY) || abs(deltaX) < 15`, returns immediately without `preventDefault`, allowing 120 FPS native page vertical scroll.
  - If horizontal gesture is detected (`abs(deltaX) > abs(deltaY)`): calls `preventDefault` (blocking browser Back/Forward history swipe navigation).
  - **Inertia Absorption**: Uses a 150ms silence debounce timer (`wheelEndTimerRef`). The first event of a physical swipe immediately triggers `setCurrentIndex(prev => prev + 1)` (or `-1`), while subsequent inertial ticks from the same physical swipe are cleanly absorbed without triggering a 2nd slide.
  - **Strictly 1 Slide per Gesture**: Guarantees zero multi-slide skipping.
- **Transition Dynamics**: `transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)` for smooth, elegant pacing.
- **Mouse & Touch Dragging**: 1:1 cursor drag with threshold detection (12% container width).
- **Cursor**: `cursor: default` (standard arrow cursor across the section, pointer for interactive buttons and dots).

---

## 🎨 Design System & Visual Guidelines
- **Primary Brand Color**: `--ptf-accent-1: #fa4529` (Vibrant Electric Orange / Red)
- **Secondary Accent**: `--ptf-accent-2: #e03d24`
- **Dark Neutral**: `--ptf-black-color: #000000`
- **Light Neutral**: `--ptf-white-color: #ffffff`
- **Border Color**: `--ptf-border-color: #e2e8f0`
- **Typography**: `Inter` (sans-serif) for body/UI, `Amiri` (serif) for italic accents.

---

## ⚡ Critical Performance & Stability Rules (DO NOT BREAK)
1. **Scrolling Performance**:
   - Never apply `overflow-x: hidden !important` to `body` or `#root` simultaneously (it breaks the browser's hardware momentum scrolling engine). Use `html { overflow-x: clip; }`.
   - Never mutate CSS variables on `<html>` / `document.documentElement` during high-frequency `scroll` events. Use GPU `transform: translateY(...)` for element translations instead.
   - Always throttle scroll listeners with `requestAnimationFrame` or `IntersectionObserver`.
2. **Chatbot Video Autoplay**:
   - Initial video renders MUST have `muted={true}` and fallback error handling to comply with Safari/Chrome mobile autoplay policies.
   - Defer video playback by ~300ms until after container opening animations complete.
3. **Cursor Performance**:
   - Custom cursor elements MUST utilize `will-change: transform` and CSS `transform: translate3d(...)` / `scale(...)` instead of animating `width`/`height` or triggering CPU layout repaints.
4. **Section IDs**:
   - Every section on the page has a UNIQUE ID (`home`, `biography`, `skills`, `timeline`, `project`, `testimonials`, `certifications`, `instagram`, `circular-cta`). Do NOT wrap parent views in duplicate IDs.

---

## 📋 Strict User Collaboration Guidelines
- **Communication Language**: Communicate with Sami in friendly **Roman Urdu**.
- **Scope Discipline**: *"is issue ko resolve kr doo iska ilawa kese chz ko ni chernaa strictly"* — Never touch or modify unrelated files or components.
- **Local Testing First**: Always test and verify changes on `localhost:5173` before pushing.
- **Explicit Consent**: Ask for confirmation before pushing to GitHub / deploying to Vercel.
- **Explaining First**: When Sami asks to diagnose or explain (*"srf dkh ka bataoo... krna kuch niiii"*), inspect and explain clearly before editing any files.

---

## 📜 Verified Credentials & Internship Documents Architecture

### 1. Internship Documents (`public/internships/` & `src/components/Timeline.tsx`):
- **Structured Storage**:
  - `public/internships/decodelabs/`:
    - `Your Offer Letter _ Decode Labs.pdf` (Issued July 25, 2026)
    - `DecodeLabs Internship Certificate.pdf` (Issued August 26, 2026 | ID: `AI086527` | Portal: `https://www.decodelabs.tech/`)
  - `public/internships/devforge/`:
    - `OfferLetter_ABDUL SAMI UTHWAL.pdf` (Issued July 6, 2026 | Portal: `https://devforgelabs.netlify.app/`)
  - `public/internships/developerhub/`:
    - `DHC Interns Offer Letters 8-412.pdf` (Issued May 10, 2026 | ID: `DHC-3562`)
    - `Completion Certificates-267.pdf` (Issued June 22, 2026 | ID: `DHC-3562` | Portal: `https://developershubcorp.com/`)

- **Interactive Experience Badges & Modal**:
  - In `Timeline.tsx`, each internship card features interactive buttons: `📄 Offer Letter` and `🏆 Completion Certificate` with credential ID chips.
  - Clicking any document opens a high-resolution lightbox modal with PDF preview, download button, and a live `🛡️ Verify Credential` link that navigates directly to the issuing organization's portal.
  - **Background Scroll Lock**: Whenever the document modal or certificate modal is open, `document.body.style.overflow = 'hidden'` is applied, preventing background portfolio scrolling until closed.

### 2. Verified Credentials Showcase (`#certifications` in `src/components/Testimonials.tsx`):
- Features **5 filter category tabs**:
  - `All Credentials (18)`
  - `Internships & Experience (5)`
  - `Core Tech & Software Eng (4)`
  - `AI, ML & Data Science (5)`
  - `Foundations & Education (3)`
- Each credential includes live verification IDs, links to verification portals (Coursera, Simplilearn, Forage, DecodeLabs, DevelopersHub, DEVFORGE), and high-resolution PDF preview modal with background scroll lock.

---

## 🎨 Mobile Responsiveness & Layout Boundaries
- **Zero Horizontal Overflow**:
  - Desktop-only proximity hover padding (`@media (min-width: 992px)`) on Hero headings (`ABDUL SAMI UTHWAL`, `Software Engineer & AI/ML Developer`, location, tagline), with clean zero-margin resets on mobile (`< 992px`).
  - Guarantees 100% symmetric container margins and edge-to-edge divider lines across all mobile devices.

---

## 🚀 Upcoming Roadmap / Backlog
1. **Performance & Dynamic Imports**: Consider code-splitting large chunks (`build.rolldownOptions.output.codeSplitting`) if bundle grows beyond 500 kB.
2. **SEO & OpenGraph Updates**: Continuously keep sitemap and meta tags updated for new portfolio sections.
3. **AI Assistant Video & Voice Refinements**:
   - Maintain the selected Concept 3 energy orb morph animation and Lily Rose voice persona.
