import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${formState.name}! Sami will get back to you shortly.`);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="ptf-contact-section">
      <div className="container-xxl">
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '100px' }}></div>
        <div className="ptf-contact-grid">
          {/* Left Column: CTA Info */}
          <div className="ptf-contact-info ptf-animated-block" data-aos="fade" data-aos-delay="0">
            <h2 className="ptf-contact-heading">
              Describe <br />
              your <span className="serif-font text-[#fa4529]">project</span>
            </h2>
            
            <div className="ptf-contact-details">
              <div className="ptf-contact-detail-item">
                <span className="ptf-contact-detail-label">Email Me</span>
                <a href="mailto:abdulsamiuthwal@gmail.com" className="ptf-contact-detail-value">
                  abdulsamiuthwal@gmail.com
                </a>
              </div>
              <div className="ptf-contact-detail-item">
                <span className="ptf-contact-detail-label">Location</span>
                <span className="ptf-contact-detail-value" style={{ cursor: 'default' }}>Jhang, Punjab, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="ptf-contact-form-panel ptf-animated-block" data-aos="fade" data-aos-delay="100">
            <form onSubmit={handleSubmit} className="ptf-contact-form">
              <div className="ptf-form-group">
                <label className="ptf-form-label" htmlFor="name">Your Name</label>
                <input 
                  type="text" 
                  id="name"
                  className="ptf-form-input"
                  required
                  placeholder="e.g. John Doe"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>

              <div className="ptf-form-group">
                <label className="ptf-form-label" htmlFor="email">Your Email</label>
                <input 
                  type="email" 
                  id="email"
                  className="ptf-form-input"
                  required
                  placeholder="e.g. john@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>

              <div className="ptf-form-group">
                <label className="ptf-form-label" htmlFor="message">Project details</label>
                <textarea 
                  id="message"
                  rows={5}
                  className="ptf-form-textarea"
                  required
                  placeholder="Tell me about your project, goals, and timeline..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="ptf-btn-primary">
                Send Message <ArrowUpRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="ptf-spacer" style={{ height: '100px' }}></div>
    </section>
  );
};

export default Contact;
