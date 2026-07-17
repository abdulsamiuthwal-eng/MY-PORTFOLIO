import React, { useState } from 'react';

const CircularCTA: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    sessionStorage.setItem('fromCallSami', 'true');
    setTimeout(() => {
      setIsClicked(false);
    }, 600);
  };

  return (
    <section className="ptf-circular-cta-section" style={{ paddingBottom: '120px', paddingTop: '0px' }}>
      <div className="container-xxl">
        <div className="ptf-spacer" style={{ height: '65px' }}></div>
        
        <div className="row justify-content-center">
          <div className="col-12 text-center ptf-animated-block" data-aos="fade-up">
            <div className="ptf-moonex-cta-wrapper">
              
              {/* Background Wave Graphic Left */}
              <div className="ptf-moonex-bg-wave-left">
                <svg width="100" height="60" viewBox="0 0 100 60" fill="none" stroke="#f1f1f1" strokeWidth="2" strokeLinecap="round">
                  <path d="M 0 15 Q 12.5 5, 25 15 T 50 15 T 75 15 T 100 15" />
                  <path d="M 0 30 Q 12.5 20, 25 30 T 50 30 T 75 30 T 100 30" />
                  <path d="M 0 45 Q 12.5 35, 25 45 T 50 45 T 75 45 T 100 45" />
                </svg>
              </div>

              {/* Background Wave Graphic Right (Concentric Disk) */}
              <div className="ptf-moonex-bg-wave-right">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <defs>
                    <mask id="waveMask">
                      <circle cx="75" cy="75" r="60" fill="#ffffff" />
                    </mask>
                  </defs>
                  <g mask="url(#waveMask)" fill="none" stroke="#f3f3f3" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M -20 20 Q 5 10, 30 20 T 80 20 T 130 20 T 180 20" />
                    <path d="M -20 40 Q 5 30, 30 40 T 80 40 T 130 40 T 180 40" />
                    <path d="M -20 60 Q 5 50, 30 60 T 80 60 T 130 60 T 180 60" />
                    <path d="M -20 80 Q 5 70, 30 80 T 80 80 T 130 80 T 180 80" />
                    <path d="M -20 100 Q 5 90, 30 100 T 80 100 T 130 100 T 180 100" />
                    <path d="M -20 120 Q 5 110, 30 120 T 80 120 T 130 120 T 180 120" />
                  </g>
                </svg>
              </div>

              <a 
                href="#contact-page" 
                className={`ptf-moonex-cta-link ${isClicked ? 'is-clicked' : ''}`}
                onClick={handleClick}
              >
                
                {/* Rotating Outer Circular Text */}
                <div className="ptf-moonex-rotating-text">
                  <svg className="rotating-svg" viewBox="0 0 100 100">
                    <defs>
                      <path
                        id="textPath"
                        d="M 50,50 m -43,0 a 43,43 0 1,1 86,0 a 43,43 0 1,1 -86,0"
                      />
                    </defs>
                    <text fill="currentColor">
                      <textPath href="#textPath" startOffset="0%">
                        {"Describe your project • Describe your project •\u00A0"}
                      </textPath>
                    </text>
                  </svg>
                </div>

                {/* Inner Dotted Circle Box */}
                <div className="ptf-moonex-inner-circle">
                  {/* SVG Dotted Border Overlay */}
                  <svg className="ptf-moonex-circle-dotted-border" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="47.746" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="0 6.6666" strokeLinecap="round" />
                  </svg>
                  <div className="ptf-moonex-inner-content">
                    <div className="ptf-moonex-inner-content-block">
                      <span className="ptf-moonex-cta-sub">Describe your<br />project</span>
                      <h3 className="ptf-moonex-cta-title serif-font">Call<br />Sami</h3>
                      <div className="ptf-moonex-cta-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '36px', height: '36px' }}>
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CircularCTA;
