import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const ContactPage: React.FC = () => {

  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    goals: '',
    timeline: '',
    currency: 'USD',
    budget: '',
    agree: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [isFading, setIsFading] = useState(false);

  // Custom dropdown toggle states
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  // States for custom manual budget range
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [isCustomBudget, setIsCustomBudget] = useState(false);

  const currencies = ['USD', 'PKR', 'EUR', 'GBP'];
  const budgetRanges = ['1,000 - 5,000', '5,000 - 10,000', '10,000 - 25,000', '25,000+'];

  const currencyRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const goalsRef = useRef<HTMLTextAreaElement>(null);

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return `${curr} `;
    }
  };

  const formatBudgetRange = (range: string, curr: string) => {
    if (!range) return '';
    const symbol = getCurrencySymbol(curr);
    
    // Check if the range already contains standard currency symbols or codes
    const cleanRange = range.trim();
    const hasSymbol = cleanRange.includes('$') || cleanRange.includes('€') || cleanRange.includes('£') || 
                      currencies.some(c => cleanRange.toUpperCase().includes(c));
    
    if (hasSymbol) {
      return range;
    }

    if (range === '25,000+') {
      return `${symbol}25,000+`;
    }
    const parts = range.split(' - ');
    if (parts.length === 2) {
      return `${symbol}${parts[0]} - ${symbol}${parts[1]}`;
    }
    return `${symbol}${range}`;
  };


  // Auto-resize goals textarea to match single line and grow with text
  useEffect(() => {
    if (goalsRef.current) {
      goalsRef.current.style.height = 'auto';
      goalsRef.current.style.height = `${goalsRef.current.scrollHeight}px`;
    }
  }, [formData.goals]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setIsCurrencyOpen(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) {
        setIsBudgetOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    let finalBudget = 'Not Provided';
    if (isCustomBudget) {
      if (minBudget && maxBudget) {
        finalBudget = formatBudgetRange(`${minBudget} - ${maxBudget}`, formData.currency);
      } else if (minBudget) {
        finalBudget = formatBudgetRange(`${minBudget}+`, formData.currency);
      } else if (maxBudget) {
        finalBudget = formatBudgetRange(`Up to ${maxBudget}`, formData.currency);
      }
    } else if (formData.budget) {
      finalBudget = formatBudgetRange(formData.budget, formData.currency);
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      subject: `New Portfolio Lead from ${formData.name}`,
      organization: formData.organization || 'Not Provided',
      goals: formData.goals,
      timeline: formData.timeline || 'Not Provided',
      budget: finalBudget,
    };

    try {
      // Submit directly from browser to Web3Forms
      // (Server-side calls were blocked by Cloudflare bot protection)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'cdb7d2df-7946-42f1-811e-c8843c157422',
          ...payload,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsFading(false);
        setSubmitStatus('success');
        setMinBudget('');
        setMaxBudget('');
        setIsCustomBudget(false);
        setFormData({
          name: '',
          organization: '',
          email: '',
          goals: '',
          timeline: '',
          currency: 'USD',
          budget: '',
          agree: false
        });
        // Fade out after 4s, remove after 5s
        setTimeout(() => setIsFading(true), 4000);
        setTimeout(() => { setSubmitStatus(null); setIsFading(false); }, 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page" className="ptf-contact-page-view" style={{ backgroundColor: 'var(--ptf-white-color)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '40px' }}>
      <div className="container-xxl">
        {/* Header Hero Section */}
        <div className="row align-items-center justify-content-between ptf-animated-block" data-aos="fade-up" style={{ marginBottom: '80px' }}>
          <div className="col-12 col-md-8 text-left">
            <h1 className="serif-font" style={{ fontSize: 'clamp(3rem, 6vw, 80px)', lineHeight: 1.1, color: 'var(--ptf-black-color)', fontWeight: 400 }}>
              Contact and <br />get an <span style={{ color: 'var(--ptf-accent-1)' }}>estimate</span>
            </h1>
          </div>
          <div className="col-12 col-md-4 text-left text-md-right" style={{ marginTop: '20px' }}>
            <span className="fz-14 text-uppercase has-3-color tracking-widest block" style={{ marginBottom: '26px' }}>Socials</span>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }} className="ptf-contact-socials">
              {/* WhatsApp Button */}
              <a 
                href="https://wa.me/923073651919" 
                target="_blank" 
                rel="noreferrer" 
                className="ptf-social-btn ptf-social-btn--whatsapp"
                aria-label="Text me on WhatsApp"
              >
                <p>Text me</p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
              </a>

              {/* LinkedIn Button */}
              <a 
                href="https://www.linkedin.com/in/abdulsami-se-ai?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                target="_blank" 
                rel="noreferrer" 
                className="ptf-social-btn ptf-social-btn--linkedin"
                aria-label="Connect on LinkedIn"
              >
                <p>Connect</p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <rect width="16" height="16" rx="2.5" fill="#ffffff" />
                  <path fill="#0A66C2" d="M3.2 6.2h1.8v5.6H3.2V6.2zm.9-2.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM6.6 6.2h1.7v.8h.02c.24-.46.85-.95 1.75-.95 1.87 0 2.22 1.23 2.22 2.83v3.72h-1.8V9.8c0-.62-.01-1.42-.87-1.42-.87 0-1 .68-1 1.37v3.05H6.6V6.2z"/>
                </svg>
              </a>

              {/* GitHub Button */}
              <a 
                href="https://github.com/abdulsamiuthwal-eng" 
                target="_blank" 
                rel="noreferrer" 
                className="ptf-social-btn ptf-social-btn--github"
                aria-label="Follow on GitHub"
              >
                <p>Follow</p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="ptf-divider" data-aos="draw-line" style={{ marginBottom: '60px' }}></div>

        {/* 2-Column Grid */}
        <div className="row">
          {/* Left Column: Details */}
          <div className="col-12 col-lg-4 text-left ptf-animated-block" data-aos="fade-up" data-aos-delay="100" style={{ marginBottom: '50px' }}>
            <div className="ptf-contact-detail-group" style={{ marginBottom: '40px' }}>
              <h5 className="fz-14 text-uppercase has-3-color fw-normal tracking-widest" style={{ marginBottom: '15px' }}>Address</h5>
              <p className="serif-font fz-24 has-black-color" style={{ lineHeight: '1.4' }}>
                Jhang, Punjab, Pakistan
              </p>
            </div>

            <div className="ptf-contact-detail-group" style={{ marginBottom: '40px' }}>
              <h5 className="fz-14 text-uppercase has-3-color fw-normal tracking-widest" style={{ marginBottom: '15px' }}>Email Address</h5>
              <a href="mailto:abdulsamiuthwal@gmail.com" className="serif-font fz-24 has-black-color" style={{ textDecoration: 'none', display: 'block', marginBottom: '8px' }}>
                abdulsamiuthwal@gmail.com
              </a>
            </div>

            <div className="ptf-contact-detail-group">
              <h5 className="fz-14 text-uppercase has-3-color fw-normal tracking-widest" style={{ marginBottom: '15px' }}>Phone Number</h5>
              <a href="tel:+923073651919" className="serif-font fz-24 has-black-color" style={{ textDecoration: 'none', display: 'block' }}>
                +92 307 365 1919
              </a>
            </div>
          </div>

          {/* Right Column: Minimal Form */}
          <div className="col-12 col-lg-7 offset-lg-1 text-left ptf-animated-block" data-aos="fade-up" data-aos-delay="200">
            <h3 className="serif-font" style={{ fontSize: '32px', marginBottom: '40px', fontWeight: 400, color: 'var(--ptf-black-color)' }}>
              Tell us about your project and goals.
            </h3>

            <form onSubmit={handleSubmit} className="ptf-estimate-form">
              <div className="ptf-form-minimal-group">
                <label className="ptf-form-minimal-label">What’s your name?</label>
                <input 
                  type="text" 
                  className="ptf-form-minimal-input" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="ptf-form-minimal-group">
                <label className="ptf-form-minimal-label">What’s the name of your organization?</label>
                <input 
                  type="text" 
                  className="ptf-form-minimal-input" 
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                />
              </div>

              <div className="ptf-form-minimal-group">
                <label className="ptf-form-minimal-label">What’s your email address?</label>
                <input 
                  type="email" 
                  className="ptf-form-minimal-input" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="ptf-form-minimal-group">
                <label className="ptf-form-minimal-label">Tell us about your project goals.</label>
                <textarea 
                  ref={goalsRef}
                  rows={1}
                  className="ptf-form-minimal-textarea" 
                  required 
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  style={{ minHeight: '52px', height: '52px', overflowY: 'hidden', resize: 'none' }}
                ></textarea>
              </div>

              <div className="ptf-form-minimal-group">
                <label className="ptf-form-minimal-label">Do you have a timeline in mind?</label>
                <input 
                  type="text" 
                  className="ptf-form-minimal-input" 
                  placeholder="e.g. 3 months, immediate"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                />
              </div>

              <div className="ptf-form-minimal-group">
                <label className="ptf-form-minimal-label">What have you budgeted for this project?</label>
                <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                  {/* Custom Currency Dropdown with manual type-in capability */}
                  <div 
                    ref={currencyRef} 
                    className="ptf-custom-dropdown-wrapper" 
                    style={{ width: '120px', position: 'relative' }}
                  >
                    <div 
                      className={`ptf-form-minimal-select ptf-custom-select-trigger ${isCurrencyOpen ? 'active' : ''}`}
                      style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'text' }}
                    >
                      <input 
                        type="text" 
                        value={formData.currency}
                        onChange={(e) => {
                          setFormData({ ...formData, currency: e.target.value.toUpperCase() });
                          setIsCurrencyOpen(true);
                        }}
                        onFocus={() => {
                          setIsCurrencyOpen(true);
                          setIsBudgetOpen(false);
                        }}
                        style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', padding: '0', fontSize: '18px', fontWeight: '400', fontFamily: 'inherit', color: 'inherit' }}
                        placeholder="USD"
                      />
                      <svg 
                        width="10" 
                        height="6" 
                        viewBox="0 0 10 6" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        style={{ 
                          position: 'absolute', 
                          right: '0', 
                          top: '50%', 
                          transform: `translateY(-50%) ${isCurrencyOpen ? 'rotate(180deg)' : 'rotate(0)'}`, 
                          transition: 'transform 0.2s',
                          pointerEvents: 'none'
                        }}
                      >
                        <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {isCurrencyOpen && (
                      <ul className="ptf-custom-dropdown-menu">
                        {currencies.map((curr) => (
                          <li 
                            key={curr} 
                            onClick={() => {
                              setFormData({ ...formData, currency: curr });
                              setIsCurrencyOpen(false);
                            }}
                          >
                            {curr}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Custom Budget Selection */}
                  {isCustomBudget ? (
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexGrow: 1 }}>
                      {/* Min Budget Input */}
                      <div className="ptf-form-minimal-select ptf-custom-select-trigger" style={{ flexGrow: 1, padding: '12px 0', position: 'relative' }}>
                        <input 
                          type="text" 
                          placeholder={`Min (${getCurrencySymbol(formData.currency).trim()})`}
                          value={minBudget}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setMinBudget(val ? Number(val).toLocaleString() : '');
                          }}
                          style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', padding: '0', fontSize: '18px', fontWeight: '400', fontFamily: 'inherit', color: 'inherit' }}
                        />
                      </div>
                      <span style={{ color: '#999', fontSize: '16px', fontWeight: 500 }}>to</span>
                      {/* Max Budget Input */}
                      <div className="ptf-form-minimal-select ptf-custom-select-trigger" style={{ flexGrow: 1, padding: '12px 0', position: 'relative' }}>
                        <input 
                          type="text" 
                          placeholder={`Max (${getCurrencySymbol(formData.currency).trim()})`}
                          value={maxBudget}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setMaxBudget(val ? Number(val).toLocaleString() : '');
                          }}
                          style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', padding: '0', fontSize: '18px', fontWeight: '400', fontFamily: 'inherit', color: 'inherit' }}
                        />
                      </div>
                      {/* Back/Cancel Button */}
                      <button 
                        type="button" 
                        onClick={() => {
                          setIsCustomBudget(false);
                          setFormData({ ...formData, budget: '' });
                          setMinBudget('');
                          setMaxBudget('');
                        }}
                        style={{ 
                          border: 'none', 
                          background: 'transparent', 
                          color: 'var(--ptf-accent-1)', 
                          cursor: 'pointer', 
                          padding: '5px',
                          fontSize: '14px',
                          fontWeight: 600,
                          textDecoration: 'underline',
                          marginLeft: '5px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    /* Custom Budget Dropdown with manual type-in capability */
                    <div 
                      ref={budgetRef} 
                      className="ptf-custom-dropdown-wrapper" 
                      style={{ flexGrow: 1, position: 'relative' }}
                    >
                      <div 
                        className={`ptf-form-minimal-select ptf-custom-select-trigger ${isBudgetOpen ? 'active' : ''}`}
                        style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'text' }}
                      >
                        <input 
                          type="text" 
                          value={budgetRanges.includes(formData.budget) ? formatBudgetRange(formData.budget, formData.currency) : formData.budget}
                          onChange={(e) => {
                            setFormData({ ...formData, budget: e.target.value });
                            setIsBudgetOpen(true);
                          }}
                          onFocus={() => {
                            setIsBudgetOpen(true);
                            setIsCurrencyOpen(false);
                          }}
                          style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', padding: '0', fontSize: '18px', fontWeight: '400', fontFamily: 'inherit', color: 'inherit', paddingRight: '20px' }}
                          placeholder="Select budget range or enter custom..."
                        />
                        <svg 
                          width="10" 
                          height="6" 
                          viewBox="0 0 10 6" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          style={{ 
                            position: 'absolute', 
                            right: '0', 
                            top: '50%', 
                            transform: `translateY(-50%) ${isBudgetOpen ? 'rotate(180deg)' : 'rotate(0)'}`, 
                            transition: 'transform 0.2s',
                            pointerEvents: 'none'
                          }}
                        >
                          <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {isBudgetOpen && (
                        <ul className="ptf-custom-dropdown-menu">
                          <li 
                            onClick={() => {
                              setFormData({ ...formData, budget: '' });
                              setIsBudgetOpen(false);
                            }}
                            style={{ color: '#999' }}
                          >
                            Select budget range...
                          </li>
                          {budgetRanges.map((range) => (
                            <li 
                              key={range} 
                              onClick={() => {
                                setFormData({ ...formData, budget: range });
                                setIsBudgetOpen(false);
                              }}
                            >
                              {formatBudgetRange(range, formData.currency)}
                            </li>
                          ))}
                          <li 
                            onClick={() => {
                              setIsCustomBudget(true);
                              setIsBudgetOpen(false);
                              setFormData({ ...formData, budget: '' });
                            }}
                            style={{ color: 'var(--ptf-accent-1)', fontWeight: 600, borderTop: '1px solid var(--ptf-border-color)' }}
                          >
                            + Enter Custom Range...
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="ptf-form-checkbox-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '40px 0 30px' }}>
                <input 
                  type="checkbox" 
                  id="agree" 
                  className="ptf-custom-checkbox"
                  checked={formData.agree}
                  onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                />
                <label htmlFor="agree" className="fz-14" style={{ cursor: 'pointer', color: 'var(--ptf-text-color)' }}>
                  I agree to receive occasional communications regarding project estimation and news.
                </label>
              </div>

              <button type="submit" className="ptf-btn-primary" style={{ padding: '18px 45px' }} disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Submit'} <ArrowUpRight size={18} />
              </button>

              {submitStatus === 'success' && (
                <div style={{
                  color: '#28a745',
                  marginTop: '20px',
                  fontSize: '18px',
                  fontWeight: 500,
                  opacity: isFading ? 0 : 1,
                  transform: isFading ? 'translateY(-8px)' : 'translateY(0)',
                  transition: 'opacity 1s ease, transform 1s ease',
                }}>
                  ✓ Thank you! Your request has been sent successfully. I will get back to you shortly.
                </div>
              )}
              {submitStatus === 'error' && (
                <div style={{ color: '#dc3545', marginTop: '20px', fontSize: '18px', fontWeight: 500 }}>
                  ✗ Oops! Something went wrong. Please try again or email me directly at abdulsamiuthwal@gmail.com.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
