import React, { useState } from 'react';
import { X } from 'lucide-react';

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" rx="1" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Biography', href: '#biography' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#timeline' },
    { label: 'Projects', href: '#project' },
    { label: 'Contact', href: '#contact-page' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If clicking a link that is already the current location, trigger the scroll and animation manually
    if (window.location.hash === href || (href === '#home' && window.location.hash === '')) {
      e.preventDefault();
      if ((window as any).triggerSectionAnimation) {
        (window as any).triggerSectionAnimation(href);
      }
    }
  };

  return (
    <nav className="ptf-navbar">
      <div className="container-xxl">
        <div className="ptf-navbar-inner">
          {/* Left Links */}
          <div className="ptf-navbar-links" style={{ justifyContent: 'flex-start' }} data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000">
            {navItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className="ptf-nav-link"
                onClick={(e) => handleLinkClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Centered Logo */}
          <a href="#home" className="ptf-navbar-logo text-center" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: '100%' }} data-aos="fade-up" data-aos-delay="0" data-aos-duration="1000">
            <img 
              src="/logo.png" 
              alt="ABDUL SAMI." 
              style={{ 
                height: '85px', 
                width: 'auto', 
                objectFit: 'contain',
                mixBlendMode: 'multiply'
              }} 
            />
          </a>

          {/* Desktop Actions (Right) - LinkedIn and GitHub first */}
          <div className="ptf-navbar-actions" style={{ justifyContent: 'flex-end', marginLeft: 'auto', gap: '22px' }} data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
            <a href="https://www.linkedin.com/in/abdulsami-se-ai?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer" className="ptf-social-icon">
              <LinkedinIcon style={{ width: '20px', height: '20px' }} />
            </a>
            <a href="https://github.com/abdulsamiuthwal-eng" target="_blank" rel="noreferrer" className="ptf-social-icon">
              <GithubIcon style={{ width: '20px', height: '20px' }} />
            </a>
            <a href="https://wa.me/923073651919" target="_blank" rel="noreferrer" className="ptf-social-icon">
              <WhatsappIcon style={{ width: '20px', height: '20px' }} />
            </a>
            <a href="https://x.com/SamiUthwal" target="_blank" rel="noreferrer" className="ptf-social-icon">
              <TwitterIcon style={{ width: '20px', height: '20px' }} />
            </a>
            <a href="https://www.facebook.com/share/18texnGjjx/" target="_blank" rel="noreferrer" className="ptf-social-icon">
              <FacebookIcon style={{ width: '20px', height: '20px' }} />
            </a>
            <a href="https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5" target="_blank" rel="noreferrer" className="ptf-social-icon">
              <InstagramIcon style={{ width: '20px', height: '20px' }} />
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="ptf-navbar-toggle" onClick={() => setIsOpen(!isOpen)} data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000">
            {isOpen ? (
              <X size={24} />
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                style={{ width: '24px', height: '24px' }}
              >
                <line x1="4" y1="8" x2="20" y2="8"></line>
                <line x1="4" y1="16" x2="20" y2="16"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div className="ptf-mobile-drawer-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="ptf-mobile-drawer">
            {/* Header inside drawer with elegant thin Close button */}
            <div className="ptf-mobile-drawer-header" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ptf-black-color)', padding: '5px' }}
                aria-label="Close Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '36px', height: '36px' }}>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Navigation links vertically centered in the remaining space */}
            <div className="ptf-mobile-drawer-links-container" style={{ margin: '40px 0 auto 0' }}>
              <div className="ptf-mobile-drawer-links" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="ptf-mobile-nav-link"
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      width: '100%', 
                      fontSize: 'clamp(28px, 6.5vw, 36px)', 
                      fontWeight: '700', 
                      textTransform: 'none', 
                      color: 'var(--ptf-black-color)', 
                      padding: '16px 0',
                      textDecoration: 'none'
                    }}
                    onClick={(e) => {
                      setIsOpen(false);
                      handleLinkClick(e, item.href);
                    }}
                  >
                    <span>{item.label}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', color: 'var(--ptf-black-color)' }}>
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Footer with Copyright and Circular Social icons pushed to bottom */}
            <div className="ptf-mobile-drawer-footer" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
              <div className="ptf-mobile-drawer-copyright" style={{ fontSize: '13px', color: '#999999', lineHeight: '1.5', fontWeight: '400' }}>
                <div>@2026 Sami. All Rights Reserved.</div>
                <div style={{ marginTop: '4px' }}>Development by Sami.</div>
              </div>
              <div className="ptf-mobile-drawer-socials" style={{ gap: '12px', display: 'flex', justifyContent: 'flex-start', margin: '0' }}>
                <a href="https://www.linkedin.com/in/abdulsami-se-ai?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer" className="ptf-mobile-drawer-social-circle">
                  <LinkedinIcon style={{ width: '16px', height: '16px' }} />
                </a>
                <a href="https://github.com/abdulsamiuthwal-eng" target="_blank" rel="noreferrer" className="ptf-mobile-drawer-social-circle">
                  <GithubIcon style={{ width: '16px', height: '16px' }} />
                </a>
                <a href="https://wa.me/923073651919" target="_blank" rel="noreferrer" className="ptf-mobile-drawer-social-circle">
                  <WhatsappIcon style={{ width: '16px', height: '16px' }} />
                </a>
                <a href="https://x.com/SamiUthwal" target="_blank" rel="noreferrer" className="ptf-mobile-drawer-social-circle">
                  <TwitterIcon style={{ width: '16px', height: '16px' }} />
                </a>
                <a href="https://www.facebook.com/share/18texnGjjx/" target="_blank" rel="noreferrer" className="ptf-mobile-drawer-social-circle">
                  <FacebookIcon style={{ width: '16px', height: '16px' }} />
                </a>
                <a href="https://www.instagram.com/sami.uthwal?igsh=eGtmdjAwaXZjZnk5" target="_blank" rel="noreferrer" className="ptf-mobile-drawer-social-circle">
                  <InstagramIcon style={{ width: '16px', height: '16px' }} />
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
