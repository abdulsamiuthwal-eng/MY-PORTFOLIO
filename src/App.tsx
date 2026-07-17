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

  // Handle smooth scrolling for home page section anchors
  useEffect(() => {
    if (currentHash === '#home' || currentHash === '') {
      if (sessionStorage.getItem('fromCallSami') === 'true') {
        sessionStorage.removeItem('fromCallSami');
        // Let the homepage layout render first, then scroll to bottom smoothly
        const delay = setTimeout(() => {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        }, 100);
        return () => clearTimeout(delay);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Reset AOS animations on the homepage so they replay
      const animatedElements = document.querySelectorAll('.aos-init');
      animatedElements.forEach(el => el.classList.remove('aos-animate'));
      setTimeout(() => {
        AOS.refresh();
      }, 150);
    } else if (currentHash && currentHash !== '#contact-page' && !currentHash.startsWith('#project/')) {
      sessionStorage.removeItem('fromCallSami');
      try {
        const element = document.querySelector(currentHash);
        if (element) {
          // Use a small timeout to let the home layout render when switching back from contact page
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

  // Push floating icons above footer when footer enters viewport
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const html = document.documentElement;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const push = footer.offsetHeight + 14;
          html.style.setProperty('--footer-push', `${push}px`);
          html.classList.add('footer-push');
        } else {
          html.style.setProperty('--footer-push', '0px');
          html.classList.remove('footer-push');
        }
      },
      { threshold: 0 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
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
