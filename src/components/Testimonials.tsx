import React, { useState, useRef, useEffect } from 'react';

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  companyUrl: string;
}

const Testimonials: React.FC = () => {
  const [activeDot, setActiveDot] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  const isDraggingRef = useRef(false);
  const wheelCooldownRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const testimonials: TestimonialItem[] = [
    {
      quote: "“Awarded Certificate of Participation for active participation in the national-level event 'INNOVATIVE PAKISTAN 2026' (THINK. BUILD. LEAD.), collaborating with IEEE, HEC, and leading academic institutions to showcase innovative solutions.”",
      author: "Innovative Pakistan 2026",
      role: "Organized by ",
      company: "IEEE, HEC & Partners",
      companyUrl: "#"
    },
    {
      quote: "“First, solve the problem. Then, write the code. Strive for simplicity and efficiency in every line of logic.”",
      author: "John Johnson",
      role: "Software Engineering Principal",
      company: "",
      companyUrl: ""
    },
    {
      quote: "“Clean code always looks like it was written by someone who cares. There is no substitute for craftsmanship.”",
      author: "Michael Feathers",
      role: "Author & Software Craftsman",
      company: "",
      companyUrl: ""
    }
  ];

  const numSlides = testimonials.length;

  const handleStart = (clientX: number, clientY?: number) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = clientX;
    if (clientY !== undefined) {
      dragStartYRef.current = clientY;
      isHorizontalSwipeRef.current = null;
    }
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    const deltaX = clientX - dragStartXRef.current;
    const deltaY = clientY - dragStartYRef.current;

    // Lock direction intent on first significant movement
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    // If user intended vertical page scroll, cancel slider drag
    if (isHorizontalSwipeRef.current === false) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    if (isHorizontalSwipeRef.current === true) {
      setDragOffset(deltaX);
    }
  };

  const handleMouseMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - dragStartXRef.current;
    setDragOffset(deltaX);
  };

  const handleEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    if (dragOffset < -50 && activeDot < numSlides - 1) {
      setActiveDot((prev) => prev + 1);
    } else if (dragOffset > 50 && activeDot > 0) {
      setActiveDot((prev) => prev - 1);
    }
    setDragOffset(0);
    isHorizontalSwipeRef.current = null;
  };

  // 2-Finger Trackpad & Mouse Wheel Horizontal Scroll
  const handleWheel = (e: React.WheelEvent) => {
    // Strictly isolate horizontal trackpad scroll; ignore vertical page scrolling
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    if (Math.abs(e.deltaX) < 15 || wheelCooldownRef.current) return;

    wheelCooldownRef.current = true;
    setTimeout(() => {
      wheelCooldownRef.current = false;
    }, 450);

    if (e.deltaX > 0 && activeDot < numSlides - 1) {
      setActiveDot((prev) => prev + 1);
    } else if (e.deltaX < 0 && activeDot > 0) {
      setActiveDot((prev) => prev - 1);
    }
  };

  // Global mouse move & mouse up listeners during mouse drag
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => handleMouseMove(e.clientX);
    const onMouseUp = () => handleEnd();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, activeDot, dragOffset]);

  return (
    <section id="testimonials" className="ptf-testimonials-section" style={{ backgroundColor: 'var(--ptf-white-color)' }}>
      <div className="container-xxl">
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '180px' }}></div>
        {/* Testimonial Slider */}
        <div
          ref={containerRef}
          className="ptf-testimonials-slider"
          onWheel={handleWheel}
          onMouseDown={(e) => handleStart(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
          style={{
            overflow: 'hidden',
            width: '100%',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          <div 
            className="ptf-testimonials-track" 
            style={{ 
              display: 'flex', 
              width: '300%', 
              transform: `translateX(calc(-${activeDot * 33.3333}% + ${dragOffset}px))`, 
              transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                style={{ width: '33.3333%', padding: '0 15px', textAlign: 'center' }}
                className="ptf-animated-block"
                data-aos="fade-up"
              >
                <p className="serif-font ptf-testimonial-quote" style={{ fontSize: 'clamp(24px, 3.2vw, 42px)', lineHeight: '1.45', color: 'var(--ptf-black-color)', maxWidth: '950px', margin: '0 auto', fontWeight: 400 }}>
                  {t.quote}
                </p>
                <h4 className="ptf-testimonial-author" style={{ marginTop: '40px', fontSize: '22px', fontWeight: 700, color: 'var(--ptf-black-color)', fontFamily: 'var(--ptf-font-sans)', textTransform: 'none', letterSpacing: 'normal', fontStyle: 'italic' }}>
                  {t.author}
                </h4>
                <p className="ptf-testimonial-role" style={{ marginTop: '5px', fontSize: '16px', color: '#999999', fontFamily: 'var(--ptf-font-sans)' }}>
                  {t.role}
                  {t.company && (
                    <a href={t.companyUrl} target="_blank" rel="noreferrer" style={{ color: '#0088ff', textDecoration: 'none', fontWeight: 500 }}>
                      {t.company}
                    </a>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Style Dots Pagination */}
        <div className="ptf-testimonials-dots ptf-animated-block" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              className={`ptf-pagination-dot ${activeDot === i ? 'active' : ''}`}
              onClick={() => setActiveDot(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Spacer */}
      <div className="ptf-spacer" style={{ height: '180px' }}></div>
    </section>
  );
};

export default Testimonials;
