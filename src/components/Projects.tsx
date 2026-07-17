import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectItemProps {
  image: string;
  title: string;
  category: string;
  link: string;
  liveLink?: string | null;
  onClick?: (e: React.MouseEvent) => void;
  isActive?: boolean;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ image, title, category, link, onClick, isActive }) => {
  return (
    <div className="ptf-portfolio-slider-item">
      <div className={`ptf-work ${isActive ? 'is-active' : ''}`}>
        {/* Media (Square Image) */}
        <div className="ptf-work__media">
          <a 
            href={link} 
            onClick={onClick} 
            draggable="false" 
            onDragStart={(e) => e.preventDefault()} 
            style={{ display: 'block', width: '100%', height: '100%' }}
          >
            <img src={image} alt={title} draggable={false} style={{ userSelect: 'none', pointerEvents: 'none' }} />
          </a>
        </div>
        
        {/* Meta details */}
        <div className="ptf-work__meta">
          <span className="ptf-work__category" style={{ userSelect: 'none' }}>{category}</span>
          <a 
            href={link} 
            onClick={onClick} 
            draggable="false" 
            onDragStart={(e) => e.preventDefault()} 
            className="ptf-work__title" 
            style={{ userSelect: 'none' }}
          >
            {title}
          </a>
        </div>
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const projectList = [
    {
      image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80',
      title: 'Vigilant Eye — Real-Time AI Surveillance System',
      category: 'Artificial Intelligence / Computer Vision',
      link: '#project/vigilant-eye',
      liveLink: 'https://vigilant-eye-gold.vercel.app',
    },
    {
      image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80',
      title: 'RAG Research Assistant — RAG Chatbot (Llama 3.1 & ChromaDB)',
      category: 'RAG System / AI Chatbot',
      link: '#project/rag-chatbot',
      liveLink: null,
    },
    {
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      title: 'CloudAssign — Cloud-Based Assignment Submission',
      category: 'Cloud & Web Apps',
      link: '#project/cloud-assign',
      liveLink: null,
    },
    {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      title: 'Smart Queue Management System',
      category: 'Python & Firebase Backend',
      link: '#project/smart-queue',
      liveLink: null,
    },
    {
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
      title: 'Project Census — Android Data Collection App',
      category: 'Android Mobile App',
      link: '#project/project-census',
      liveLink: null,
    },
    {
      image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
      title: 'Library Management System',
      category: 'C++ OOP Console App',
      link: '#project/library-system',
      liveLink: null,
    }
  ];

  const N = projectList.length;
  // Clone original list to the front and back for seamless looping
  const clonedList = [...projectList, ...projectList, ...projectList];

  const [currentIndex, setCurrentIndex] = useState(N); // Start at the first item of middle list
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [dragOffset, setDragOffsetState] = useState(0);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeOffset, setActiveOffset] = useState(1);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const wasDraggedRef = useRef(false);

  const updateScrollAmount = () => {
    if (scrollRef.current && scrollRef.current.firstElementChild) {
      setScrollAmount(scrollRef.current.firstElementChild.clientWidth + 40); // card width + gap
    }
    // Determine which item is in the center viewport based on width
    if (window.innerWidth >= 1200) {
      setActiveOffset(1); // 3 items visible, center is index + 1
    } else {
      setActiveOffset(0); // 1 or 2 items visible, active is index
    }
  };

  useEffect(() => {
    updateScrollAmount();
    const timer = setTimeout(updateScrollAmount, 150);

    window.addEventListener('resize', updateScrollAmount);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateScrollAmount);
    };
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex >= 2 * N) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - N);
    } else if (currentIndex < N) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + N);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      if (scrollRef.current) {
        // Force reflow/repaint to register loop warp instantly
        scrollRef.current.offsetHeight;
      }
      setIsTransitioning(true);
    }
  }, [isTransitioning]);

  const setDragOffset = (val: number) => {
    dragOffsetRef.current = val;
    setDragOffsetState(val);
  };

  const handleStart = (clientX: number) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = clientX;
    wasDraggedRef.current = false;
    setDragOffset(0);
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const finalOffset = dragOffsetRef.current;
    const currentScrollAmount = scrollRef.current && scrollRef.current.firstElementChild
      ? scrollRef.current.firstElementChild.clientWidth + 40
      : 0;

    if (currentScrollAmount > 0) {
      const dragThreshold = currentScrollAmount * 0.15; // 15% card drag threshold
      if (finalOffset < -dragThreshold) {
        setCurrentIndex((prev) => prev + 1);
      } else if (finalOffset > dragThreshold) {
        setCurrentIndex((prev) => prev - 1);
      }
    }

    setDragOffset(0);
  };

  // Modern React pattern to handle mouse drag globally without memory leaks or stale closures
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current;
      setDragOffset(deltaX);
      if (Math.abs(deltaX) > 20) {
        wasDraggedRef.current = true;
      }
    };

    const handleMouseUp = () => {
      handleDragEnd();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    handleStart(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current;
    setDragOffset(deltaX);
    if (Math.abs(deltaX) > 20) {
      wasDraggedRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const handleScrollLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isTransitioning || currentIndex < N) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const handleScrollRight = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isTransitioning || currentIndex >= 2 * N) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (wasDraggedRef.current) return;
    const anchor = (e.currentTarget as HTMLAnchorElement);
    const href = anchor.getAttribute('href');
    if (href) {
      history.pushState(null, '', href);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  const translateVal = currentIndex * scrollAmount - dragOffset;
  const transitionStyle = (isTransitioning && !isDragging)
    ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    : 'none';

  return (
    <section id="project" className="ptf-portfolio-section">
      <div className="container-xxl">
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '100px' }}></div>
        {/* Heading */}
        <h2 
          className="large-heading has-secondary-font fw-normal text-center ptf-animated-block responsive-section-heading"
          data-aos="fade-up"
          style={{ userSelect: 'none', marginBottom: '60px' }}
        >
          My Latest Projects
        </h2>

        {/* Horizontal Project Slider Wrapper */}
        <div className="ptf-portfolio-slider-wrapper ptf-animated-block" data-aos="fade-up">
          {/* Left Side Navigation Button */}
          <button 
            className="ptf-slider-btn-side ptf-slider-btn-left" 
            onClick={handleScrollLeft} 
            aria-label="Previous Project"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Side Navigation Button */}
          <button 
            className="ptf-slider-btn-side ptf-slider-btn-right" 
            onClick={handleScrollRight} 
            aria-label="Next Project"
          >
            <ChevronRight size={22} />
          </button>

          <div className="ptf-portfolio-slider-container">
            <div 
              className="ptf-portfolio-slider-track" 
              ref={scrollRef}
              onTransitionEnd={handleTransitionEnd}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDragStart={(e) => e.preventDefault()}
              style={{ 
                transform: `translateX(-${translateVal}px)`,
                transition: transitionStyle,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
              }}
            >
              {clonedList.map((project, idx) => (
                <ProjectItem 
                  key={idx}
                  image={project.image}
                  title={project.title}
                  category={project.category}
                  link={project.link}
                  liveLink={project.liveLink}
                  onClick={handleItemClick}
                  isActive={idx === currentIndex + activeOffset}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="ptf-spacer" style={{ height: '100px' }}></div>
    </section>
  );
};

export default Projects;
