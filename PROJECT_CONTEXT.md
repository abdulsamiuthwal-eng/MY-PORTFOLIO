# 🚀 ABDUL SAMI UTHWAL — PORTFOLIO PROJECT CONTEXT

> **Purpose**: This document provides the complete, authoritative architectural, historical, and behavioral context of this repository for any AI assistant/agent starting a new session.

---

## 👤 Developer Profile & Project Identity
- **Owner / Developer**: Abdul Sami Uthwal
- **Role**: Software Engineer | AI Developer | Full Stack Web & Mobile App Developer
- **Personal AI Assistant**: **Kitty (AI Assistant)**
- **Assistant Welcome Greeting**:
  `"👋 Welcome! Hi, I am Kitty! Ask me anything about ABDUL SAMI UTHWAL — his skills, projects, experience, or anything else. You can type or use the mic!"`
- **Live Production URL**: [https://abdulsamiuthwal-portfolio.vercel.app](https://abdulsamiuthwal-portfolio.vercel.app)
- **Local Dev Server**: `http://localhost:5173/` (Vite)

---

## 🛠️ Technology Stack & Architecture
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Pure Modern CSS (`src/index.css`) + Scoped Inline Styles for dynamic animations (NO Tailwind CSS)
- **Icons**: Lucide React + custom SVG icons
- **Animations**: AOS (Animate on Scroll) + Custom 60 FPS GPU Compositor Keyframes (`translate3d`, `scale3d`)
- **Backend / Serverless**:
  - `api/chat.js` (Vercel Serverless Function — Google Gemini API with resilient multi-key fallback)
  - `api/web3forms.js` (Vercel Serverless Function — Web3Forms contact submission proxy)
- **Deployment**: GitHub (`origin/main`) synced directly with Vercel Production CLI (`npx vercel --prod --yes`)

---

## 📁 Key File Structure & Responsibilities

| File Path | Description / Responsibilities |
|---|---|
| `src/App.tsx` | Main root app, routing between Home view, `#contact-page`, `#project/:id`, AOS lifecycle management, and global event coordination. |
| `src/index.css` | Global styles, typography (`Inter`, `Amiri`), CSS variables (`--ptf-accent-1: #fa4529`), custom cursor classes, native scrollbar hiding rules, and momentum scrolling (`html { overflow-x: clip; }`). |
| `src/components/CustomScrollbar.tsx` | 9-section desktop custom dot sidebar widget (positioned on left-side). Features top/bottom orange capsule caps, gliding active ring, section dot highlighting (`#fa4529`), left hover zone, and auto-hide timer. Throttled with `requestAnimationFrame`. |
| `src/components/ChatIcon.tsx` | Floating AI assistant trigger button at bottom-right. Manages chat opening/closing state, unread counter, and audio recording. |
| `src/components/ChatPanel.tsx` | Full AI Chat panel for **Kitty**. Includes greeting intro video (`robot-cleans-teeth-and-waves-202608142326_Pf71GIQx.mp4` — **compressed 1.33MB** for fast mobile load, NO `currentTime` seek to prevent mobile freeze), message video loop (`boticon.mp4`), streaming response cursor, voice mic input, glowing rotating glassy orange orb button, and smooth 60 FPS open/close GPU scale animations. |
| `src/components/VoiceChat.tsx` | Interactive full-screen Voice Mode modal for **Kitty**. Plays avatar robot video (`Robot_waves_and_nods...mp4`) synchronized with browser TTS speech at exact timestamps (`2.03s`, `5.18s`, `7.18s`), captures user voice through Web Speech Recognition, and streams responses with animated glowing audio rings. |
| `src/components/CustomCursor.tsx` | Hardware-accelerated custom cursor with `will-change: transform` and `requestAnimationFrame` interpolation. |
| `src/components/Navbar.tsx` | Desktop & mobile responsive header, menu drawer with backdrop blur, and smooth section navigation links. |
| `src/components/Hero.tsx` | Hero introduction section (`#home`) with avatar, social badges, and CTAs. |
| `src/components/About.tsx` | Biography section (`#biography`). |
| `src/components/Skills.tsx` | Tech stack showcase (`#skills`). |
| `src/components/Timeline.tsx` | Experience & Education interactive timeline (`#timeline`). |
| `src/components/Projects.tsx` | Featured portfolio projects grid (`#project`). |
| `src/components/ProjectDetailPage.tsx` | Deep-dive project view (`#project/:id`). |
| `src/components/Testimonials.tsx` | Client reviews (`#testimonials`) and certificate lightbox modals (`#certifications`). |
| `src/components/InstagramGrid.tsx` | Instagram social feed cards (`#instagram`). |
| `src/components/CircularCTA.tsx` | Circular interactive SVG contact CTA (`#circular-cta`). |
| `src/components/ContactPage.tsx` | Full dedicated Contact page (`#contact-page`) with currency dropdown, dynamic budget inputs, and Web3Forms email integration. |
| `src/components/Footer.tsx` | Copyright info, social links, and throttled back-to-top button. |
| `api/chat.js` | Serverless Gemini API integration with model rotation & fallback. |

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
- **Future Roadmap & Kitty Upgrades**:
  - **Upcoming Female Robot Greeting Video Options (Google Flow / Veo 10s Prompts)**:
    - **Concept 1 (Sci-Fi Hologram Activation)**: Dormant charging pose on clean white studio -> chest reactor pulses orange (`#fa4529`) & eyes blink open (0-3s) -> steps forward with holographic neural data rings (3-6s) -> dismisses holographic window (6-8s) -> waves & greets *"Hi! I'm Kitty! Welcome to Sami's portfolio!"* (8-10s).
    - **Concept 2 (AI Developer at Holographic Desk)**: Typing fast on floating orange code/ML screens (0-3s) -> alerts to visitor (3-5s) -> collapses code screens into tiny orange orb & stands up (5-7s) -> pauses 1s (7-8s) -> waves & speaks *"Hello Sir! How can I help you explore Sami's work today?"* (8-10s).
    - **Concept 3 (Glowing Orb Morph - SELECTED)**: Electric orange glass orb floats & spins (0-3s) -> morphs fluidly into full female humanoid robot landing on white floor (3-6s) -> stretches & powers up to 100% (6-8s) -> polite wave & mouths/speaks: *"Hello Sir! How can I help you today?"* (8-10s). Exact timestamp for natural voice sync.
    - **Concept 4 (VIP Luxury AI Concierge)**: Standing poised with transparent glass tablet (0-3s) -> senses visitor & lowers tablet (3-5s) -> graceful VIP welcome bow with hand on chest (5-7s) -> straightens up with radiant smile (7-8s) -> waves & speaks *"Welcome Sir! Ready to explore Abdul Sami's portfolio?"* (8-10s).
  - **Full Real-Time Voice Mode**: ChatGPT-style low-latency bidirectional voice interaction with natural female TTS/audio.
