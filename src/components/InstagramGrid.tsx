import React from 'react';

const InstagramGrid: React.FC = () => {
  const feedImages = [
    {
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=500&h=500&q=80',
      alt: 'Clean VS Code Coding Screen',
      link: 'https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5'
    },
    {
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=500&h=500&q=80',
      alt: 'Cloud Servers Infrastructure Hardware Network',
      link: 'https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5'
    },
    {
      url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&h=500&q=80',
      alt: 'Professional Developer Workspace Workstation',
      link: 'https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5'
    },
    {
      url: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=500&h=500&q=80',
      alt: 'Detailed Developer Code Screen',
      link: 'https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5'
    },
    {
      url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=500&h=500&q=80',
      alt: 'UX Wireframe Design Flow Mockup',
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
            Follow Me
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

        {/* 5-Column Responsive Grid */}
        <div>
          <ul className="ptf-instagram-feed">
            {feedImages.map((img, index) => (
              <li 
                key={index} 
                className="ptf-animated-block" 
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                <a href={img.link} target="_blank" rel="noreferrer">
                  <img src={img.url} alt={img.alt} loading="lazy" />
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
