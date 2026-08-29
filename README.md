# 🚀 Abdul Sami Uthwal — Official Developer Portfolio

> **Software Engineer & AI/ML Developer | Full Stack Web & Mobile App Developer**  
> Operating globally from Pakistan • Specializing in Intelligent AI/ML Systems, Computer Vision, RAG Pipelines & High-Performance Full-Stack Applications.

[![Live Production](https://img.shields.io/badge/Live%20Portfolio-abdulsamiuthwal--portfolio.vercel.app-fa4529?style=for-the-badge&logo=vercel)](https://abdulsamiuthwal-portfolio.vercel.app)
[![React 19](https://img.shields.io/badge/React%2019-TypeScript-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Google Gemini](https://img.shields.io/badge/AI%20Assistant-Google%20Gemini-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![ElevenLabs](https://img.shields.io/badge/Voice%20TTS-ElevenLabs-000000?style=for-the-badge)](https://elevenlabs.io/)

---

## 🌟 Key Highlights & Engineering Features

### 🤖 1. Voice & Text AI Portfolio Assistant ("Kitty")
- **Dual-Mode AI Assistant**: Text Chat Panel and full-screen hands-free Voice Mode.
- **Intelligence Core**: Google Gemini API integration with resilient multi-model rotation (`gemini-2.0-flash`, `gemini-1.5-flash`).
- **Real-Time Voice Streaming**: Ultra-low-latency voice synthesis powered by ElevenLabs streaming TTS with **Lily Rose** voice persona (`t4U671CQHG58R11znrVj`).
- **Hardware-Accelerated Visuals**: 3-layer crossfade video engine (`Intro` -> `Listening` -> `Talking`) with natural speech detection (VAD).

### 📜 2. Verified Internship Documents & Experience Timeline
- **Interactive Experience Badges**: Official offer letters (`📄 Offer Letter`) and verified completion certificates (`🏆 Completion Certificate`) with credential ID chips.
- **Direct Portal Verification**: Live links to official organization verification portals (DecodeLabs, DEVFORGE, Developers Hub).
- **Dual-Layer Scroll Lock Lightbox**: Full-screen PDF preview modal with `html` + `body` viewport locking and gesture containment.

### 🛡️ 3. Enterprise Content & Intellectual Property Security
- **Anti-Copy & Selection Lock**: Global `user-select: none` and `-webkit-touch-callout: none` prevent text highlighting and mobile long-press menus.
- **Right-Click & Shortcut Lockdown**: Disables right-click context menu and intercepts `Ctrl+C`, `Ctrl+X`, `Ctrl+A`, `Ctrl+U`, `Ctrl+S`, `Ctrl+P`, `F12`, and `Ctrl+Shift+I/J/C`.
- **Image Drag Prevention**: `user-drag: none` blocks dragging images to desktop.
- **Anti-Print Protection**: `@media print { html, body { display: none !important; } }` blanks browser print dialogs.

### 🎨 4. Design, Motion & Visual Systems
- **Profile Portrait & Shimmer Loading**: High-resolution upscaled portrait in double oval frame (`.ptf-custom--5512`) with smooth skeleton wave loading animation.
- **Dynamic Repeatable Count-Up**: Statistics animate smoothly from 0 on every scroll up/down using `IntersectionObserver` and cubic easing.
- **Supreme Custom Cursor**: Hardware-accelerated cursor with maximum stacking `z-index: 2147483647` for uninterrupted visibility over all dialogs.
- **Desktop Dot Scrollbar**: 9-section custom dot sidebar navigation widget, active ring tracker, auto-hide timer, restricted strictly to the main Home view.
- **Calibrated Projects & Testimonials Carousel**: Custom 1:1 gesture-locked slider with 0.65s calm glide, 280ms trackpad silence lock, and seamless 3x buffer loop.
- **Cinematic Contact Page & Video Footer**: High-impact black stallion smoke video footer (`/horse-smoke-footer.mp4`) with Web3Forms serverless submission backend.

---

## 🛠️ Tech Stack & Tooling

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Pure Vanilla CSS (`src/index.css`), Design Tokens, AOS (Animate on Scroll)
- **Icons**: Lucide React, Custom SVGs
- **Serverless Backend**: Vercel Serverless Functions (`api/chat.js`, `api/tts.js`, `api/web3forms.js`)
- **Hosting & CI/CD**: Vercel Production + GitHub

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/abdulsamiuthwal-eng/MY-PORTFOLIO.git
cd MY-PORTFOLIO

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📁 Architectural Reference
For the full architectural specification, credential records, and file directory mapping, refer to [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md).
