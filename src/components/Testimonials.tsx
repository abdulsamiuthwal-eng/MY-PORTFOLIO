import React, { useState, useRef, useEffect } from 'react';

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  companyUrl: string;
}

const Testimonials: React.FC = () => {
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

  const N = testimonials.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const wheelSnapTimeoutRef = useRef<any>(null);
  const wheelAccumulatorRef = useRef(0);

  // Handle Drag / Touch Start
  const handleStart = (clientX: number, clientY?: number) => {
    setIsDragging(true);
    dragStartXRef.current = clientX;
    if (clientY !== undefined) {
      dragStartYRef.current = clientY;
      isHorizontalSwipeRef.current = null;
    }
    setDragOffset(0);
    setIsAnimating(false);
  };

  // Handle Touch Move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    const deltaX = clientX - dragStartXRef.current;
    const deltaY = clientY - dragStartYRef.current;

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalSwipeRef.current === false) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    if (isHorizontalSwipeRef.current === true) {
      setDragOffset(deltaX);
    }
  };

  // Handle Mouse Move
  const handleMouseMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartXRef.current;
    setDragOffset(deltaX);
  };

  // Handle End (Touch / Mouse Up)
  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsAnimating(true);

    const containerWidth = containerRef.current?.offsetWidth || 1000;
    const threshold = containerWidth * 0.15; // 15% swipe threshold

    if (dragOffset < -threshold && currentIndex < N - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }

    setDragOffset(0);
    isHorizontalSwipeRef.current = null;
  };

  // Fluid 1:1 Pixel Scroll for Trackpad & Mouse Wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;

    // Accumulate horizontal scroll delta smoothly
    wheelAccumulatorRef.current += e.deltaX;
    const containerWidth = containerRef.current?.offsetWidth || 1000;

    // Apply immediate 1:1 pixel drag offset visual feedback
    setIsAnimating(false);
    setDragOffset(-wheelAccumulatorRef.current);

    // Clear existing snap timer
    if (wheelSnapTimeoutRef.current) {
      clearTimeout(wheelSnapTimeoutRef.current);
    }

    // Snap to nearest card after user stops wheeling
    wheelSnapTimeoutRef.current = setTimeout(() => {
      const accum = wheelAccumulatorRef.current;
      wheelAccumulatorRef.current = 0;
      setIsAnimating(true);

      const threshold = containerWidth * 0.15;
      if (accum > threshold && currentIndex < N - 1) {
        setCurrentIndex((prev) => Math.min(N - 1, prev + Math.ceil(accum / containerWidth)));
      } else if (accum < -threshold && currentIndex > 0) {
        setCurrentIndex((prev) => Math.max(0, prev + Math.floor(accum / containerWidth)));
      }

      setDragOffset(0);
    }, 120);
  };

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
  }, [isDragging, currentIndex, dragOffset]);

  return (
    <section id="testimonials" className="ptf-testimonials-section" style={{ backgroundColor: 'var(--ptf-white-color)' }}>
      <div className="container-xxl">
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '180px' }}></div>

        {/* Testimonial Slider Container */}
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
            touchAction: 'pan-y',
          }}
        >
          <div
            className="ptf-testimonials-track"
            style={{
              display: 'flex',
              width: `${N * 100}%`,
              transform: `translateX(calc(-${(currentIndex * 100) / N}% + ${dragOffset}px))`,
              transition: isDragging || !isAnimating ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                style={{ width: `${100 / N}%`, padding: '0 15px', textAlign: 'center', flexShrink: 0 }}
                className="ptf-animated-block"
                data-aos="fade-up"
              >
                <p
                  className="serif-font ptf-testimonial-quote"
                  style={{
                    fontSize: 'clamp(24px, 3.2vw, 42px)',
                    lineHeight: '1.45',
                    color: 'var(--ptf-black-color)',
                    maxWidth: '950px',
                    margin: '0 auto',
                    fontWeight: 400,
                  }}
                >
                  {t.quote}
                </p>
                <h4
                  className="ptf-testimonial-author"
                  style={{
                    marginTop: '40px',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: 'var(--ptf-black-color)',
                    fontFamily: 'var(--ptf-font-sans)',
                    textTransform: 'none',
                    letterSpacing: 'normal',
                    fontStyle: 'italic',
                  }}
                >
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
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`ptf-pagination-dot ${currentIndex === i ? 'active' : ''}`}
              onClick={() => {
                setIsAnimating(true);
                setDragOffset(0);
                setCurrentIndex(i);
              }}
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

