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
| `src/components/ChatPanel.tsx` | Full AI Chat panel for **Kitty**. Includes intro video (`botintro.mp4`), message video loop (`boticon.mp4`), streaming response cursor, voice mic input, and smooth 60 FPS open/close GPU scale animations. |
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
- **Future Roadmap**: Potential upcoming upgrade discussed with user: Full real-time female voice chat (ChatGPT-style voice mode for Kitty).
