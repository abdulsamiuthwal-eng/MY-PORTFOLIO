import React, { useState, useRef, useEffect } from 'react';
import { Award, ExternalLink, Eye, X, ShieldCheck, FileText, Download } from 'lucide-react';

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  companyUrl: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: 'all' | 'core' | 'ai-data' | 'foundations';
  categoryLabel: string;
  skills: string[];
  pdfUrl: string;
  verifyUrl?: string;
  credentialCode?: string;
  priority: number;
}

const certificatesData: CertificateItem[] = [
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

  // Certificates Filter & Modal state
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'ai-data' | 'foundations'>('all');
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

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

    wheelAccumulatorRef.current += e.deltaX;
    const containerWidth = containerRef.current?.offsetWidth || 1000;

    setIsAnimating(false);
    setDragOffset(-wheelAccumulatorRef.current);

    if (wheelSnapTimeoutRef.current) {
      clearTimeout(wheelSnapTimeoutRef.current);
    }

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

  // Filtered certificates
  const filteredCertificates = activeCategory === 'all'
    ? certificatesData
    : certificatesData.filter(c => c.category === activeCategory);

  return (
    <section id="testimonials" className="ptf-testimonials-section" style={{ backgroundColor: 'var(--ptf-white-color)' }}>
      <div className="container-xxl">
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '140px' }}></div>

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
        <div className="ptf-testimonials-dots ptf-animated-block" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
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

        {/* ==========================================
            VERIFIED CERTIFICATIONS & CREDENTIALS SHOWCASE
           ========================================== */}
        <div className="ptf-spacer" style={{ height: '140px' }}></div>
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '80px' }}></div>

        {/* Section Heading */}
        <div className="text-center ptf-animated-block" data-aos="fade-up">
          <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--ptf-accent-1)', fontWeight: 700 }}>
            <ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-3px' }} />
            Verified Credentials
          </span>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 400, color: 'var(--ptf-black-color)', marginTop: '10px', marginBottom: '15px' }}>
            Certifications & Technical Specializations
          </h2>
          <p style={{ fontSize: '16px', color: '#666666', maxWidth: '680px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
            Industry-recognized credentials in Software Architecture, Artificial Intelligence, Security, Data Science, and Full-Stack Engineering.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="ptf-showcase-tabs ptf-animated-block" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '50px' }}>
          <button
            className={`ptf-tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Certifications ({certificatesData.length})
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
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ptf-accent-1)', fontWeight: 700, display: 'block' }}>
                  {selectedCert.issuer} — {selectedCert.date}
                </span>
                <h4 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--ptf-black-color)', margin: '2px 0 0 0' }}>
                  {selectedCert.title}
                </h4>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
