import React, { useState, useEffect, useRef } from 'react';

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
  isChatOpen?: boolean;
}

const SLOT_HEIGHT = 28;
const SLOT_GAP = 14;
const TRACK_PADDING_TOP = 18;

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ isContactPage, isChatOpen }) => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    if (isContactPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (SECTIONS.some((s) => s.id === id)) {
              setActiveSection((prev) => (prev !== id ? id : prev));
            }
          }
        });
      },
      {
        rootMargin: '-33% 0px -66% 0px',
        threshold: 0,
      }
    );

    observerRef.current = observer;

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) {
        sectionElementsRef.current.set(sec.id, el);
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [isContactPage]);

  useEffect(() => {
    if (isContactPage) return;

    let ticking = false;
    const handleScroll = () => {
      if (isChatOpen) {
        setIsVisible(false);
        return;
      }

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setIsVisible(true);
          ticking = false;
        });
      }

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        if (!isHovered) setIsVisible(false);
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isChatOpen, isContactPage, isHovered]);

  if (isContactPage) return null;

  const handleDotClick = (sectionId: string) => {
    if (sectionId === 'home' || sectionId === 'contact-page') {
      if (window.location.hash !== `#${sectionId}`) {
        window.location.hash = `#${sectionId}`;
      }
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseEnter = () => {
    if (isChatOpen) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 1500);
  };

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  const isShown = !isChatOpen && (isVisible || isHovered);

  const activeRingTop = TRACK_PADDING_TOP + safeActiveIndex * (SLOT_HEIGHT + SLOT_GAP) + (SLOT_HEIGHT - 20) / 2;

  return (
    <>
      <div
        className="ptf-scrollbar-hover-zone"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'fixed',
          right: 0,
          top: '30%',
          bottom: '30%',
          width: '28px',
          zIndex: 9989,
        }}
      />

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
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="ptf-scrollbar-track-container"
          style={{
            position: 'relative',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            border: '1.5px solid var(--ptf-border-color)',
            borderRadius: '24px',
            padding: `${TRACK_PADDING_TOP}px 7px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
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
          <div
            style={{
              position: 'absolute',
              top: `${activeRingTop}px`,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid var(--ptf-accent-1)',
              backgroundColor: 'rgba(250, 69, 41, 0.18)',
              boxShadow: '0 0 10px rgba(250, 69, 41, 0.4)',
              transition: 'top 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              pointerEvents: 'none',
            }}
          />
          {SECTIONS.map((sec) => {
            const isActive = sec.id === activeSection;
            return (
              <div
                key={sec.id}
                onClick={() => handleDotClick(sec.id)}
                className="ptf-scrollbar-dot-slot"
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
                  marginBottom: `${SLOT_GAP}px`,
                }}
              >
                <div
                  style={{
                    width: isActive ? '8px' : '5px',
                    height: isActive ? '8px' : '5px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--ptf-accent-1)' : '#a0aec0',
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