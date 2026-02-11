import { useState, useEffect, useRef } from 'react';
import portfolioData from './portfolio-data.json';

// Extract data from JSON file - your brother can edit portfolio-data.json to add new projects!
const { profile, categories, projects: projectData } = portfolioData;

const LazyEmbed = ({ className = '', placeholderClassName = '', style, children }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const node = ref.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={ref} className={className} style={style}>
      {isVisible ? (
        children
      ) : (
        <div className={`w-full h-full bg-[#0f1117] animate-pulse ${placeholderClassName}`} />
      )}
    </div>
  );
};

// SoundCloud Embed Component with dark theme
const SoundCloudEmbed = ({ url, title, height = 300, featured = false, compact = true, accentColor = '#1a1a24' }) => {
  // Convert https to http for the API URL if needed
  const apiUrl = url.replace('https://', 'http://');
  const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(apiUrl)}&color=%2300FFB2&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
  const finalHeight = compact ? (featured ? height : Math.max(140, Math.round(height * 0.8))) : height;
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div
      className={`${featured ? 'rounded-2xl p-4 md:p-5' : 'rounded-2xl p-3 md:p-4'} mt-3 sm:mt-2`}
      style={{
        backgroundColor: '#14161c',
        border: `1px solid ${accentColor}70`,
        boxShadow: featured
          ? `0 18px 36px rgba(0,0,0,0.38), 0 0 0 1px ${accentColor}70`
          : `0 10px 22px rgba(0,0,0,0.28), 0 0 0 1px ${accentColor}70`
      }}
    >
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ backgroundColor: '#14161c', height: finalHeight }}
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0f1117] text-xs text-[#9aa0a6]">
            Loading audio...
          </div>
        )}
        <LazyEmbed
          className="w-full h-full"
          placeholderClassName="rounded-xl"
        >
          <iframe
            width="100%"
            height={finalHeight}
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            loading="lazy"
            src={embedUrl}
            style={{ border: 'none' }}
            title={title}
            onLoad={() => setIsLoaded(true)}
          />
        </LazyEmbed>
      </div>
    </div>
  );
};

// YouTube Embed Component
const YouTubeEmbed = ({ videoId, title, featured = false, accentColor = '#1a1a24' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isActivated) return;
    const node = containerRef.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) {
      setIsActivated(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsActivated(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '400px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isActivated]);

  return (
    <div className="mt-3 sm:mt-2">
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden w-full aspect-[16/10] sm:aspect-video"
        style={{
          backgroundColor: '#14161c',
          opacity: featured ? 1 : 0.9,
          transform: featured ? 'scale(1)' : 'scale(0.98)',
          transition: 'transform 0.4s ease, opacity 0.4s ease',
          boxShadow: `0 0 0 1px ${accentColor}70`
        }}
      >
        {!isLoaded && (
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={`${title} thumbnail`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
        {isActivated && (
          <LazyEmbed className="w-full h-full" placeholderClassName="rounded-xl">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&color=white`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="eager"
              onLoad={() => setIsLoaded(true)}
              allowFullScreen
            />
          </LazyEmbed>
        )}
      </div>
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center text-[11px] sm:text-sm mt-2 px-3 py-1 rounded-full min-h-[44px] sm:min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          color: accentColor,
          border: `1px solid ${accentColor}80`,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          '--tw-ring-color': accentColor,
          '--tw-ring-offset-color': '#0A0A0F'
        }}
      >
        Watch on YouTube
      </a>
    </div>
  );
};

// Animated Category Card Component
const CategoryCard = ({ section, isHovered, onHover, onLeave, onClick }) => {

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="p-6 rounded-2xl cursor-pointer transition-all duration-300 text-left relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        backgroundColor: isHovered ? '#14161c' : '#14161c',
        border: `1px solid ${isHovered ? section.color + '50' : '#1a1a24'}`,
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered 
          ? `0 25px 50px rgba(0,0,0,0.5), 0 0 30px ${section.color}20` 
          : '0 10px 30px rgba(0,0,0,0.3)',
        '--tw-ring-color': section.color,
        '--tw-ring-offset-color': '#0A0A0F'
      }}
    >
      {section.image && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${section.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: isHovered ? 0.35 : 0.25,
            transform: isHovered ? 'scale(1.22)' : 'scale(1)',
            transition: 'transform 0.6s ease, opacity 0.6s ease'
          }}
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHovered
            ? 'linear-gradient(180deg, rgba(8, 8, 13, 0.18) 0%, rgba(8, 8, 13, 0.1) 50%, rgba(8, 8, 13, 0.24) 100%)'
            : 'linear-gradient(180deg, rgba(8, 8, 13, 0.2) 0%, rgba(8, 8, 13, 0.12) 50%, rgba(8, 8, 13, 0.26) 100%)'
        }}
      />
      {/* Glow effect */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${section.color}15 0%, transparent 70%)`
          }}
        />
      )}
      
      <div className="relative z-10">
        <span 
          className="text-4xl block mb-3 transition-transform duration-300"
          style={{ transform: 'scale(1)' }}
        >
          {section.icon}
        </span>
        <h3 
          className="text-base font-semibold transition-colors duration-300"
          style={{ color: isHovered ? section.color : '#E8E8EC' }}
        >
          {section.label}
        </h3>
        <div 
          className="h-0.5 mt-3 transition-all duration-500"
          style={{ 
            backgroundColor: section.color,
            width: isHovered ? '100%' : '0%'
          }}
        />
        <p 
          className="text-xs mt-2 transition-all duration-300"
          style={{ 
            color: isHovered ? section.color : '#7a7a7a',
            opacity: isHovered ? 1 : 0.7
          }}
        >
          View projects →
        </p>
      </div>
    </button>
  );
};

// Contact Form Component
const ContactForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Using Web3Forms - free, no signup required
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Portfolio Contact from ${formData.name}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(20, 22, 28, 0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6 sm:p-8 rounded-2xl relative"
        style={{
          backgroundColor: 'rgba(20, 22, 28, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.55)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full flex items-center justify-center text-base transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: '#1a1a24', color: '#9aa0a6', '--tw-ring-color': '#00FFB2', '--tw-ring-offset-color': 'rgba(20, 22, 28, 0.92)' }}
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold mb-2" style={{ color: '#00FFB2' }}>
          Get in Touch
        </h3>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: '#7a7a7a' }}>
          Let's discuss your project
        </p>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div
              className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 255, 178, 0.12)', color: '#00FFB2' }}
            >
              ✓
            </div>
            <p className="text-base font-semibold mb-2" style={{ color: '#00FFB2' }}>Message Sent</p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#7a7a7a' }}>
              I'll get back to you soon.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-sm transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#E8E8EC', border: '1px solid rgba(255, 255, 255, 0.12)', '--tw-ring-color': '#00FFB2', '--tw-ring-offset-color': 'rgba(20, 22, 28, 0.92)' }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-2" style={{ color: '#666' }}>
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3.5 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-2 placeholder:text-[#6f6f75]"
                style={{
                  backgroundColor: '#1a1a24',
                  border: '1px solid #2f2f3a',
                  color: '#fff',
                  '--tw-ring-color': '#00FFB2'
                }}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-2" style={{ color: '#666' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3.5 rounded-lg text-sm outline-none transition-all duration-300 focus:ring-2 placeholder:text-[#6f6f75]"
                style={{
                  backgroundColor: '#1a1a24',
                  border: '1px solid #2f2f3a',
                  color: '#fff',
                  '--tw-ring-color': '#00FFB2'
                }}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider mb-2" style={{ color: '#666' }}>
                Message
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3.5 rounded-lg text-sm outline-none transition-all duration-300 resize-none focus:ring-2 placeholder:text-[#6f6f75]"
                style={{
                  backgroundColor: '#1a1a24',
                  border: '1px solid #2f2f3a',
                  color: '#fff',
                  '--tw-ring-color': '#00FFB2'
                }}
                placeholder="Tell me about your project..."
              />
            </div>

            {status === 'error' && (
              <p className="text-sm" style={{ color: '#FF3366' }}>
                Something went wrong. Please try again or email directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-4 rounded-full font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ backgroundColor: '#00FFB2', color: '#0A0A0F', '--tw-ring-color': '#00FFB2', '--tw-ring-offset-color': 'rgba(20, 22, 28, 0.92)' }}
            >
              {status === 'sending' ? (
                <span className="inline-flex items-center justify-center gap-2">
                  Sending
                  <span className="loading-dots" aria-hidden="true">
                    <span className="loading-dots__dot" />
                    <span className="loading-dots__dot" />
                    <span className="loading-dots__dot" />
                  </span>
                </span>
              ) : (
                'Send Message →'
              )}
            </button>

            <p className="text-center text-xs" style={{ color: '#7a7a7a' }}>
              Or email directly at{' '}
              <a
                href={`mailto:${profile.email}`}
                className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ color: '#00FFB2', '--tw-ring-color': '#00FFB2', '--tw-ring-offset-color': 'rgba(20, 22, 28, 0.92)' }}
              >
                {profile.email}
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

// Global Background (mouse-responsive glow)
const GlobalBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');

    const updateFlags = () => {
      setIsReducedMotion(motionQuery.matches);
      setIsCoarsePointer(pointerQuery.matches);
    };

    updateFlags();
    motionQuery.addEventListener('change', updateFlags);
    pointerQuery.addEventListener('change', updateFlags);

    return () => {
      motionQuery.removeEventListener('change', updateFlags);
      pointerQuery.removeEventListener('change', updateFlags);
    };
  }, []);

  useEffect(() => {
    if (isReducedMotion || isCoarsePointer) return;

    let raf = 0;
    const handleMouseMove = (e) => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setMousePos({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [isReducedMotion, isCoarsePointer]);

  const glowOpacity = isCoarsePointer ? 0.65 : 1;
  const greenAlpha = 0.09 * glowOpacity;
  const purpleAlpha = 0.06 * glowOpacity;
  const vignetteAlpha = (isCoarsePointer || isReducedMotion) ? 0.02 : 0.03;

  const x = isReducedMotion || isCoarsePointer ? 50 : mousePos.x * 100;
  const y = isReducedMotion || isCoarsePointer ? 50 : mousePos.y * 100;
  const x2 = isReducedMotion || isCoarsePointer ? 50 : 100 - mousePos.x * 50;
  const y2 = isReducedMotion || isCoarsePointer ? 50 : 100 - mousePos.y * 50;

  return (
    <div 
      className="fixed inset-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(120% 90% at 50% 0%, rgba(255, 255, 255, ${vignetteAlpha}) 0%, transparent 60%),
          radial-gradient(ellipse 80% 60% at ${x}% ${y}%, 
            rgba(0, 255, 178, ${greenAlpha}) 0%, transparent 70%),
          radial-gradient(ellipse 60% 80% at ${x2}% ${y2}%, 
            rgba(123, 97, 255, ${purpleAlpha}) 0%, transparent 70%)
        `
      }}
    />
  );
};

export default function JoaoSantosPortfolio() {
  const [activeSection, setActiveSection] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Categories loaded from portfolio-data.json
  const sections = categories;
  const sectionLabelClass = 'text-[11px] sm:text-sm tracking-widest uppercase mb-6';

  const getYouTubeIdFromUrl = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        const id = u.pathname.replace('/', '');
        return id || null;
      }
      if (u.hostname.includes('youtube.com')) {
        return u.searchParams.get('v');
      }
      return null;
    } catch {
      return null;
    }
  };

  const getVideoProvider = (url) => {
    if (!url) return 'other';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be') || u.hostname.includes('youtube.com')) return 'youtube';
      if (u.hostname.includes('dailymotion.com') || u.hostname.includes('dai.ly')) return 'dailymotion';
      return 'other';
    } catch {
      return 'other';
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        const id = u.pathname.replace('/', '');
        return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : null;
      }
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v');
        return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : null;
      }
      if (u.hostname.includes('dai.ly')) {
        const id = u.pathname.replace('/', '');
        return id ? `https://www.dailymotion.com/embed/video/${id}?autoplay=0&mute=0&start=0&queue-enable=0` : null;
      }
      if (u.hostname.includes('dailymotion.com')) {
        const parts = u.pathname.split('/').filter(Boolean);
        const videoIndex = parts.indexOf('video');
        const id = videoIndex !== -1 ? parts[videoIndex + 1] : null;
        return id ? `https://www.dailymotion.com/embed/video/${id}?autoplay=0&mute=0&start=0&queue-enable=0` : null;
      }
      return url;
    } catch {
      return null;
    }
  };

  const getDailymotionIdFromUrl = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes('dai.ly')) {
        const id = u.pathname.replace('/', '');
        return id || null;
      }
      if (u.hostname.includes('dailymotion.com')) {
        const parts = u.pathname.split('/').filter(Boolean);
        const videoIndex = parts.indexOf('video');
        const id = videoIndex !== -1 ? parts[videoIndex + 1] : null;
        return id || null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const YouTubeFrame = ({ url, title, accentColor }) => {
    const provider = getVideoProvider(url);
    const [isActivated, setIsActivated] = useState(provider === 'other');
    const [isLoaded, setIsLoaded] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const containerRef = useRef(null);
    const videoId = getYouTubeIdFromUrl(url);
    const dailymotionId = getDailymotionIdFromUrl(url);
    const embedUrl = getYouTubeEmbedUrl(url);
    const iframeAllow =
      provider === 'dailymotion'
        ? 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

    useEffect(() => {
      if (provider !== 'dailymotion' || !dailymotionId) return;
      let isActive = true;
      const oembedUrl = `https://api.dailymotion.com/video/${dailymotionId}?fields=thumbnail_url`;
      fetch(oembedUrl)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!isActive) return;
          if (data && data.thumbnail_url) setThumbnailUrl(data.thumbnail_url);
        })
        .catch(() => {
          // no-op: if thumbnail fetch fails, we just won't show a placeholder
        });
      return () => {
        isActive = false;
      };
    }, [provider, dailymotionId]);

    useEffect(() => {
      setIsActivated(provider === 'other');
    }, [provider]);

    useEffect(() => {
      if (provider !== 'youtube' || isActivated) return;
      const node = containerRef.current;
      if (!node) return;
      if (!('IntersectionObserver' in window)) {
        setIsActivated(true);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsActivated(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '400px 0px' }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }, [provider, isActivated]);

    return (
      <div
        ref={containerRef}
        className="mb-3 mt-3 w-full overflow-hidden rounded-xl border bg-black aspect-[16/10] sm:aspect-video relative"
        style={{
          borderColor: `${accentColor}70`,
          boxShadow: `0 0 0 1px ${accentColor}50`
        }}
      >
        {!isLoaded && provider === 'youtube' && videoId && (
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={`${title} thumbnail`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
        {!isLoaded && provider === 'dailymotion' && thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={`${title} thumbnail`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            fetchpriority="high"
            decoding="async"
          />
        )}
        {provider === 'dailymotion' && !isActivated && (
          <button
            type="button"
            onClick={() => setIsActivated(true)}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(10, 10, 15, 0.45)' }}
          >
            <span
              className="flex items-center justify-center"
              style={{
                width: '84px',
                height: '56px',
                backgroundColor: '#FF0000',
                borderRadius: '14px',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.35)'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                <polygon points="12,8 25,16 12,24" fill="#FFFFFF" />
              </svg>
            </span>
          </button>
        )}
        {isActivated && (
          <LazyEmbed className="w-full h-full" placeholderClassName="rounded-xl">
            <iframe
              className="h-full w-full"
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow={iframeAllow}
              loading={provider === 'youtube' ? 'eager' : 'lazy'}
              onLoad={() => setIsLoaded(true)}
              allowFullScreen
            />
          </LazyEmbed>
        )}
      </div>
    );
  };

  const renderSectionContent = () => {
    if (!activeSection) return null;
    const data = projectData[activeSection];
    const section = sections.find(s => s.id === activeSection);
    
    return (
      <div 
        className="fixed inset-0 z-50 overflow-auto"
        style={{ backgroundColor: 'rgba(20, 22, 28, 0.78)', backdropFilter: 'blur(6px)' }}
      >
        <div className="min-h-screen p-3 sm:p-6 md:p-12">
          <button
            onClick={() => setActiveSection(null)}
            className="fixed top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-2xl z-50 transition-all duration-300 hover:scale-110"
            style={{ 
              backgroundColor: '#1a1a24',
              border: `1px solid ${section.color}40`,
              color: section.color
            }}
          >
            ✕
          </button>

          <div className="w-full md:max-w-4xl md:mx-auto mb-10 sm:mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{section.icon}</span>
              <h2 className="text-lg sm:text-3xl md:text-4xl font-bold" style={{ color: section.color }}>
                {data.title}
              </h2>
            </div>
            <p className="text-xs sm:text-base" style={{ color: '#888888', whiteSpace: 'pre-line' }}>{data.description}</p>
          </div>

          <div className="w-full md:max-w-4xl md:mx-auto">

            {data.services && (
              <div className="p-5 sm:p-6 rounded-2xl mb-10 sm:mb-12" style={{ backgroundColor: '#14161c', border: `1px solid ${section.color}30` }}>
                <h3 className="text-xs sm:text-sm font-bold mb-4" style={{ color: section.color }}>Services</h3>
                <div className="flex flex-wrap gap-2">
                  {data.services.map((service, i) => (
                    <span key={i} className="px-4 py-2 rounded-full text-xs sm:text-sm" style={{ backgroundColor: '#1a1a24', color: '#ccc' }}>
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Game Audio Section */}
            {activeSection === 'game' && (
              <>
                <div className="mb-10 sm:mb-12">
                  <h3 className={sectionLabelClass} style={{ color: '#ccc' }}>Commercial Projects</h3>
                  <div className="grid gap-4 sm:gap-5">
                    {data.commercial.map((project, i) => (
                      <div key={i} className="p-5 sm:p-6 rounded-2xl" style={{ backgroundColor: '#14161c', border: '1px solid #1a1a24' }}>
                        <div className="flex items-start gap-4">
                          <span className="text-4xl w-12 flex-shrink-0 text-center">{project.emoji}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h4 className="text-xs sm:text-lg font-bold text-white">{project.type} - {project.title}</h4>
                              {project.award && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#FF6B00', color: '#000' }}>
                                  🏆 {project.award}
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm mb-2" style={{ color: section.color }}>{project.role}</p>
                            <p className="text-xs sm:text-sm" style={{ color: '#9aa0a6' }}>{project.description}</p>
                            <p className="text-xs sm:text-sm mt-2" style={{ color: '#9aa0a6' }}>
                              {project.client.startsWith('The ')
                                ? project.client
                                : `Client: ${project.client}`}
                            </p>
                          </div>
                        </div>
                        {project.youtubeUrl && (
                          <>
                            <YouTubeFrame
                              url={project.youtubeUrl}
                              title={`${project.type} - ${project.title} video`}
                              accentColor={section.color}
                            />
                            <a
                              href={project.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center text-[11px] sm:text-sm mt-2 mb-3 px-3 py-1 rounded-full min-h-[44px] sm:min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                              style={{
                                color: section.color,
                                border: `1px solid ${section.color}80`,
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                '--tw-ring-color': section.color,
                                '--tw-ring-offset-color': '#0A0A0F'
                              }}
                            >
                              Watch on YouTube
                            </a>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-10 sm:mb-12">
                  <h3 className={sectionLabelClass} style={{ color: '#ccc' }}>Personal Projects</h3>
                  <div className="grid gap-4 sm:gap-5">
                    {data.personal.map((project, i) => (
                      <div key={i} className="p-5 sm:p-6 rounded-2xl" style={{ backgroundColor: '#14161c', border: '1px solid #1a1a24' }}>
                        <div className="flex items-start gap-4">
                          <span className="text-3xl w-12 flex-shrink-0 text-center">{project.emoji}</span>
                          <div className="flex-1">
                            <h4 className="text-xs sm:text-lg font-bold text-white mb-1">{project.title}</h4>
                            <p className="text-xs sm:text-sm mb-2" style={{ color: section.color }}>{project.role}</p>
                            <p className="text-xs sm:text-sm" style={{ color: '#9aa0a6' }}>{project.description}</p>
                          </div>
                        </div>
                        {project.youtubeUrl && (
                          <>
                            <YouTubeFrame
                              url={project.youtubeUrl}
                              title={`${project.title} video`}
                              accentColor={section.color}
                            />
                            <a
                              href={project.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center text-[11px] sm:text-sm mt-2 mb-3 px-3 py-1 rounded-full min-h-[44px] sm:min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                              style={{
                                color: section.color,
                                border: `1px solid ${section.color}80`,
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                '--tw-ring-color': section.color,
                                '--tw-ring-offset-color': '#0A0A0F'
                              }}
                            >
                              Watch on YouTube
                            </a>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </>
            )}

            {/* Music Section with SoundCloud Embeds */}
            {activeSection === 'music' && (
              <>
                <div className="space-y-8 sm:space-y-10 mb-12 sm:mb-16">
                  {data.playlists.map((playlist, i) => (
                    <div
                      key={i}
                      className="pb-6 sm:pb-8 border-b border-[#1a1a24] last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 mb-4 sm:mb-5">
                        <span className="text-3xl">{playlist.emoji}</span>
                        <h3 className="text-base sm:text-2xl font-semibold text-white tracking-tight">{playlist.title}</h3>
                      </div>
                      <SoundCloudEmbed
                        url={playlist.soundcloudUrl}
                        title={playlist.title}
                        height={320}
                        featured={i === 0}
                        compact={false}
                        accentColor={section.color}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
                  <div
                    className="p-5 sm:p-6 rounded-2xl"
                    style={{
                      backgroundColor: '#14161c',
                      border: '1px solid #1a1a24',
                      boxShadow: `0 10px 24px rgba(0,0,0,0.25), 0 0 0 1px ${section.color}70`
                    }}
                  >
                    <h3 className="text-xs sm:text-base font-semibold mb-4 tracking-wide" style={{ color: section.color }}>
                      Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.info.genres.map((genre, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs sm:text-sm"
                          style={{ backgroundColor: '#1a1a24', color: '#ccc' }}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="p-5 sm:p-6 rounded-2xl"
                    style={{
                      backgroundColor: '#14161c',
                      border: '1px solid #1a1a24',
                      boxShadow: `0 10px 24px rgba(0,0,0,0.25), 0 0 0 1px ${section.color}70`
                    }}
                  >
                    <h3 className="text-xs sm:text-base font-semibold mb-4 tracking-wide" style={{ color: section.color }}>
                      Tools
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#ccc' }}>
                      {data.info.tools.join(', ')}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Mixing Section with YouTube Embeds */}
            {activeSection === 'mixing' && (
              <>
                <div className="mb-10 sm:mb-12">
                  <h3 className={sectionLabelClass} style={{ color: '#ccc' }}>Commercial Projects</h3>
                  <div className="space-y-6 sm:space-y-8">
                    {data.projects.map((project, i) => (
                      <div key={i} className="p-5 sm:p-6 rounded-2xl" style={{ backgroundColor: '#14161c', border: '1px solid #1a1a24' }}>
                        <div className="flex items-start gap-4 mb-4">
                          <span className="text-4xl w-12 flex-shrink-0 text-center">{project.emoji}</span>
                          <div className="flex-1">
                            <h4 className="text-xs sm:text-lg font-bold text-white mb-1">{project.title}</h4>
                            <p className="text-xs sm:text-sm mb-2" style={{ color: section.color }}>{project.role}</p>
                            <p className="text-xs sm:text-sm" style={{ color: '#9aa0a6' }}>{project.description}</p>
                          </div>
                        </div>
                        {project.youtubeId && (
                          <YouTubeEmbed
                            videoId={project.youtubeId}
                            title={project.title}
                            featured={i === 0}
                            accentColor={section.color}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </>
            )}

            {/* Vocal Section with SoundCloud */}
            {activeSection === 'vocal' && (
              <>
                <div className="mb-10 sm:mb-12">
                  <h3 className={sectionLabelClass} style={{ color: '#ccc' }}>Commercial Projects</h3>
                  <div className="space-y-5 sm:space-y-6">
                    {data.projects.map((project, i) => (
                      <div key={i} className="p-5 sm:p-6 rounded-2xl" style={{ backgroundColor: '#14161c', border: '1px solid #1a1a24' }}>
                        <div className="flex items-start gap-4 mb-4">
                          <span className="text-4xl w-12 flex-shrink-0 text-center">{project.emoji}</span>
                          <div className="flex-1">
                            <h4 className="text-xs sm:text-lg font-bold text-white mb-1">{project.title}</h4>
                            <p className="text-xs sm:text-sm mb-2" style={{ color: section.color }}>{project.role}</p>
                            {project.client && (
                              <p className="text-xs sm:text-sm mb-2" style={{ color: '#9aa0a6' }}>
                                {project.client.startsWith('The ')
                                  ? project.client
                                  : `Client: ${project.client}`}
                              </p>
                            )}
                            {project.description && <p className="text-xs sm:text-sm mb-3" style={{ color: '#9aa0a6' }}>{project.description}</p>}
                            {project.responsibilities && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {project.responsibilities.map((r, j) => (
                                  <span key={j} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#1a1a24', color: '#9aa0a6' }}>
                                    {r}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {project.soundcloudUrl && (
                          <SoundCloudEmbed
                            url={project.soundcloudUrl}
                            title={project.title}
                            height={200}
                            featured={i === 0}
                            accentColor={section.color}
                          />
                        )}
                        {project.youtubeId && (
                          <YouTubeEmbed
                            videoId={project.youtubeId}
                            title={project.title}
                            featured={i === 0}
                            accentColor={section.color}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </>
            )}

            {/* Visual Media Section */}
            {activeSection === 'media' && (
              <>
                <div className="mb-10 sm:mb-12">
                  <h3 className={sectionLabelClass} style={{ color: '#ccc' }}>Commercial Projects</h3>
                  <div className="space-y-5 sm:space-y-6">
                    {data.commercial.map((project, i) => (
                      <div key={i} className="p-5 sm:p-6 rounded-2xl" style={{ backgroundColor: '#14161c', border: '1px solid #1a1a24' }}>
                        <div className="flex items-start gap-4 mb-4">
                          <span className="text-4xl w-12 flex-shrink-0 text-center">{project.emoji}</span>
                          <div className="flex-1">
                            <h4 className="text-xs sm:text-lg font-bold text-white mb-1">{project.title}</h4>
                            <p className="text-xs sm:text-sm mb-2" style={{ color: section.color }}>{project.role}</p>
                            <p className="text-xs sm:text-sm mb-2" style={{ color: '#9aa0a6' }}>{project.description}</p>
                            <p className="text-xs sm:text-sm" style={{ color: '#9aa0a6' }}>
                              {project.client.startsWith('The ')
                                ? project.client
                                : `Client: ${project.client}`}
                            </p>
                          </div>
                        </div>
                        {project.youtubeId && (
                          <YouTubeEmbed
                            videoId={project.youtubeId}
                            title={project.title}
                            featured={i === 0}
                            accentColor={section.color}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-10 sm:mb-12">
                  <h3 className={sectionLabelClass} style={{ color: '#ccc' }}>Personal Projects</h3>
                  <div className="space-y-5 sm:space-y-6">
                    {data.personal.map((project, i) => (
                      <div key={i} className="p-5 sm:p-6 rounded-2xl" style={{ backgroundColor: '#14161c', border: '1px solid #1a1a24' }}>
                        <div className="flex items-start gap-4 mb-4">
                          <span className="text-3xl w-12 flex-shrink-0 text-center">{project.emoji}</span>
                          <div className="flex-1">
                            <h4 className="text-xs sm:text-lg font-bold text-white mb-1">{project.title}</h4>
                            <p className="text-xs sm:text-sm mb-2" style={{ color: section.color }}>{project.role}</p>
                            <p className="text-xs sm:text-sm" style={{ color: '#9aa0a6' }}>{project.description}</p>
                          </div>
                        </div>
                        {project.youtubeId && (
                          <YouTubeEmbed
                            videoId={project.youtubeId}
                            title={project.title}
                            featured={i === 0}
                            accentColor={section.color}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </>
            )}

            <button
              onClick={() => setActiveSection(null)}
              className="mt-14 px-7 py-3.5 rounded-full text-sm tracking-wider uppercase flex items-center gap-2 mx-auto transition-all duration-300 hover:scale-105 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${section.color}80`,
                color: section.color,
                boxShadow: `0 10px 24px rgba(0,0,0,0.25)`,
                '--tw-ring-color': section.color,
                '--tw-ring-offset-color': '#0A0A0F'
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen text-white overflow-x-hidden relative"
      style={{ 
        backgroundColor: '#14161c',
        fontFamily: "ui-monospace, 'SF Mono', monospace"
      }}
    >
      <GlobalBackground />

      {renderSectionContent()}

      <ContactForm isOpen={showContactForm} onClose={() => setShowContactForm(false)} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <div 
          className="relative z-10 text-center"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease-out'
          }}
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
            <img
              src="/images/profile.jpeg"
              alt={`${profile.name} profile`}
              loading="lazy"
              decoding="async"
              width="96"
              height="96"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)'
              }}
            />
            <h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black"
              style={{
                fontFamily: "system-ui, sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #00FFB2 0%, #ffffff 50%, #7B61FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {profile.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm tracking-widest uppercase mb-6 sm:mb-8" style={{ color: '#9aa0a6' }}>
            {profile.tagline.map((tag, i) => (
              <span key={i}>
                {i > 0 && <span style={{ color: i % 2 === 1 ? '#00FFB2' : '#7B61FF' }} className="mr-3">◆</span>}
                {tag}
              </span>
            ))}
          </div>

          <p className="max-w-lg mx-auto text-sm mb-8 sm:mb-10" style={{ color: '#7a7a7a' }}>
            {profile.bio}
          </p>

          {/* Subtle decorative waveform */}
          <div className="flex justify-center">
            <svg
              className="hero-waveform w-full max-w-[420px] h-auto"
              width="420"
              height="110"
              viewBox="0 0 420 110"
              role="presentation"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="heroWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00FFB2" />
                  <stop offset="50%" stopColor="#7FFFD4" />
                  <stop offset="100%" stopColor="#1BFFC1" />
                </linearGradient>
              </defs>
              <g className="hero-waveform__bars">
                {Array.from({ length: 16 }).map((_, i) => (
                  <rect
                    key={i}
                    className="hero-waveform__bar"
                    x={40.5 + i * 22}
                    y="14"
                    width="9"
                    height="82"
                    rx="4"
                    fill="url(#heroWaveGrad)"
                  />
                ))}
              </g>
            </svg>
          </div>
        </div>

        <div 
          className="absolute bottom-10 left-1/2 text-center hero-explore"
          style={{ 
            transform: 'translateX(-50%)',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-out 0.5s'
          }}
        >
          <p className="text-sm tracking-widest mb-3 hero-explore__text" style={{ color: '#7a7a7a' }}>EXPLORE WORK</p>
          <div className="w-px h-10 mx-auto hero-explore__line" style={{ background: 'linear-gradient(to bottom, #7a7a7a, transparent)' }} />
        </div>
      </section>

      {/* Services Section with Animated Cards */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm tracking-widest uppercase text-center mb-12" style={{ color: '#7a7a7a' }}>
            Click to explore each category
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 category-grid">
            {sections.map((section) => (
              <CategoryCard
                key={section.id}
                section={section}
                isHovered={hoveredSection === section.id}
                onHover={() => setHoveredSection(section.id)}
                onLeave={() => setHoveredSection(null)}
                onClick={() => setActiveSection(section.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#fff' }}>
            Ready to make your project
            <span style={{ color: '#00FFB2' }}> sound unforgettable?</span>
          </h2>
          <p className="mb-8" style={{ color: '#9aa0a6' }}>
            Available for freelance work and collaborations.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowContactForm(true)}
              className="px-8 py-4 rounded-full font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px]"
              style={{ backgroundColor: '#00FFB2', color: '#0A0A0F', '--tw-ring-color': '#00FFB2', '--tw-ring-offset-color': '#0A0A0F' }}
            >
              Get in Touch →
            </button>
            
            <div className="flex gap-3">
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ backgroundColor: '#fff', boxShadow: '0 6px 16px rgba(0,0,0,0.18)', '--tw-ring-color': '#00FFB2', '--tw-ring-offset-color': '#0A0A0F' }}
                >
                  <img
                    src="/icons/social/linkedin.png"
                    alt="LinkedIn"
                    loading="lazy"
                    decoding="async"
                    width="24"
                    height="24"
                    className="w-6 h-6"
                  />
                </a>
              )}
              {profile.socialLinks.soundcloud && (
                <a
                  href={profile.socialLinks.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="SoundCloud"
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ backgroundColor: '#fff', boxShadow: '0 6px 16px rgba(0,0,0,0.18)', '--tw-ring-color': '#00FFB2', '--tw-ring-offset-color': '#0A0A0F' }}
                >
                  <img
                    src="/icons/social/soundcloud.png"
                    alt="SoundCloud"
                    loading="lazy"
                    decoding="async"
                    width="24"
                    height="24"
                    className="w-6 h-6"
                  />
                </a>
              )}
              {profile.socialLinks.youtube && (
                <a
                  href={profile.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ backgroundColor: '#fff', boxShadow: '0 6px 16px rgba(0,0,0,0.18)', '--tw-ring-color': '#00FFB2', '--tw-ring-offset-color': '#0A0A0F' }}
                >
                  <img
                    src="/icons/social/youtube.png"
                    alt="YouTube"
                    loading="lazy"
                    decoding="async"
                    width="24"
                    height="24"
                    className="w-6 h-6"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6" style={{ borderTop: '1px solid #1a1a24' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: '#7a7a7a' }}>
          <span>© 2026 João Santos. Game Audio Designer & Music Producer.</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00FFB2', boxShadow: '0 0 8px #00FFB2' }} />
            Available for projects
          </span>
        </div>
      </footer>
    </div>
  );
}
