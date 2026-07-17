import React from 'react';

const About: React.FC = () => {
  return (
    <section id="biography" className="ptf-biography-section" style={{ backgroundColor: 'var(--ptf-white-color)' }}>
      {/* Spacer */}
      <div className="ptf-spacer" style={{ height: '100px' }}></div>

      <div className="container-xxl">
        <div className="row ptf-biography-row">
          {/* Left Column: Bio, Contact, and Services */}
          <div className="col-12 col-xl-3 order-xl-1 ptf-biography-left-col" style={{ textAlign: 'left' }}>
            {/* Biography Block */}
            <div className="ptf-animated-block" data-aos="fade-up" data-aos-delay="0">
              <h5 className="fz-14 text-uppercase has-3-color fw-normal tracking-widest" style={{ marginBottom: '15px' }}>Biography</h5>
              <p className="serif-font has-black-color ptf-biography-text" style={{ fontSize: '22px', lineHeight: '1.45', fontWeight: 400 }}>
                Work for passion, build for impact! I'm Abdul Sami, an AI/ML Engineer & Full-Stack Developer operating globally from Pakistan. I specialize in building intelligent systems — from Computer Vision pipelines to LLM-powered applications.
              </p>
            </div>
            
            {/* Contact Block */}
            <div className="ptf-animated-block" data-aos="fade-up" data-aos-delay="100">
              <h5 className="fz-14 text-uppercase has-3-color fw-normal tracking-widest" style={{ marginBottom: '15px' }}>Contact</h5>
              <div className="ptf-contact-info">
                <p className="serif-font has-black-color" style={{ fontSize: '20px', lineHeight: '1.4', marginBottom: '8px' }}>
                  Jhang, Punjab, Pakistan
                </p>
                <a 
                  href="mailto:abdulsamiuthwal@gmail.com" 
                  className="serif-font has-black-color" 
                  style={{ textDecoration: 'none', display: 'block', fontSize: '20px', lineHeight: '1.4', marginBottom: '8px' }}
                >
                  abdulsamiuthwal@gmail.com
                </a>
                <a 
                  href="tel:+923073651919" 
                  className="serif-font has-black-color" 
                  style={{ textDecoration: 'none', display: 'block', fontSize: '20px', lineHeight: '1.4' }}
                >
                  +92 307 365 1919
                </a>
              </div>
            </div>

            {/* Services Block */}
            <div className="ptf-animated-block" data-aos="fade-up" data-aos-delay="200">
              <h5 className="fz-14 text-uppercase has-3-color fw-normal tracking-widest" style={{ marginBottom: '15px' }}>Services</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className="serif-font has-black-color" style={{ fontSize: '20px' }}>AI/ML Model Development</span>
                <span className="serif-font has-black-color" style={{ fontSize: '20px' }}>Computer Vision Systems</span>
                <span className="serif-font has-black-color" style={{ fontSize: '20px' }}>LLM & RAG Applications</span>
                <span className="serif-font has-black-color" style={{ fontSize: '20px' }}>Full-Stack Web Development</span>
                <span className="serif-font has-black-color" style={{ fontSize: '20px' }}>API & Backend Development</span>
              </div>
            </div>
          </div>

          {/* Center Column: Portrait in Double Oval Frame */}
          <div className="col-12 col-xl-6 order-xl-2 text-center ptf-biography-center-col">
            <div className="ptf-animated-block" data-aos="fade-up" data-aos-delay="50">
              <div className="ptf-custom--5512">
                <img 
                  src="/profile.jpg" 
                  alt="Abdul Sami Uthwal Portrait" 
                />
              </div>
            </div>
          </div>

          {/* Right Column: Stacked Stats (Label on top, Number below) */}
          <div className="col-12 col-xl-3 order-xl-3 text-xl-right ptf-about-stats-col ptf-biography-right-col">
            {/* Stat 1: Experience */}
            <div className="ptf-animated-block ptf-stat-block" data-aos="fade-up" data-aos-delay="150">
              <h5 className="fz-14 text-uppercase has-3-color fw-normal tracking-widest" style={{ marginBottom: '8px' }}>Years of Experience</h5>
              <div className="serif-font has-black-color" style={{ fontSize: '75px', lineHeight: '1', fontWeight: 400 }}>
                1.5+
              </div>
            </div>

            {/* Stat 2: Clients */}
            <div className="ptf-animated-block ptf-stat-block" data-aos="fade-up" data-aos-delay="250">
              <h5 className="fz-14 text-uppercase has-3-color fw-normal tracking-widest" style={{ marginBottom: '8px' }}>Client Satisfaction</h5>
              <div className="serif-font has-black-color" style={{ fontSize: '75px', lineHeight: '1', fontWeight: 400 }}>
                100%
              </div>
            </div>

            {/* Stat 3: Global Clients */}
            <div className="ptf-animated-block ptf-stat-block" data-aos="fade-up" data-aos-delay="350">
              <h5 className="fz-14 text-uppercase has-3-color fw-normal tracking-widest" style={{ marginBottom: '8px' }}>Clients on Worldwide</h5>
              <div style={{ height: '75px' }}></div>
            </div>

            {/* Stat 4: Projects */}
            <div className="ptf-animated-block ptf-stat-block" data-aos="fade-up" data-aos-delay="450">
              <h5 className="fz-14 text-uppercase has-3-color fw-normal tracking-widest" style={{ marginBottom: '8px' }}>Projects Done</h5>
              <div className="serif-font has-black-color" style={{ fontSize: '75px', lineHeight: '1', fontWeight: 400 }}>
                6+
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="ptf-spacer" style={{ height: '120px' }}></div>
    </section>
  );
};

export default About;
