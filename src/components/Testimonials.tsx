import React, { useState, useRef, useEffect } from 'react';
import { Award, ExternalLink, Eye, X, ShieldCheck, FileText, Download, CheckCircle2 } from 'lucide-react';

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  companyUrl: string;
  certificateImage?: string;
  certificateTitle?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: 'all' | 'core' | 'ai-data' | 'foundations' | 'internships';
  categoryLabel: string;
  skills: string[];
  pdfUrl: string;
  verifyUrl?: string;
  credentialCode?: string;
  priority: number;
}

const certificatesData: CertificateItem[] = [
  // 0 Priority - Verified Internships & Experience Letters
  {
    id: 'intern-1',
    title: 'Virtual AI Internship — Completion Certificate',
    issuer: 'DecodeLabs',
    date: 'August 26, 2026',
    category: 'internships',
    categoryLabel: 'Internships & Experience',
    skills: ['Artificial Intelligence', 'Python Development', 'Clean Code', 'ML Solutions'],
    pdfUrl: '/internships/decodelabs/DecodeLabs Internship Certificate.pdf',
    credentialCode: 'AI086527',
    verifyUrl: 'https://www.decodelabs.tech/',
    priority: 0
  },
  {
    id: 'intern-2',
    title: 'AI Internship Official Offer Letter',
    issuer: 'Decode Labs Team',
    date: 'July 25, 2026',
    category: 'internships',
    categoryLabel: 'Internships & Experience',
    skills: ['AI Track', 'Hands-on Projects', 'Industry Mentorship'],
    pdfUrl: '/internships/decodelabs/Your Offer Letter _ Decode Labs.pdf',
    verifyUrl: 'https://www.decodelabs.tech/',
    priority: 0
  },
  {
    id: 'intern-3',
    title: 'AI/ML Engineering Internship — Completion Certificate',
    issuer: 'Developers Hub Corporation',
    date: 'June 22, 2026',
    category: 'internships',
    categoryLabel: 'Internships & Experience',
    skills: ['AI/ML Engineering', 'LangChain', 'RAG Pipelines', 'NLP Workflows'],
    pdfUrl: '/internships/developerhub/Completion Certificates-267.pdf',
    credentialCode: 'DHC-3562',
    verifyUrl: 'https://developershubcorp.com/',
    priority: 0
  },
  {
    id: 'intern-4',
    title: 'AI/ML Engineering Internship Offer Letter',
    issuer: 'Developers Hub Corporation',
    date: 'May 10, 2026',
    category: 'internships',
    categoryLabel: 'Internships & Experience',
    skills: ['Machine Learning', 'Python', 'Scikit-learn', 'NLP'],
    pdfUrl: '/internships/developerhub/DHC Interns Offer Letters 8-412.pdf',
    credentialCode: 'DHC-3562',
    verifyUrl: 'https://developershubcorp.com/',
    priority: 0
  },
  {
    id: 'intern-5',
    title: 'AI Engineering Internship Offer Letter',
    issuer: 'DEVFORGE Labs',
    date: 'July 6, 2026',
    category: 'internships',
    categoryLabel: 'Internships & Experience',
    skills: ['AI Engineering', 'FastAPI', 'ML APIs', 'Deployment'],
    pdfUrl: '/internships/devforge/OfferLetter_ABDUL SAMI UTHWAL.pdf',
    verifyUrl: 'https://devforgelabs.netlify.app/',
    priority: 0
  },

  // 1st Priority - Core Technical & Software Engineering
  {
    id: 'cert-1',
    title: 'Advanced Software Engineering Job Simulation',
    issuer: 'Walmart Global Tech (via Forage)',
    date: 'July 12, 2026',
    category: 'core',
    categoryLabel: 'Core Tech & Software Eng',
    skills: ['Advanced Data Structures', 'Software Architecture', 'Relational Database Design', 'Data Munging'],
    pdfUrl: '/certificates/Advanced Software Engineering Job_WALMART.pdf',
    credentialCode: '6a53e3e8d5a5d770098ed394',
    priority: 1
  },
  {
    id: 'cert-2',
    title: 'Microsoft Security Essentials: Concepts, Solutions, and AI-Powered Protection',
    issuer: 'Microsoft & LinkedIn Learning',
    date: 'July 13, 2026',
    category: 'core',
    categoryLabel: 'Core Tech & Software Eng',
    skills: ['Microsoft Security', 'Cloud Security', 'GRC', 'AI Protection'],
    pdfUrl: '/certificates/CertificateOfCompletion_Microsoft Security Essentials Concepts Solutions and AIPowered Protection.pdf',
    credentialCode: '1b6e37af04d7a027cc987800b0130595a06385abaf1376cd98fa7b080e33fcf3',
    priority: 2
  },
  {
    id: 'cert-3',
    title: 'Google AI Professional Certificate (7 Courses)',
    issuer: 'Google Career Certificates',
    date: 'August 1, 2026',
    category: 'core',
    categoryLabel: 'Core Tech & Software Eng',
    skills: ['AI Fundamentals', 'Research & Insights', 'Data Analysis', 'App Building', 'Vibe Coding'],
    pdfUrl: '/certificates/5cources_Google AI.pdf',
    verifyUrl: 'https://coursera.org/verify/professional-cert/TIW4DTZXOU6X',
    priority: 3
  },
  {
    id: 'cert-4',
    title: 'Software Engineering Job Simulation',
    issuer: 'Commonwealth Bank (via Forage)',
    date: 'July 13, 2026',
    category: 'core',
    categoryLabel: 'Core Tech & Software Eng',
    skills: ['.NET Backend', 'React / Redux Frontend', 'API Integration', 'Unit Testing', 'Git Workflows'],
    pdfUrl: '/certificates/SEJS.pdf',
    credentialCode: 'Pqikz5cMaM4TJXSHd',
    priority: 4
  },

  // 2nd Priority - Applied AI, ML & Data Science
  {
    id: 'cert-5',
    title: 'Google AI Essentials Specialization (5 Courses)',
    issuer: 'Google Career Certificates',
    date: 'July 31, 2026',
    category: 'ai-data',
    categoryLabel: 'AI, ML & Data Science',
    skills: ['Prompt Engineering', 'Responsible AI', 'Productivity Workflows', 'AI Strategy'],
    pdfUrl: '/certificates/5COURSES_Google AI Essentials.pdf',
    verifyUrl: 'https://coursera.org/verify/specialization/PJ128YOLIX1F',
    priority: 5
  },
  {
    id: 'cert-6',
    title: 'Foundations of Data Science',
    issuer: 'Google Career Certificates',
    date: 'July 16, 2026',
    category: 'ai-data',
    categoryLabel: 'AI, ML & Data Science',
    skills: ['Data Science', 'Python', 'Exploratory Data Analysis', 'Statistics'],
    pdfUrl: '/certificates/Foundation of DataScience.pdf',
    verifyUrl: 'https://coursera.org/verify/JSL5ZSALHOZN',
    priority: 6
  },
  {
    id: 'cert-7',
    title: 'Natural Language Processing (NLP) & Text Mining',
    issuer: 'Simplilearn SkillUp',
    date: 'July 13, 2026',
    category: 'ai-data',
    categoryLabel: 'AI, ML & Data Science',
    skills: ['NLP', 'Text Mining', 'Tokenization', 'Sentiment Analysis'],
    pdfUrl: '/certificates/NLP_certificate.pdf',
    credentialCode: '10463986',
    priority: 7
  },
  {
    id: 'cert-8',
    title: 'The Nuts and Bolts of Machine Learning',
    issuer: 'Google Career Certificates',
    date: 'July 17, 2026',
    category: 'ai-data',
    categoryLabel: 'AI, ML & Data Science',
    skills: ['ML Pipeline', 'Model Evaluation', 'Feature Engineering', 'Supervised Learning'],
    pdfUrl: '/certificates/Nut Bolts of Machine Learning.pdf',
    verifyUrl: 'https://coursera.org/verify/REXD4CUL4K8M',
    priority: 8
  },
  {
    id: 'cert-9',
    title: 'Introduction to Machine Learning with R',
    issuer: 'Simplilearn SkillUp',
    date: 'July 13, 2026',
    category: 'ai-data',
    categoryLabel: 'AI, ML & Data Science',
    skills: ['Machine Learning', 'R Programming', 'Predictive Modeling', 'Data Visualization'],
    pdfUrl: '/certificates/ML.pdf',
    credentialCode: '10465396',
    priority: 9
  },

  // 3rd Priority - Foundations & Innovative Certifications
  {
    id: 'cert-10',
    title: 'Crash Course on Python',
    issuer: 'Google Career Certificates',
    date: 'July 17, 2026',
    category: 'foundations',
    categoryLabel: 'Foundations & Education',
    skills: ['Python Automation', 'OOP', 'Data Structures'],
    pdfUrl: '/certificates/Crash python course.pdf',
    verifyUrl: 'https://coursera.org/verify/LHTOOXVCVIJ9',
    priority: 10
  },
  {
    id: 'cert-11',
    title: 'Gemini Certified Student (K12 / Education)',
    issuer: 'Google for Education',
    date: 'July 17, 2026',
    category: 'foundations',
    categoryLabel: 'Foundations & Education',
    skills: ['Google AI in Education', 'Prompt Engineering', 'Gemini Competencies'],
    pdfUrl: '/certificates/Google Gemini for Education.pdf',
    priority: 11
  },
  {
    id: 'cert-12',
    title: 'Hello, Python!',
    issuer: 'Google Career Certificates',
    date: 'July 23, 2026',
    category: 'foundations',
    categoryLabel: 'Foundations & Education',
    skills: ['Python Syntax', 'Control Flow', 'Data Types'],
    pdfUrl: '/certificates/Hello Python!.pdf',
    verifyUrl: 'https://coursera.org/verify/TK7ZUX71JCJ0',
    priority: 12
  }
];

const Testimonials: React.FC = () => {
  const testimonials: TestimonialItem[] = [
    {
      quote: "“Awarded Certificate of Participation for active participation in the national-level event 'INNOVATIVE PAKISTAN 2026' (THINK. BUILD. LEAD.), collaborating with IEEE, HEC, and leading academic institutions to showcase innovative solutions.”",
      author: "Innovative Pakistan 2026",
      role: "Organized by ",
      company: "IEEE, HEC & Partners",
      companyUrl: "#",
      certificateImage: '/certificates/INNOVATIVE_PAKISTAN_CERTI.png',
      certificateTitle: 'Innovative Pakistan 2026 — Certificate of Participation'
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
  // Clone original list for seamless infinite loop (3x buffer)
  const clonedList = [...testimonials, ...testimonials, ...testimonials];
  const totalClones = clonedList.length;

  const [currentIndex, setCurrentIndex] = useState(N); // Start at index 3 (middle buffer)
  const [dragOffset, setDragOffsetState] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Certificates Filter & Modal state
  const [activeCategory, setActiveCategory] = useState<'all' | 'internships' | 'core' | 'ai-data' | 'foundations'>('all');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  // Testimonial certificate image modal state
  const [testimonialCertImage, setTestimonialCertImage] = useState<{ url: string; title: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef(0);
  const dragStartYRef = useRef(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const dragOffsetRef = useRef(0);
  const wheelActiveRef = useRef(false);
  const wheelEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setDragOffset = (val: number) => {
    dragOffsetRef.current = val;
    setDragOffsetState(val);
  };

  // Handle Drag / Touch Start
  const handleStart = (clientX: number, clientY?: number) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    setIsTransitioning(false);
    dragStartRef.current = clientX;
    if (clientY !== undefined) {
      dragStartYRef.current = clientY;
      isHorizontalSwipeRef.current = null;
    }
    setDragOffset(0);
  };

  // Handle Touch Move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    const deltaX = clientX - dragStartRef.current;
    const deltaY = clientY - dragStartYRef.current;

    // Detect gesture direction on initial movement
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    // Vertical gesture: release drag immediately to allow natural vertical page scrolling
    if (isHorizontalSwipeRef.current === false) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    // Horizontal gesture: follow user drag exactly 1:1
    if (isHorizontalSwipeRef.current === true) {
      setDragOffset(deltaX);
    }
  };

  // Handle End (Touch / Mouse Up)
  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const offset = dragOffsetRef.current;
    const containerWidth = containerRef.current?.offsetWidth || 800;
    const threshold = Math.max(containerWidth * 0.12, 50); // 12% or 50px drag threshold

    if (offset < -threshold) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    } else if (offset > threshold) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    } else {
      setIsTransitioning(true);
    }

    setDragOffset(0);
    isHorizontalSwipeRef.current = null;
  };

  // Attach non-passive wheel listener: gesture-locked (1 swipe = strictly 1 slide, inertia absorbed)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      // If vertical is dominant or no horizontal movement, let page scroll naturally
      if (absX <= absY || absX < 25) return;

      // Horizontal trackpad gesture -> prevent browser back/forward history navigation
      e.preventDefault();

      // Reset the silence detector timer on every event in the current swipe stream
      if (wheelEndTimerRef.current) {
        clearTimeout(wheelEndTimerRef.current);
      }

      // Unlock only when trackpad inertia completely dies down (280ms silence)
      wheelEndTimerRef.current = setTimeout(() => {
        wheelActiveRef.current = false;
      }, 280);

      // If this swipe gesture already triggered a slide, absorb remaining inertia ticks!
      if (wheelActiveRef.current) return;

      // FIRST event of the gesture -> trigger exactly ONE slide transition with calm pacing!
      wheelActiveRef.current = true;
      setIsTransitioning(true);
      if (e.deltaX > 0) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      if (wheelEndTimerRef.current) {
        clearTimeout(wheelEndTimerRef.current);
      }
    };
  }, []);

  // Seamless jump on transition end
  const handleTransitionEnd = (e?: React.TransitionEvent) => {
    if (e && e.target !== trackRef.current) return;

    if (currentIndex >= 2 * N) {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        const newIndex = currentIndex - N;
        trackRef.current.style.transform = `translateX(-${(newIndex * 100) / totalClones}%)`;
        void trackRef.current.offsetHeight;
      }
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - N);
    } else if (currentIndex < N) {
      if (trackRef.current) {
        trackRef.current.style.transition = 'none';
        const newIndex = currentIndex + N;
        trackRef.current.style.transform = `translateX(-${(newIndex * 100) / totalClones}%)`;
        void trackRef.current.offsetHeight;
      }
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + N);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      if (trackRef.current) {
        trackRef.current.offsetHeight;
      }
      setIsTransitioning(true);
    }
  }, [isTransitioning]);

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current;
      setDragOffset(deltaX);
    };
    const onMouseUp = () => handleDragEnd();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  // Lock background page scroll when Certificate Modal is active
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCert]);

  // Filtered certificates
  const filteredCertificates = activeCategory === 'all'
    ? certificatesData
    : certificatesData.filter(c => c.category === activeCategory);

  const activeDotIndex = ((currentIndex % N) + N) % N;
  const transitionStyle = isTransitioning && !isDragging
    ? 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)'
    : 'none';

  return (
    <section id="testimonials" className="ptf-testimonials-section" style={{ backgroundColor: 'var(--ptf-white-color)' }}>
      <div className="container-xxl">
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '140px' }}></div>

        {/* Testimonial Slider Container */}
        <div
          ref={containerRef}
          className="ptf-testimonials-slider"
          onMouseDown={(e) => {
            if ((e.target as HTMLElement).closest('button, a, .ptf-view-cert-btn')) return;
            e.preventDefault();
            handleStart(e.clientX);
          }}
          onTouchStart={(e) => {
            if (e.touches.length !== 1) return;
            if ((e.target as HTMLElement).closest('button, a, .ptf-view-cert-btn')) return;
            handleStart(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => {
            isHorizontalSwipeRef.current = null;
            handleDragEnd();
          }}
          style={{
            overflow: 'hidden',
            width: '100%',
            cursor: 'default',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'pan-y',
          }}
        >
          <div
            ref={trackRef}
            className="ptf-testimonials-track"
            onTransitionEnd={handleTransitionEnd}
            style={{
              display: 'flex',
              width: `${totalClones * 100}%`,
              transform: `translateX(calc(-${(currentIndex * 100) / totalClones}% + ${dragOffset}px))`,
              transition: transitionStyle,
            }}
          >
            {clonedList.map((t, idx) => (
              <div
                key={idx}
                style={{ width: `${100 / totalClones}%`, padding: '0 15px', textAlign: 'center', flexShrink: 0 }}
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

                {/* View Certificate Button — only for slides that have a certificate */}
                {t.certificateImage && (
                  <div style={{ marginTop: '28px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTestimonialCertImage({ url: t.certificateImage!, title: t.certificateTitle || t.author });
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--ptf-white-color)',
                        backgroundColor: 'var(--ptf-black-color)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 22px',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        fontFamily: 'var(--ptf-font-sans)',
                      }}
                      className="ptf-view-cert-btn"
                    >
                      <Eye size={15} />
                      <span>Click to View Certificate</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Style Dots Pagination */}
        <div className="ptf-testimonials-dots ptf-animated-block" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`ptf-pagination-dot ${activeDotIndex === i ? 'active' : ''}`}
              onClick={() => {
                setIsTransitioning(true);
                setDragOffset(0);
                setCurrentIndex(N + i);
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* ==========================================
            VERIFIED CERTIFICATIONS & CREDENTIALS SHOWCASE
           ========================================== */}
        <div id="certifications" className="ptf-spacer" style={{ height: '140px' }}></div>
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '80px' }}></div>

        {/* Section Heading */}
        <div className="text-center ptf-animated-block" data-aos="fade-up">
          <span className="fz-14 text-uppercase has-3-color tracking-widest block" style={{ marginBottom: '15px', color: 'var(--ptf-accent-1)' }}>
            <ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
            Verified Credentials
          </span>
          <h2 className="large-heading has-secondary-font fw-normal text-center responsive-section-heading" style={{ marginBottom: '20px' }}>
            Certifications & Technical Specializations
          </h2>
          <p className="has-3-color" style={{ fontSize: '18px', maxWidth: '680px', margin: '0 auto 50px auto', lineHeight: '1.6' }}>
            Industry-recognized credentials in Software Architecture, Artificial Intelligence, Security, Data Science, and Full-Stack Engineering.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="ptf-showcase-tabs ptf-animated-block" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '50px' }}>
          <button
            className={`ptf-tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Credentials ({certificatesData.length})
          </button>
          <button
            className={`ptf-tab-btn ${activeCategory === 'internships' ? 'active' : ''}`}
            onClick={() => setActiveCategory('internships')}
          >
            Internships & Experience (5)
          </button>
          <button
            className={`ptf-tab-btn ${activeCategory === 'core' ? 'active' : ''}`}
            onClick={() => setActiveCategory('core')}
          >
            Core Tech & Software Eng (4)
          </button>
          <button
            className={`ptf-tab-btn ${activeCategory === 'ai-data' ? 'active' : ''}`}
            onClick={() => setActiveCategory('ai-data')}
          >
            AI, ML & Data Science (5)
          </button>
          <button
            className={`ptf-tab-btn ${activeCategory === 'foundations' ? 'active' : ''}`}
            onClick={() => setActiveCategory('foundations')}
          >
            Foundations & Education (3)
          </button>
        </div>

        {/* Certificates Grid */}
        <div className="row g-4" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredCertificates.map((cert) => (
            <div key={cert.id} className="col-12 col-md-6 col-lg-4 ptf-animated-block" data-aos="fade-up">
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--ptf-border-color)',
                  borderRadius: '16px',
                  padding: '28px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="ptf-cert-card"
              >
                <div>
                  {/* Top Badge & Issuer Flex Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--ptf-black-color)',
                        flexShrink: 0
                      }}>
                        <Award size={22} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#888888', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cert.issuer}
                        </span>
                        <span style={{ fontSize: '12px', color: '#999999' }}>{cert.date}</span>
                      </div>
                    </div>

                    {cert.priority <= 4 && (
                      <div style={{
                        backgroundColor: 'rgba(250, 69, 41, 0.1)',
                        color: 'var(--ptf-accent-1)',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        letterSpacing: '0.5px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}>
                        TOP SPECIALIZATION
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ptf-black-color)', lineHeight: '1.4', marginBottom: '16px' }}>
                    {cert.title}
                  </h3>

                  {/* Skills Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                    {cert.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        style={{
                          fontSize: '12px',
                          backgroundColor: '#f5f5f7',
                          color: '#444444',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 500
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ paddingTop: '16px', borderTop: '1px solid #f0f0f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <button
                    onClick={() => setSelectedCert(cert)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--ptf-white-color)',
                      backgroundColor: 'var(--ptf-black-color)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    className="ptf-view-cert-btn"
                  >
                    <Eye size={14} />
                    <span>Click to View Certificate</span>
                  </button>

                  {cert.verifyUrl && (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        color: 'var(--ptf-accent-1)',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                      title="Verify Credential Online"
                    >
                      <span>Verify</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==========================================
          HIGH-RES CERTIFICATE PDF LIGHTBOX MODAL
         ========================================== */}
      {/* ==========================================
          TESTIMONIAL CERTIFICATE IMAGE LIGHTBOX
         ========================================== */}
      {testimonialCertImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setTestimonialCertImage(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '900px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--ptf-border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fafafa',
              flexShrink: 0
            }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ptf-accent-1)', fontWeight: 700, display: 'block' }}>
                  Certificate of Participation
                </span>
                <h4 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--ptf-black-color)', margin: '2px 0 0 0' }}>
                  {testimonialCertImage.title}
                </h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <a
                  href={testimonialCertImage.url}
                  download
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--ptf-black-color)',
                    backgroundColor: '#eeeeee',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setTestimonialCertImage(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid #ddd',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#333'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Certificate Image */}
            <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#525659', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <img
                src={testimonialCertImage.url}
                alt={testimonialCertImage.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {selectedCert && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedCert(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '900px',
              height: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--ptf-border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fafafa'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ptf-accent-1)', fontWeight: 700, display: 'block' }}>
                    {selectedCert.issuer} — {selectedCert.date}
                  </span>
                  {selectedCert.credentialCode && (
                    <span
                      style={{
                        fontSize: '11px',
                        backgroundColor: '#e2e8f0',
                        color: 'var(--ptf-black-color)',
                        padding: '1px 7px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        letterSpacing: '0.5px'
                      }}
                    >
                      ID: {selectedCert.credentialCode}
                    </span>
                  )}
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--ptf-black-color)', margin: '4px 0 0 0' }}>
                  {selectedCert.title}
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {selectedCert.verifyUrl && (
                  <a
                    href={selectedCert.verifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#ffffff',
                      backgroundColor: 'var(--ptf-accent-1)',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.90')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <CheckCircle2 size={14} />
                    <span>Verify</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                <a
                  href={selectedCert.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--ptf-black-color)',
                    backgroundColor: '#eeeeee',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                  download
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={() => setSelectedCert(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid #ddd',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#333'
                  }}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: PDF Viewer */}
            <div style={{ flex: 1, width: '100%', backgroundColor: '#525659', position: 'relative' }}>
              <object
                data={selectedCert.pdfUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ width: '100%', height: '100%', border: 'none' }}
              >
                <div style={{ padding: '40px', textAlign: 'center', color: '#ffffff' }}>
                  <FileText size={48} style={{ marginBottom: '16px' }} />
                  <p style={{ fontSize: '18px', fontWeight: 600 }}>Viewing {selectedCert.title}</p>
                  <p style={{ fontSize: '14px', color: '#cccccc', marginBottom: '24px' }}>Your browser can render this PDF directly or you can open it below.</p>
                  <a
                    href={selectedCert.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'var(--ptf-accent-1)',
                      color: '#ffffff',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    Open Certificate PDF
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="ptf-spacer" style={{ height: '140px' }}></div>
    </section>
  );
};

export default Testimonials;
