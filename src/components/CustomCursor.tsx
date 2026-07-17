import React, { useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const mouseCoords = useRef({ x: -100, y: -100 });
  const outerCoords = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseCoords.current.x = e.clientX;
      mouseCoords.current.y = e.clientY;

      if (innerRef.current) {
        innerRef.current.style.left = `${e.clientX}px`;
        innerRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Interpolate outer circle position for smooth trailing effect
    let animationFrameId: number;
    const updatePosition = () => {
      const ease = 0.16; // trailing speed
      const dx = mouseCoords.current.x - outerCoords.current.x;
      const dy = mouseCoords.current.y - outerCoords.current.y;

      outerCoords.current.x += dx * ease;
      outerCoords.current.y += dy * ease;

      if (outerRef.current) {
        outerRef.current.style.left = `${outerCoords.current.x}px`;
        outerRef.current.style.top = `${outerCoords.current.y}px`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic hover handler to scale cursor on hover
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.filter-item') ||
        target.classList.contains('filter-item') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT';

      if (outerRef.current) {
        if (isInteractive) {
          outerRef.current.classList.add('cursor-hover-outer');
        } else {
          outerRef.current.classList.remove('cursor-hover-outer');
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor when on body
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      <div className="cursor-inner" ref={innerRef} />
      <div className="cursor-outer" ref={outerRef} />
    </>
  );
};

export default CustomCursor;
