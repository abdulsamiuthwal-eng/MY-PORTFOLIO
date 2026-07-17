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
      const response = await fetch('/api/web3forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
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
    <div className="ptf-contact-page-view" style={{ backgroundColor: 'var(--ptf-white-color)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '100px' }}>
      <div className="container-xxl">
        {/* Header Hero Section */}
        <div className="row align-items-center justify-content-between ptf-animated-block" data-aos="fade-up" style={{ marginBottom: '80px' }}>
          <div className="col-12 col-md-8 text-left">
            <h1 className="serif-font" style={{ fontSize: 'clamp(3rem, 6vw, 80px)', lineHeight: 1.1, color: 'var(--ptf-black-color)', fontWeight: 400 }}>
              Contact and <br />get an <span style={{ color: 'var(--ptf-accent-1)' }}>estimate</span>
            </h1>
          </div>
          <div className="col-12 col-md-4 text-left text-md-right" style={{ marginTop: '20px' }}>
            <span className="fz-14 text-uppercase has-3-color tracking-widest block" style={{ marginBottom: '15px' }}>Socials</span>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'flex-start' }} className="ptf-contact-socials">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="ptf-social-link-styled">LinkedIn</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="ptf-social-link-styled">GitHub</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="ptf-social-link-styled">Instagram</a>
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
                <div style={{ color: '#28a745', marginTop: '20px', fontSize: '18px', fontWeight: 500 }}>
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
