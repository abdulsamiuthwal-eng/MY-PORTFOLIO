import React, { useState, useEffect, useRef } from 'react';
import { scrollToTop } from '../lib/scroll';

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: 'home', label: '1. Home' },
  { id: 'biography', label: '2. Biography' },
  { id: 'skills', label: '3. My Tech Stacks' },
  { id: 'timeline', label: '4. Experience & Education' },
  { id: 'project', label: '5. My Latest Projects' },
  { id: 'testimonials', label: '6. Testimonials' },
  { id: 'certifications', label: '7. Certifications & Specializations' },
  { id: 'instagram', label: '8. Instagram Feed' },
  { id: 'circular-cta', label: '9. Get In Touch' },
];

interface CustomScrollbarProps {
  isContactPage?: boolean;
}

const SLOT_HEIGHT = 28;      // Increased height of each dot slot for taller vertical size
const SLOT_GAP = 14;         // Increased gap between slots for taller vertical size
const TRACK_PADDING_TOP = 18; // Increased top padding for taller vertical size

const getAbsoluteTop = (el: HTMLElement): number => {
  let top = 0;
  let curr: HTMLElement | null = el;
  while (curr) {
    top += curr.offsetTop;
    curr = curr.offsetParent as HTMLElement | null;
  }
  return top;
};

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ isContactPage }) => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Return null on Contact Page (call hooks first or return null before hooks if safe, but hooks must be consistent)
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true);

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);

      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = SECTIONS[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const absoluteTop = getAbsoluteTop(el);
          if (scrollPos >= absoluteTop) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (isContactPage) {
    return null;
  }

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
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  const isShown = isVisible || isHovered;

  const activeRingTop = TRACK_PADDING_TOP + safeActiveIndex * (SLOT_HEIGHT + SLOT_GAP) + (SLOT_HEIGHT - 20) / 2;

  return (
    <>
      {/* Right Edge Invisible Hover Trigger Area */}
      <div
        className="ptf-scrollbar-hover-zone"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: '24px',
          height: '100vh',
          zIndex: 9989,
          pointerEvents: 'auto',
        }}
      />

      {/* Main Floating Custom Scrollbar Wrapper */}
      <div
        className="ptf-custom-scrollbar-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'fixed',
          right: '12px',
          top: '42%',
          transform: `translateY(-42%) translateX(${isShown ? '0px' : '120px'})`,
          opacity: isShown ? 1 : 0,
          pointerEvents: isShown ? 'auto' : 'none',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease',
          zIndex: 9990,
          padding: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Outer Track Pill Container */}
        <div
          style={{
            position: 'relative',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1.5px solid var(--ptf-border-color)',
            borderRadius: '24px',
            padding: `${TRACK_PADDING_TOP}px 7px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: `${SLOT_GAP}px`,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Top Half-Curved Orange Accent Cap */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '16px',
              backgroundColor: 'rgba(250, 69, 41, 0.35)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              pointerEvents: 'none',
            }}
          />

          {/* Bottom Half-Curved Orange Accent Cap */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '16px',
              backgroundColor: 'rgba(250, 69, 41, 0.35)',
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px',
              pointerEvents: 'none',
            }}
          />

          {/* Smooth Gliding Active Orange Ring */}
          <div
            style={{
              position: 'absolute',
              top: `${activeRingTop}px`,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid var(--ptf-accent-1)',
              backgroundColor: 'rgba(250, 69, 41, 0.18)',
              transition: 'top 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* 9 Section Dots */}
          {SECTIONS.map((sec, idx) => {
            const isActive = idx === safeActiveIndex;
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
                  width: '20px',
                  height: `${SLOT_HEIGHT}px`,
                  cursor: 'pointer',
                  zIndex: 3,
                }}
              >
                {/* Dot Center */}
                <div
                  style={{
                    width: isActive ? '7px' : '5px',
                    height: isActive ? '7px' : '5px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--ptf-accent-1)' : '#777777',
                    transition: 'all 0.3s ease',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CustomScrollbar;
