import React from 'react';

interface TimelineItemProps {
  year: string;
  title: string;
  institution: string;
  institutionLink?: string;
  description?: string;
  delay: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, institution, institutionLink, description, delay }) => {
  return (
    <div className="ptf-timeline ptf-animated-block" data-aos="fade-up" data-aos-delay={delay}>
      {/* Timeline Year */}
      <div className="ptf-timeline__year">{year}</div>
      
      {/* Timeline List */}
      <div className="ptf-timeline__list">
        <div className="ptf-timeline__item">
          <h4 className="ptf-timeline__title">{title}</h4>
          <span className="timeline-institution" style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--ptf-accent-1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {institutionLink ? (
              <a 
                href={institutionLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'inherit', textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.80'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {institution}
              </a>
            ) : (
              institution
            )}
          </span>
          {description && <p className="ptf-timeline__description">{description}</p>}
        </div>
      </div>
    </div>
  );
};

const Timeline: React.FC = () => {
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
              style={{ fontSize: '32px', marginBottom: '40px', fontWeight: 500, color: 'var(--ptf-black-color)', borderBottom: '1px solid var(--ptf-border-color)', paddingBottom: '15px' }}
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
              style={{ fontSize: '32px', marginBottom: '40px', fontWeight: 500, color: 'var(--ptf-black-color)', borderBottom: '1px solid var(--ptf-border-color)', paddingBottom: '15px' }}
            >
              Experience
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <TimelineItem 
                year="Apr 2026 - Jun 2026"
                title="AI/ML Intern"
                institution="Developer Hub (Online Internship)"
                institutionLink="https://developershubcorp.com/"
                description="Worked on ML model training and AI workflows using Python, Scikit-learn, Pandas & NumPy. Explored LangChain, RAG pipelines, NLP techniques, and TensorFlow."
                delay="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="ptf-spacer" style={{ height: '100px' }}></div>
    </section>
  );
};

export default Timeline;
