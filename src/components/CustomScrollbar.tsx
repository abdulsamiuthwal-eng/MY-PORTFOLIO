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

const SLOT_HEIGHT = 20; // height of each dot clickable slot
const SLOT_GAP = 8;     // gap between slots
const TRACK_PADDING_TOP = 14; // top padding for curved cap

const CustomScrollbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Make scrollbar visible immediately on scroll
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
    handleScroll();

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
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  const isShown = isVisible || isHovered;

  // Active ring vertical offset calculation for smooth gliding
  const activeRingTop = TRACK_PADDING_TOP + safeActiveIndex * (SLOT_HEIGHT + SLOT_GAP) + (SLOT_HEIGHT - 18) / 2;

  return (
    <>
      {/* Right Edge Invisible Hover Trigger Area */}
      <div
        className="ptf-scrollbar-hover-zone"
        onMouseEnter={handleMouseEnter}
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
          top: '50%',
          transform: `translateY(-50%) translateX(${isShown ? '0px' : '90px'})`,
          opacity: isShown ? 1 : 0,
          pointerEvents: isShown ? 'auto' : 'none',
          transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease',
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
            padding: `${TRACK_PADDING_TOP}px 6px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: `${SLOT_GAP}px`,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Top Half-Curved Accent Cap (Exact reference image styling) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '12px',
              backgroundColor: 'rgba(250, 69, 41, 0.35)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              pointerEvents: 'none',
            }}
          />

          {/* Bottom Half-Curved Accent Cap (Exact reference image styling) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '12px',
              backgroundColor: 'rgba(250, 69, 41, 0.35)',
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px',
              pointerEvents: 'none',
            }}
          />

          {/* Smooth Gliding Active Orange Ring (No blinking, glides up & down track) */}
          <div
            style={{
              position: 'absolute',
              top: `${activeRingTop}px`,
              width: '18px',
              height: '18px',
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
                  width: '18px',
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
