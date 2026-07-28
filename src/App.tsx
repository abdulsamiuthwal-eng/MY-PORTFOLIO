import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
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

const App: React.FC = () => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    // Prevent mobile browsers from automatically restoring previous scroll position down the page on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Scroll to top on page refresh unless viewing project details
    if (!window.location.hash.startsWith('#project/') && currentHash !== '#contact-page') {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
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
        const animatedElements = document.querySelectorAll('.aos-init');
        animatedElements.forEach(el => el.classList.remove('aos-animate'));
        setTimeout(() => {
          AOS.refresh();
        }, 150);
      } else {
        try {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            const sectionElements = element.querySelectorAll('.aos-init');
            sectionElements.forEach(el => el.classList.remove('aos-animate'));
            setTimeout(() => {
              AOS.refresh();
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
    if (currentHash === '#contact-page') {
      window.scrollTo(0, 0);
      const animatedElements = document.querySelectorAll('.aos-init');
      animatedElements.forEach(el => el.classList.remove('aos-animate'));
      setTimeout(() => {
        AOS.refresh();
      }, 150);
    } else if (currentHash === '#home' || currentHash === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset AOS animations on the homepage so they replay
      const animatedElements = document.querySelectorAll('.aos-init');
      animatedElements.forEach(el => el.classList.remove('aos-animate'));
      setTimeout(() => {
        AOS.refresh();
      }, 150);
    } else if (currentHash && !currentHash.startsWith('#project/')) {
      try {
        const element = document.querySelector(currentHash);
        if (element) {
          const delay = setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
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
      } else {
        document.documentElement.style.setProperty('--footer-push', '0px');
      }
    };

    window.addEventListener('scroll', handleFooterPush, { passive: true });
    window.addEventListener('resize', handleFooterPush, { passive: true });
    handleFooterPush();

    return () => {
      window.removeEventListener('scroll', handleFooterPush);
      window.removeEventListener('resize', handleFooterPush);
    };
  }, []);

  const isContactPage = currentHash === '#contact-page';
  const isProjectDetailPage = currentHash.startsWith('#project/');

  return (
    <>
      <CustomCursor />
      <ChatIcon />
      <Navbar />
      <main>
        {isContactPage ? (
          <ContactPage />
        ) : isProjectDetailPage ? (
          <ProjectDetailPage projectId={currentHash.replace('#project/', '')} />
        ) : (
          <>
            <Hero />
            <About />
            <Skills />
            <Timeline />
            <Projects />
            <Testimonials />
            <InstagramGrid />
            <CircularCTA />
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default App;
