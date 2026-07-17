import React, { useState } from 'react';

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  companyUrl: string;
}

const Testimonials: React.FC = () => {
  const [activeDot, setActiveDot] = useState(0);

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

  return (
    <section id="testimonials" className="ptf-testimonials-section" style={{ backgroundColor: 'var(--ptf-white-color)' }}>
      <div className="container-xxl">
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '180px' }}></div>
        {/* Testimonial Slider */}
        <div className="ptf-testimonials-slider" style={{ overflow: 'hidden', width: '100%' }}>
          <div 
            className="ptf-testimonials-track" 
            style={{ 
              display: 'flex', 
              width: '300%', 
              transform: `translateX(-${activeDot * 33.3333}%)`, 
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
            }}
          >
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                style={{ width: '33.3333%', padding: '0 15px', textAlign: 'center' }}
                className="ptf-animated-block"
                data-aos="fade-up"
              >
                <p className="serif-font ptf-testimonial-quote" style={{ fontSize: 'clamp(24px, 3.2vw, 42px)', lineHeight: '1.45', color: 'var(--ptf-black-color)', maxWidth: '950px', margin: '0 auto', fontWeight: 400 }}>
                  {t.quote}
                </p>
                <h4 className="ptf-testimonial-author" style={{ marginTop: '40px', fontSize: '22px', fontWeight: 700, color: 'var(--ptf-black-color)', fontFamily: 'var(--ptf-font-sans)', textTransform: 'none', letterSpacing: 'normal', fontStyle: 'italic' }}>
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
        <div className="ptf-testimonials-dots ptf-animated-block" data-aos="fade-up" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              className={`ptf-pagination-dot ${activeDot === i ? 'active' : ''}`}
              onClick={() => setActiveDot(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Spacer */}
      <div className="ptf-spacer" style={{ height: '180px' }}></div>
    </section>
  );
};

export default Testimonials;
