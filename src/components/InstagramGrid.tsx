import React from 'react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const InstagramGrid: React.FC = () => {
  const feedImages = [
    {
      url: '/instagram/insta-1.jpg',
      alt: 'Next-Gen Neural Hardware — Silicon Microelectronics & AI Chips',
      link: 'https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5'
    },
    {
      url: '/instagram/insta-2.jpg',
      alt: 'Interactive Digital AI — Futuristic Human-Computer Interface',
      link: 'https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5'
    },
    {
      url: '/instagram/insta-3.jpg',
      alt: 'Cyberpunk Workstation — High-Performance Engineering Setup',
      link: 'https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5'
    },
    {
      url: '/instagram/insta-4.jpg',
      alt: 'Cloud Computing Infrastructure — High-Density Server Datacenter',
      link: 'https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5'
    },
    {
      url: '/instagram/insta-5.jpg',
      alt: 'Deep Learning Neural Network — Autonomous Intelligent Systems',
      link: 'https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5'
    }
  ];

  return (
    <section className="ptf-instagram-section" style={{ backgroundColor: 'var(--ptf-white-color)' }}>
      <div className="container-xxl">
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '80px' }}></div>
        
        {/* Header containing the Instagram tag */}
        <div className="text-center ptf-animated-block" data-aos="fade-up" style={{ marginBottom: '50px' }}>
          <h5 className="fz-14 text-uppercase has-3-color fw-normal tracking-widest" style={{ marginBottom: '10px' }}>
            Follow Me On Instagram
          </h5>
          <a 
            href="https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5" 
            target="_blank" 
            rel="noreferrer" 
            className="serif-font has-black-color"
            style={{ 
              fontSize: 'clamp(28px, 4vw, 48px)', 
              textDecoration: 'none', 
              transition: 'color var(--ptf-transition-duration)' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ptf-accent-1)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ptf-black-color)'}
          >
            @sami.uthwal
          </a>
        </div>

        {/* 5-Column Responsive Aesthetic Grid */}
        <div>
          <ul className="ptf-instagram-feed">
            {feedImages.map((img, index) => (
              <li 
                key={index} 
                className="ptf-animated-block" 
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                <a 
                  href={img.link} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ position: 'relative', display: 'block', borderRadius: '12px', overflow: 'hidden' }}
                  className="insta-grid-item-link"
                >
                  <img src={img.url} alt={img.alt} loading="lazy" />
                  
                  {/* Hover Overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      backdropFilter: 'blur(3px)'
                    }}
                    className="insta-hover-overlay"
                  >
                    <InstagramIcon width={28} height={28} />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="ptf-spacer" style={{ height: '40px' }}></div>
    </section>
  );
};

export default InstagramGrid;
