import React, { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { scrollToTop } from './lib/scroll';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import InstagramGrid from './components/InstagramGrid';
import CircularCTA from './components/CircularCTA';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ChatIcon from './components/ChatIcon';
import ProjectDetailPage from './components/ProjectDetailPage';

// Run before the browser can restore a previous scroll position on refresh —
// the app always opens the home view (except on the contact page), so any
// native scroll restoration would jump the user to an unexpected section.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// Deep-link only the contact page. Section anchors (#skills, #project, ...) and
// project detail hashes are stripped on refresh so the portfolio always opens
// at the home view with its animations.
if (window.location.hash && window.location.hash !== '#contact-page') {
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

// Re-run AOS animations for the currently visible view after a view switch.
// Transitions are temporarily disabled while elements are reset to their hidden
// state, then a forced reflow commits that hidden state (without this the
// browser treats the class flip as a 1->1 no-op and nothing replays). Once
// transitions are restored, AOS.refreshHard() animates everything back in.
const replayAOS = () => {
  const elements = document.querySelectorAll<HTMLElement>('[data-aos]');
  elements.forEach(el => {
    el.style.transition = 'none';
    el.classList.remove('aos-animate');
  });
  void document.body.offsetHeight;
  elements.forEach(el => {
    el.style.transition = '';
  });
  AOS.refreshHard();
};

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(() =>
    window.location.hash === '#contact-page' ? '#contact-page' : '#home',
  );
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Scroll to top on page refresh unless we're on the contact page
    if (window.location.hash !== '#contact-page') {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });

    const handleHashChange = () => {
      const newHash = window.location.hash;
      setCurrentHash(newHash);
    };

    // Global helper to replay section animations when clicking an already active link
    (window as any).triggerSectionAnimation = (hash: string) => {
      if (hash === '#home' || hash === '') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        replayAOS();
      } else {
        try {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            const sectionElements = element.querySelectorAll('.aos-init');
            sectionElements.forEach(el => el.classList.remove('aos-animate'));
            setTimeout(() => {
              AOS.refreshHard();
            }, 150);
          }
        } catch (e) {
          console.warn("Invalid selector:", e);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      delete (window as any).triggerSectionAnimation;
    };
  }, []);

  // Handle smooth scrolling for home page section anchors and page transitions
  useEffect(() => {
    const isPageView =
      currentHash === '#contact-page' ||
      currentHash.startsWith('#project/') ||
      currentHash === '#home' ||
      currentHash === '';

    if (isPageView) {
      // On the very first render AOS.init() has already animated the visible view
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      // Hard reset scroll (safe 2-arg form — no 'instant' behavior that throws
      // on mobile browsers) and replay AOS animations for the newly shown view
      scrollToTop();
      requestAnimationFrame(() => {
        scrollToTop();
        replayAOS();
      });
      const timer = setTimeout(() => {
        scrollToTop();
        replayAOS();
      }, 60);
      return () => clearTimeout(timer);
    }

    if (currentHash) {
      try {
        const element = document.querySelector(currentHash);
        if (element) {
          const delay = setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
            AOS.refresh();
          }, 50);
          return () => clearTimeout(delay);
        }
      } catch (e) {
        console.warn("Invalid anchor hash selector:", e);
      }
    }
  }, [currentHash]);

  // Push floating icons smoothly above footer when footer enters viewport
  useEffect(() => {
    const handleFooterPush = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const visibleFooterHeight = windowHeight - footerTop;

      if (visibleFooterHeight > 0) {
        document.documentElement.style.setProperty('--footer-push', `${visibleFooterHeight}px`);
        document.documentElement.classList.add('footer-push');
      } else {
        document.documentElement.style.setProperty('--footer-push', '0px');
        document.documentElement.classList.remove('footer-push');
      }
    };

    window.addEventListener('scroll', handleFooterPush, { passive: true });
    window.addEventListener('resize', handleFooterPush, { passive: true });
    handleFooterPush();

    return () => {
      window.removeEventListener('scroll', handleFooterPush);
      window.removeEventListener('resize', handleFooterPush);
    };
  }, [currentHash]);

  const isContactPage = currentHash === '#contact-page';
  const isProjectDetailPage = currentHash.startsWith('#project/');

  return (
    <>
      <CustomCursor />
      <ChatIcon isContactPage={isContactPage} />
      <Navbar />
      <main>
        {/* Contact Page View */}
        {isContactPage && <ContactPage />}

        {/* Project Detail Page View */}
        {isProjectDetailPage && (
          <ProjectDetailPage projectId={currentHash.replace('#project/', '')} />
        )}

        {/* Main Portfolio Home View */}
        {!isContactPage && !isProjectDetailPage && (
          <div id="home">
            <Hero />
            <About />
            <Skills />
            <Timeline />
            <Projects />
            <Testimonials />
            <InstagramGrid />
            <CircularCTA />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default App;
