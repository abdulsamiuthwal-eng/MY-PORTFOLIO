import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="ptf-hero-section" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container-xxl">
        <div className="row">
          <div className="col-12 col-xl-10 offset-xl-1">
            {/* Spacer to push content down slightly below navbar */}
            <div className="ptf-spacer" style={{ height: '80px' }}></div>
            
            {/* Main Serif Heading */}
            <div className="ptf-hero-title-container text-center">
              <h1 
                className="ptf-hero-title large-heading serif-font fw-normal ptf-animated-block"
                data-text="Abdul Sami Uthwal"
                data-aos="fade-up"
                data-aos-delay="300"
                style={{ 
                  fontSize: 'clamp(38px, 6.5vw, 80px)', 
                  lineHeight: '1.2', 
                  letterSpacing: '-0.01em'
                }}
              >
                Abdul Sami Uthwal
              </h1>
            </div>
            
            {/* Sub-heading: Role */}
            <div className="ptf-hero-role-container text-center" style={{ marginTop: '15px' }}>
              <div 
                className="ptf-hero-role ptf-animated-block serif-font"
                data-text="AI/ML Engineer & Full-Stack Developer"
                data-aos="fade-up"
                data-aos-delay="400"
                style={{
                  fontSize: 'clamp(20px, 3vw, 32px)',
                  lineHeight: '1.4'
                }}
              >
                AI/ML Engineer & Full-Stack Developer
              </div>
            </div>

            {/* Location */}
            <div className="ptf-hero-location-container text-center" style={{ marginTop: '8px' }}>
              <div 
                className="ptf-hero-location ptf-animated-block serif-font"
                data-aos="fade-up"
                data-aos-delay="450"
                style={{ 
                  fontSize: 'clamp(16px, 2vw, 22px)', 
                  fontWeight: 'normal',
                  display: 'inline-block'
                }}
              >
                Operating globally from Pakistan
              </div>
            </div>

            {/* Description / Bio */}
            <p 
              className="ptf-hero-tagline text-center ptf-animated-block serif-font mx-auto"
              data-aos="fade-up"
              data-aos-delay="500"
              style={{
                fontSize: 'clamp(16px, 1.8vw, 22px)',
                lineHeight: '1.6',
                maxWidth: '800px',
                marginTop: '30px',
                fontWeight: 300
              }}
            >
              "Building production-ready ML systems & intelligent web applications — from model training and fine-tuning to full-stack deployment. Specializing in Computer Vision, NLP, and LLM-powered solutions."
            </p>
            
            {/* Spacer */}
            <div className="ptf-spacer" style={{ height: '30px' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
