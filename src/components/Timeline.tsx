import React, { useState, useEffect } from 'react';
import { FileText, Award, ShieldCheck, Download, ExternalLink, X, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineDoc {
  type: 'offer' | 'certificate';
  label: string;
  pdfUrl: string;
  credentialId?: string;
  verifyUrl?: string;
  issueDate?: string;
}

interface TimelineItemProps {
  year: string;
  title: string;
  institution: string;
  institutionLink?: string;
  description?: string;
  delay: string;
  documents?: TimelineDoc[];
  onOpenDoc?: (doc: TimelineDoc, institution: string, role: string) => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  year,
  title,
  institution,
  institutionLink,
  description,
  delay,
  documents,
  onOpenDoc,
}) => {
  return (
    <div className="ptf-timeline ptf-animated-block" data-aos="fade-up" data-aos-delay={delay}>
      {/* Timeline Year */}
      <div className="ptf-timeline__year">{year}</div>

      {/* Timeline List */}
      <div className="ptf-timeline__list">
        <div className="ptf-timeline__item">
          <h4 className="ptf-timeline__title">{title}</h4>
          <span
            className="timeline-institution"
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--ptf-accent-1)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {institutionLink ? (
              <a
                href={institutionLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.80')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {institution}
              </a>
            ) : (
              institution
            )}
          </span>
          {description && <p className="ptf-timeline__description">{description}</p>}

          {/* Interactive Document Badges & Verification Buttons */}
          {documents && documents.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px dashed #e2e8f0',
              }}
            >
              {documents.map((doc, idx) => {
                const isOffer = doc.type === 'offer';
                return (
                  <button
                    key={idx}
                    onClick={() => onOpenDoc && onOpenDoc(doc, institution, title)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: isOffer ? 'var(--ptf-black-color)' : '#ffffff',
                      backgroundColor: isOffer ? '#f1f5f9' : 'var(--ptf-black-color)',
                      border: isOffer ? '1px solid #cbd5e1' : 'none',
                      borderRadius: '6px',
                      padding: '7px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'var(--ptf-font-sans)',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      if (isOffer) {
                        e.currentTarget.style.borderColor = 'var(--ptf-accent-1)';
                        e.currentTarget.style.color = 'var(--ptf-accent-1)';
                      } else {
                        e.currentTarget.style.backgroundColor = 'var(--ptf-accent-1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      if (isOffer) {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.color = 'var(--ptf-black-color)';
                      } else {
                        e.currentTarget.style.backgroundColor = 'var(--ptf-black-color)';
                      }
                    }}
                  >
                    {doc.label.includes('Certificate') ? (
                      <Award size={14} color="#fa4529" />
                    ) : (
                      <FileText size={14} color={isOffer ? undefined : '#fa4529'} />
                    )}
                    <span>{doc.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ActiveModalDoc {
  doc: TimelineDoc;
  company: string;
  role: string;
}

const Timeline: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<ActiveModalDoc | null>(null);

  // Lock background portfolio scrolling when document modal is open
  useEffect(() => {
    if (activeDoc) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [activeDoc]);

  // DecodeLabs documents
  const decodelabsDocs: TimelineDoc[] = [
    {
      type: 'offer',
      label: 'Offer Letter',
      pdfUrl: '/internships/decodelabs/Your Offer Letter _ Decode Labs.pdf',
      issueDate: 'July 25, 2026',
      verifyUrl: 'https://www.decodelabs.tech/verification',
    },
    {
      type: 'certificate',
      label: 'Completion Certificate',
      pdfUrl: '/internships/decodelabs/DecodeLabs Internship Certificate.pdf',
      credentialId: 'AI086527',
      issueDate: 'August 26, 2026',
      verifyUrl: 'https://www.decodelabs.tech/verification',
    },
  ];

  // DEVFORGE documents
  const devforgeDocs: TimelineDoc[] = [
    {
      type: 'offer',
      label: 'Offer Letter',
      pdfUrl: '/internships/devforge/OfferLetter_ABDUL SAMI UTHWAL.pdf',
      issueDate: 'July 6, 2026',
      verifyUrl: 'https://devforge-internship-portal.vercel.app/verify',
    },
    {
      type: 'certificate',
      label: 'Completion Letter',
      pdfUrl: '/internships/devforge/abdul-sami-uthwal-DFL-INT-2026-1360.pdf',
      credentialId: 'DFL-INT-2026-1360',
      issueDate: 'August 31, 2026',
      verifyUrl: 'https://devforge-internship-portal.vercel.app/verify',
    },
    {
      type: 'certificate',
      label: 'Completion Certificate',
      pdfUrl: '/internships/devforge/abdul-sami-uthwal-DFL-INT-2026-1360-certificate.pdf',
      credentialId: 'DFL-INT-2026-1360',
      issueDate: 'August 31, 2026',
      verifyUrl: 'https://devforge-internship-portal.vercel.app/verify',
    },
  ];

  // Developer Hub documents
  const developerHubDocs: TimelineDoc[] = [
    {
      type: 'offer',
      label: 'Offer Letter',
      pdfUrl: '/internships/developerhub/DHC Interns Offer Letters 8-412.pdf',
      credentialId: 'DHC-3562',
      issueDate: 'May 10, 2026',
      verifyUrl: 'https://developershubcorp.com/',
    },
    {
      type: 'certificate',
      label: 'Completion Certificate',
      pdfUrl: '/internships/developerhub/Completion Certificates-267.pdf',
      credentialId: 'DHC-3562',
      issueDate: 'June 22, 2026',
      verifyUrl: 'https://developershubcorp.com/',
    },
  ];

  const handleOpenDoc = (doc: TimelineDoc, company: string, role: string) => {
    setActiveDoc({ doc, company, role });
  };

  // Structured Experience items data (scalable & easy to maintain)
  interface ExperienceItemData {
    id: string;
    year: string;
    title: string;
    institution: string;
    institutionLink?: string;
    description: string;
    delay: string;
    documents: TimelineDoc[];
  }

  const experiencesData: ExperienceItemData[] = [
    {
      id: 'devforge',
      year: 'Jul 2026 - Sep 2026',
      title: 'AI Engineering Internship',
      institution: 'DEVFORGE (AI Innovation Track)',
      institutionLink: 'https://devforgelabs.netlify.app/',
      description: 'Worked on autonomous AI agents, RAG pipelines, and machine learning workflows using Python, Scikit-learn, and FastAPI. Architected production-ready stateful agents and semantic search systems using LangGraph, FAISS, and Gemini LLMs, integrating tool automation and cloud deployments.',
      delay: '0',
      documents: devforgeDocs,
    },
    {
      id: 'decodelabs',
      year: 'Jul 2026 - Aug 2026',
      title: 'Internship — Artificial Intelligence (AI)',
      institution: 'DecodeLabs (Virtual Program)',
      institutionLink: 'https://www.decodelabs.tech/',
      description: 'Completed hands-on projects and collaborative tasks in Artificial Intelligence (AI) and Python application development, focusing on clean code, modular problem-solving, NLP, rule-based systems, and Git version control.',
      delay: '100',
      documents: decodelabsDocs,
    },
    {
      id: 'developerhub',
      year: 'Apr 2026 - Jun 2026',
      title: 'AI/ML Intern',
      institution: 'Developers Hub (Engineering Cohort)',
      institutionLink: 'https://developershubcorp.com/',
      description: 'Worked on machine learning model development and AI workflows using Python, Scikit-learn, Pandas & NumPy. Built LLM-powered applications with LangChain and RAG pipelines, applied NLP techniques, and explored TensorFlow to improve model performance.',
      delay: '200',
      documents: developerHubDocs,
    },
  ];

  // Configurable threshold: number of experiences displayed before collapse
  const INITIAL_VISIBLE_COUNT = 2;
  const [isExpanded, setIsExpanded] = useState(false);
  const initialExperiences = experiencesData.slice(0, INITIAL_VISIBLE_COUNT);
  const extraExperiences = experiencesData.slice(INITIAL_VISIBLE_COUNT);
  const hasMore = experiencesData.length > INITIAL_VISIBLE_COUNT;
  const hiddenCount = experiencesData.length - INITIAL_VISIBLE_COUNT;

  return (
    <section id="timeline" className="ptf-timeline-section">
      <div className="container-xxl">
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '100px' }}></div>
        {/* Title */}
        <h2
          className="large-heading has-secondary-font fw-normal text-center ptf-animated-block responsive-section-heading"
          data-aos="fade-up"
        >
          Education & Experience
        </h2>

        <div className="row">
          {/* Column 1: Education */}
          <div className="col-12 col-md-6" style={{ marginBottom: '50px', textAlign: 'left' }}>
            <h3
              className="serif-font ptf-animated-block"
              data-aos="fade-up"
              style={{
                fontSize: '32px',
                marginBottom: '40px',
                fontWeight: 500,
                color: 'var(--ptf-black-color)',
                borderBottom: '1px solid var(--ptf-border-color)',
                paddingBottom: '15px',
              }}
            >
              Education
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <TimelineItem
                year="Sep 2022 - Jun 2026"
                title="Bachelor of Software Engineering (BSSE)"
                institution="The University of Faisalabad (TUF)"
                institutionLink="https://tuf.edu.pk/"
                description="Coursework: OOP, Data Structures, Database Systems, Web Engineering, App Development, Machine Learning, AI Fundamentals, Computer Vision, NLP, Software Reengineering, Testing & QA."
                delay="0"
              />
              <TimelineItem
                year="Jan 2020 - Jan 2022"
                title="Intermediate — Pre-Engineering"
                institution="Chenab College, Jhang"
                institutionLink="https://chenab.edu.pk/"
                delay="100"
              />
              <TimelineItem
                year="Jan 2018 - Jan 2020"
                title="Matriculation — Science Group"
                institution="Ghazali Public High School, Jhang"
                delay="200"
              />
            </div>
          </div>

          {/* Column 2: Experience */}
          <div className="col-12 col-md-6" style={{ marginBottom: '50px', textAlign: 'left' }}>
            <h3
              className="serif-font ptf-animated-block"
              data-aos="fade-up"
              style={{
                fontSize: '32px',
                marginBottom: '40px',
                fontWeight: 500,
                color: 'var(--ptf-black-color)',
                borderBottom: '1px solid var(--ptf-border-color)',
                paddingBottom: '15px',
              }}
            >
              Experience & Internships
            </h3>
            <div id="timeline-experience-list" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Top/Latest Experiences (Always Visible) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {initialExperiences.map((exp) => (
                  <div key={exp.id}>
                    <TimelineItem
                      year={exp.year}
                      title={exp.title}
                      institution={exp.institution}
                      institutionLink={exp.institutionLink}
                      description={exp.description}
                      delay={exp.delay}
                      documents={exp.documents}
                      onOpenDoc={handleOpenDoc}
                    />
                  </div>
                ))}
              </div>

              {/* Accordion Scroll Open / Hide Drawer for Older Experiences (Zero Jerk) */}
              {hasMore && (
                <div
                  id="timeline-experience-drawer"
                  className={`timeline-experience-drawer ${isExpanded ? 'is-open' : ''}`}
                  aria-hidden={!isExpanded}
                >
                  <div className="timeline-experience-drawer__inner">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingTop: '40px' }}>
                      {extraExperiences.map((exp) => (
                        <div key={exp.id}>
                          <TimelineItem
                            year={exp.year}
                            title={exp.title}
                            institution={exp.institution}
                            institutionLink={exp.institutionLink}
                            description={exp.description}
                            delay="0"
                            documents={exp.documents}
                            onOpenDoc={handleOpenDoc}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* View More / Show Less Toggle Button with Liquid Water Fill Effect */}
              {hasMore && (
                <div
                  className="ptf-animated-block"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  style={{ textAlign: 'center', marginTop: '40px' }}
                >
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-controls="timeline-experience-drawer"
                    className="ptf-liquid-btn"
                  >
                    <i className="ptf-liquid-wave" aria-hidden="true" />
                    <span className="ptf-liquid-btn__content">
                      <span>
                        {isExpanded
                          ? 'Show Less'
                          : `View More Experience (${hiddenCount} ${hiddenCount === 1 ? 'more' : 'more'})`}
                      </span>
                      <span className="ptf-liquid-btn__icon">
                        {isExpanded ? (
                          <ChevronUp size={15} />
                        ) : (
                          <ChevronDown size={15} />
                        )}
                      </span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          INTERNSHIP DOCUMENT PREVIEW LIGHTBOX MODAL
         ========================================== */}
      {activeDoc && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            touchAction: 'none',
            overscrollBehavior: 'contain',
          }}
          onClick={() => setActiveDoc(null)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '920px',
              height: '92vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              animation: 'geminiFadeIn 0.25s ease-out forwards',
              touchAction: 'auto',
              overscrollBehavior: 'contain',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 22px',
                borderBottom: '1px solid var(--ptf-border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fafafa',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: activeDoc.doc.type === 'offer' ? '#0284c7' : 'var(--ptf-accent-1)',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <ShieldCheck size={13} />
                    {activeDoc.doc.type === 'offer' ? 'Official Offer Letter' : activeDoc.doc.label.includes('Letter') ? 'Official Completion Letter' : 'Verified Internship Certificate'}
                  </span>
                  {activeDoc.doc.credentialId && (
                    <span
                      style={{
                        fontSize: '11px',
                        backgroundColor: '#e2e8f0',
                        color: 'var(--ptf-black-color)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                      }}
                    >
                      Credential ID: {activeDoc.doc.credentialId}
                    </span>
                  )}
                </div>
                <h4
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--ptf-black-color)',
                    margin: '4px 0 0 0',
                    fontFamily: 'var(--ptf-font-sans)',
                  }}
                >
                  {activeDoc.role} — {activeDoc.company}
                </h4>
                {activeDoc.doc.issueDate && (
                  <span style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    Issue Date: {activeDoc.doc.issueDate}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {activeDoc.doc.verifyUrl && (
                  <a
                    href={activeDoc.doc.verifyUrl}
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
                      padding: '8px 16px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.90')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <CheckCircle2 size={14} />
                    <span>Verify Credential</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                <a
                  href={activeDoc.doc.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--ptf-black-color)',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                >
                  <Download size={14} />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setActiveDoc(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#333',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: PDF Viewer */}
            <div style={{ flex: 1, backgroundColor: '#525659', position: 'relative', overflow: 'hidden' }}>
              <iframe
                src={`${activeDoc.doc.pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                title={`${activeDoc.role} - ${activeDoc.doc.label}`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="ptf-spacer" style={{ height: '100px' }}></div>
    </section>
  );
};

export default Timeline;

