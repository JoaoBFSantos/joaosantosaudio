import { useEffect, useRef, useState } from 'react';
import { trapKeyboardFocus } from '../utils/focus';

export default function ContactForm({ email, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', botcheck: false });
  const [status, setStatus] = useState('idle');
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement;
    const focusFrame = window.requestAnimationFrame(() => firstFieldRef.current?.focus());
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      trapKeyboardFocus(event, dialogRef.current);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement?.focus?.();
    };
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          botcheck: formData.botcheck,
          subject: `Portfolio Contact from ${formData.name}`
        })
      });
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '', botcheck: false });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain"
      style={{ backgroundColor: 'rgba(20, 22, 28, 0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div className="contact-dialog-wrap min-h-full flex items-start sm:items-center justify-center p-4">
        <div
          ref={dialogRef}
          className="contact-dialog w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:p-8 rounded-2xl relative"
          style={{
            backgroundColor: 'rgba(20, 22, 28, 0.98)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.55)'
          }}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-dialog-title"
          tabIndex={-1}
        >
          <button
            type="button"
            onClick={onClose}
            className="contact-dialog-close absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full flex items-center justify-center text-base transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: '#1a1a24', color: '#9aa0a6', '--tw-ring-color': '#00FFB2', '--tw-ring-offset-color': 'rgba(20, 22, 28, 0.92)' }}
            aria-label="Close contact form"
          >
            <span aria-hidden="true">✕</span>
          </button>

          <h3 id="contact-dialog-title" className="contact-dialog-title text-2xl font-bold mb-2 pr-12" style={{ color: '#00FFB2' }}>Get in Touch</h3>
          <p className="contact-dialog-subtitle text-sm mb-6 leading-relaxed" style={{ color: '#8f949d' }}>Let&apos;s discuss your project</p>

          {status === 'success' ? (
            <div className="text-center py-6" role="status" aria-live="polite">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 255, 178, 0.12)', color: '#00FFB2' }}>✓</div>
              <p className="text-base font-semibold mb-2" style={{ color: '#00FFB2' }}>Message Sent</p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#8f949d' }}>I&apos;ll get back to you soon.</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-sm transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#E8E8EC', border: '1px solid rgba(255, 255, 255, 0.12)', '--tw-ring-color': '#00FFB2', '--tw-ring-offset-color': 'rgba(20, 22, 28, 0.92)' }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form space-y-5" aria-busy={status === 'sending'}>
              <input
                type="checkbox"
                name="botcheck"
                checked={formData.botcheck}
                onChange={(event) => setFormData({ ...formData, botcheck: event.target.checked })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <div>
                <label htmlFor="contact-name" className="contact-field-label block text-xs uppercase tracking-wider mb-2" style={{ color: '#9aa0a6' }}>Name</label>
                <input
                  ref={firstFieldRef}
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  className="contact-field-control w-full px-4 py-3.5 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-2 placeholder:text-[#8a8f98]"
                  style={{ backgroundColor: '#1a1a24', border: '1px solid #2f2f3a', color: '#fff', '--tw-ring-color': '#00FFB2' }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="contact-field-label block text-xs uppercase tracking-wider mb-2" style={{ color: '#9aa0a6' }}>Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  className="contact-field-control w-full px-4 py-3.5 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-2 placeholder:text-[#8a8f98]"
                  style={{ backgroundColor: '#1a1a24', border: '1px solid #2f2f3a', color: '#fff', '--tw-ring-color': '#00FFB2' }}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="contact-field-label block text-xs uppercase tracking-wider mb-2" style={{ color: '#9aa0a6' }}>Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  maxLength={3000}
                  rows={4}
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  className="contact-field-control contact-message w-full px-4 py-3.5 rounded-lg text-sm outline-none transition-all duration-300 resize-none focus:ring-2 placeholder:text-[#8a8f98]"
                  style={{ backgroundColor: '#1a1a24', border: '1px solid #2f2f3a', color: '#fff', '--tw-ring-color': '#00FFB2' }}
                  placeholder="Tell me about your project..."
                />
              </div>

              {status === 'error' && <p className="text-sm" style={{ color: '#FF3366' }} role="alert">Something went wrong. Please try again or email directly.</p>}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="contact-submit w-full py-4 rounded-full font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: '#00FFB2', color: '#0A0A0F', '--tw-ring-color': '#00FFB2', '--tw-ring-offset-color': 'rgba(20, 22, 28, 0.92)' }}
              >
                {status === 'sending' ? (
                  <span className="inline-flex items-center justify-center gap-2" role="status" aria-live="polite">
                    Sending
                    <span className="loading-dots" aria-hidden="true">
                      <span className="loading-dots__dot" />
                      <span className="loading-dots__dot" />
                      <span className="loading-dots__dot" />
                    </span>
                  </span>
                ) : 'Send Message →'}
              </button>

              <a
                href={`mailto:${email}`}
                className="contact-email-option flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-3 py-3 text-center text-[13px] sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: 'rgba(0, 255, 178, 0.035)', borderColor: 'rgba(0, 255, 178, 0.22)', color: '#A8ADB6' }}
              >
                <span className="text-base" aria-hidden="true">✉</span>
                <span>
                  Or email directly at{' '}
                  <span className="font-semibold underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current" style={{ color: '#00FFB2' }}>
                    {email}
                  </span>
                </span>
              </a>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
