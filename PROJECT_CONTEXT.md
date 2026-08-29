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
| `src/App.tsx` | Main root app, routing between Home view, `#contact-page`, `#project/:id`, AOS lifecycle management, and invoking `useContentProtection` security hook. |
| `src/index.css` | Global styles, typography (`Inter`, `Amiri`), CSS variables (`--ptf-accent-1: #fa4529`), supreme z-index cursor classes (`2147483647`), anti-copy & anti-selection rules, momentum scrolling (`html { overflow-x: clip; }`), and contact footer video styling. |
| `src/hooks/useContentProtection.ts` | Enterprise-grade Content & Intellectual Property Security hook. Intercepts and blocks right-click, `Ctrl+C`, `Ctrl+X`, `Ctrl+A`, `Ctrl+U`, `Ctrl+S`, `Ctrl+P`, `F12`, `Ctrl+Shift+I/J/C`, mobile long-press, and image drag-and-drop while gracefully allowing natural typing in forms and chat inputs. |
| `src/components/CustomScrollbar.tsx` | 9-section desktop custom dot sidebar widget (positioned on left-side). Features top/bottom orange capsule caps, gliding active ring, section dot highlighting (`#fa4529`), left hover zone, and auto-hide timer. Throttled with `requestAnimationFrame`. |
| `src/components/ChatIcon.tsx` | Floating AI assistant trigger button at bottom-right. Manages chat opening/closing state, unread counter, and audio recording. |
| `src/components/ChatPanel.tsx` | Full AI Chat panel for **Kitty**. Includes greeting intro video (`robot-transforms-from-energy-orb-compressed.mp4` — Concept 3 energy orb morph compressed to 1.5MB, NO `currentTime` seek to prevent mobile freeze), message video loop (`boticon.mp4`), streaming response cursor, voice mic input, glowing rotating glassy orange orb button, and smooth 60 FPS open/close GPU scale animations. |
| `src/components/VoiceChat.tsx` | Full-screen Hands-Free Voice Mode for **Kitty**. 3-layer preloaded GPU crossfade stack (`Intro` -> `Listening` -> `Talking`), continuous hands-free VAD speech detection, instant Lily Rose filler triggers (`filler1-3.mp3`), dynamic real-time ElevenLabs TTS audio streaming (`api/tts.js` with Lily Rose voice `t4U671CQHG58R11znrVj`), and strict hardware microphone abort on close. |
| `src/components/CustomCursor.tsx` | Hardware-accelerated custom cursor with `will-change: transform` and `requestAnimationFrame` interpolation. Styled with `z-index: 2147483647` for uninterrupted visibility over all modal dialogs. |
| `src/components/Navbar.tsx` | Desktop & mobile responsive header, menu drawer with backdrop blur, and smooth section navigation links. |
| `src/components/Hero.tsx` | Hero introduction section (`#home`) with avatar, social badges, CTAs, and title: `Software Engineer & AI/ML Developer`. Desktop-only hover proximity padding (`@media (min-width: 992px)`) preventing mobile horizontal overflow. |
| `src/components/About.tsx` | Biography section (`#biography`). Features dynamic, repeatable count-up animations for stats on scroll up/down with IntersectionObserver and cubic easing. |
| `src/components/Skills.tsx` | Tech stack showcase (`#skills`). |
| `src/components/Timeline.tsx` | Education & Experience interactive timeline (`#timeline`). Features reordered experiences (DEVFORGE 1st, DecodeLabs 2nd, Developer Hub 3rd), interactive document badges, verification chips, direct portal verification links, and a full-screen PDF preview lightbox modal with dual-layer viewport scroll lock (`html` + `body`). |
| `src/components/Projects.tsx` | Featured portfolio projects slider (`#project`) with seamless 3x clone buffer loop, responsive drag/touch swipe, and centered item highlighting. Order: 1. Vigilant Eye, 2. RAG Research Assistant, 3. Rashid Dental AI Assistant, 4. AuraSentiment, 5. AI Data Classifier, 6. CloudAssign, 7. Smart Queue, 8. Project Census, 9. Library System. |
| `src/components/ProjectDetailPage.tsx` | Deep-dive project view (`#project/:id`). |
| `src/components/Testimonials.tsx` | Client reviews slider (`#testimonials`) + Verified Credentials Showcase (`#certifications`). Features calibrated 0.65s slider glide, 280ms trackpad silence lock, 4 clean certification category tabs, and PDF preview modals with dual-layer scroll lock and direct verification portal links. |
| `src/components/InstagramGrid.tsx` | Instagram social feed cards (`#instagram`). |
| `src/components/CircularCTA.tsx` | Circular interactive SVG contact CTA (`#circular-cta`). |
| `src/components/ContactPage.tsx` | Full dedicated Contact page (`#contact-page`) with currency dropdown, dynamic budget inputs, Web3Forms email integration, and seamless bottom padding merge into the video footer. |
| `src/components/Footer.tsx` | Copyright info, social links, throttled back-to-top button, and dynamic `#contact-page` full-width looping horse smoke video background (`/horse-smoke-footer.mp4`). |
| `public/internships/` | Dedicated directory containing official internship offer letters and verified completion certificates organized by organization (`decodelabs`, `devforge`, `developerhub`). |
| `public/horse-smoke-footer.mp4` | High-impact cinematic black horse galloping with fluid trailing black smoke background video (~2.1 MB) for the Contact Page footer. |

---

## 📜 Experience & Verified Documents Architecture

### 1. Experience Timeline Items (`src/components/Timeline.tsx`):
1. 🥇 **DEVFORGE (AI Innovation Track)**:
   - **Timeline**: `Jul 2026 - Sep 2026`
   - **Role**: `AI/ML Intern`
   - **Documents**: 📄 `Offer Letter` (`/internships/devforge/OfferLetter_ABDUL SAMI UTHWAL.pdf` | Portal: `https://devforgelabs.netlify.app/`)
2. 🥈 **DecodeLabs (Virtual Program)**:
   - **Timeline**: `Jul 2026 - Aug 2026`
   - **Role**: `Internship — Artificial Intelligence (AI)`
   - **Documents**: 
     - 📄 `Offer Letter` (`/internships/decodelabs/Your Offer Letter _ Decode Labs.pdf`)
     - 🏆 `Completion Certificate` (`/internships/decodelabs/DecodeLabs Internship Certificate.pdf` | ID: `AI086527` | Portal: `https://www.decodelabs.tech/`)
3. 🥉 **Developers Hub (Engineering Cohort)**:
   - **Timeline**: `Apr 2026 - Jun 2026`
   - **Role**: `AI/ML Intern`
   - **Documents**:
     - 📄 `Offer Letter` (`/internships/developerhub/DHC Interns Offer Letters 8-412.pdf` | ID: `DHC-3562`)
     - 🏆 `Completion Certificate` (`/internships/developerhub/Completion Certificates-267.pdf` | ID: `DHC-3562` | Portal: `https://developershubcorp.com/`)

### 2. Dual-Layer Viewport Scroll Lock & Modal Engineering:
- **Background Lock**: When any document or certificate modal opens, both `document.documentElement` and `document.body` receive `overflow: hidden; touch-action: none;`, preventing background scrolling across all desktop trackpads and mobile touch screens.
- **Gesture Containment**: Modal overlay backdrop features `touchAction: 'none'`, `overscrollBehavior: 'contain'`, `onWheel={(e) => e.stopPropagation()}`, and `onTouchMove={(e) => e.stopPropagation()}`.
- **Live Verification Links**: Modals contain a direct `🛡️ Verify Credential` button linked directly to the issuer's verification portal.

---

## 🛡️ Content & Intellectual Property Security Suite
- **Text & UI Selection Block**: Global `user-select: none !important;` and `-webkit-touch-callout: none !important;` prevent all mouse cursor highlighting and mobile long-press callout menus (while preserving typing in inputs and textareas).
- **Right-Click Lockdown**: `contextmenu` event is intercepted and blocked globally across the page.
- **Keyboard Shortcut Interception**: Blocks `Ctrl+C`, `Ctrl+X`, `Ctrl+A`, `Ctrl+U`, `Ctrl+S`, `Ctrl+P`, `F12`, and `Ctrl+Shift+I/J/C`.
- **Image Drag Prevention**: `user-drag: none` and `dragstart` event interception block dragging images onto the desktop.
- **Anti-Print Protection**: `@media print { html, body { display: none !important; } }` blanks the page if a user triggers browser print dialogs.

---

## 🎠 Testimonials & Slider Engineering Specs
- **3x Cloned Loop Buffer**: Original list is cloned 3x (`[...testimonials, ...testimonials, ...testimonials]`). Initial state starts at `currentIndex = N` (the middle set).
- **Seamless Boundary Jump**: On `onTransitionEnd`, boundary wraps without flash via forced reflow.
- **Inertia Silence Debounce (280ms)**: Trackpad inertia is absorbed cleanly so a single physical gesture triggers strictly 1 slide.
- **Transition Dynamics**: `transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)` for calm, elegant, premium gliding.
- **Cursor**: `cursor: default` with supreme `z-index: 2147483647` for smooth visibility over all dialogs.

---

## 🎨 Mobile Responsiveness & Layout Boundaries
- **Zero Horizontal Overflow**:
  - Desktop-only proximity hover padding (`@media (min-width: 992px)`) on Hero headings (`ABDUL SAMI UTHWAL`, `Software Engineer & AI/ML Developer`, location, tagline), with clean zero-margin resets on mobile (`< 992px`).
  - Guarantees 100% symmetric container margins and edge-to-edge divider lines across all mobile devices.

---

## 📋 Strict User Collaboration Guidelines
- **Communication Language**: Communicate with Sami in friendly **Roman Urdu**.
- **Scope Discipline**: *"is issue ko resolve kr doo iska ilawa kese chz ko ni chernaa strictly"* — Never touch or modify unrelated files or components.
- **Local Testing First**: Always test and verify changes on `localhost:5173` before pushing.
- **Explicit Consent**: Ask for confirmation before pushing to GitHub / deploying to Vercel.
- **Explaining First**: When Sami asks to diagnose or explain (*"srf dkh ka bataoo... krna kuch niiii"*), inspect and explain clearly before editing any files.
