import React, { useState, useEffect, useRef } from 'react';
import { scrollToTop } from '../lib/scroll';

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'home', label: 'Home' },
  { id: 'biography', label: 'Biography' },
  { id: 'skills', label: 'Skills' },
  { id: 'timeline', label: 'Experience' },
  { id: 'project', label: 'Projects' },
  { id: 'contact-page', label: 'Contact' },
];

const CustomScrollbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Active section tracking via IntersectionObserver & hash sync
  useEffect(() => {
    const handleScroll = () => {
      // Make scrollbar visible on scroll
      setIsVisible(true);

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      // Determine active section by scroll position
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = SECTIONS[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const handleDotClick = (sectionId: string) => {
    if (sectionId === 'home' || sectionId === 'contact-page') {
      if (window.location.hash !== `#${sectionId}`) {
        window.location.hash = sectionId === 'home' ? '#home' : '#contact-page';
      } else {
        scrollToTop();
      }
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);

  return (
    <div
      className="ptf-custom-scrollbar-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'fixed',
        right: '10px',
        top: '50%',
        transform: `translateY(-50%) translateX(${isVisible || isHovered ? '0' : '35px'})`,
        opacity: isVisible || isHovered ? 1 : 0.25,
        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease',
        zIndex: 9990,
        padding: '12px 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      {/* Outer Pill Track Container */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid var(--ptf-border-color)',
          borderRadius: '24px',
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        }}
      >
        {SECTIONS.map((sec, idx) => {
          const isActive = idx === (activeIndex >= 0 ? activeIndex : 0);
          return (
            <div
              key={sec.id}
              onClick={() => handleDotClick(sec.id)}
              title={sec.label}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px',
                cursor: 'pointer',
              }}
            >
              {/* Active Orange Outer Ring */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '2px solid var(--ptf-accent-1)',
                    backgroundColor: 'rgba(250, 69, 41, 0.12)',
                    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                />
              )}

              {/* Dot center */}
              <div
                style={{
                  width: isActive ? '7px' : '6px',
                  height: isActive ? '7px' : '6px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--ptf-accent-1)' : '#a0a0a0',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomScrollbar;
