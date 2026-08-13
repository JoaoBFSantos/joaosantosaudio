import { useState, useEffect, useRef, useCallback } from 'react';
import portfolioData from './portfolio-data.json';
import CategoryNavigation from './components/CategoryNavigation';
import ContactForm from './components/ContactForm';
import GlobalBackground from './components/GlobalBackground';
import HeroSection from './components/HeroSection';
import { CategoryCard } from './components/PortfolioCards';
import PortfolioSectionBody from './components/sections/PortfolioSectionBody';
import { trapKeyboardFocus } from './utils/focus';

const { profile, categories, projects: projectData } = portfolioData;

const sectionHashes = {
  game: 'game-audio',
  music: 'music',
  mixing: 'mix-master',
  vocal: 'vocal-edit',
  media: 'visual-media'
};

const sectionIdsByHash = Object.fromEntries(
  Object.entries(sectionHashes).map(([sectionId, hash]) => [hash, sectionId])
);

const getSectionFromLocation = () => {
  if (typeof window === 'undefined') return null;
  return sectionIdsByHash[window.location.hash.replace(/^#/, '')] ?? null;
};

export default function JoaoSantosPortfolio() {
  const [activeSection, setActiveSection] = useState(getSectionFromLocation);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const sectionPanelRef = useRef(null);
  const sectionBackButtonRef = useRef(null);
  const closeContactForm = useCallback(() => setShowContactForm(false), []);
  const openSection = useCallback((sectionId) => {
    const hash = sectionHashes[sectionId];
    if (!hash) return;
    const nextUrl = `${window.location.pathname}${window.location.search}#${hash}`;
    if (getSectionFromLocation()) {
      const openedFromHome = Boolean(window.history.state?.portfolioOpenedFromHome);
      window.history.replaceState({ portfolioSection: sectionId, portfolioOpenedFromHome: openedFromHome }, '', nextUrl);
    } else {
      window.history.pushState({ portfolioSection: sectionId, portfolioOpenedFromHome: true }, '', nextUrl);
    }
    setActiveSection(sectionId);
  }, []);
  const closeSection = useCallback(() => {
    if (window.history.state?.portfolioOpenedFromHome) {
      window.history.back();
      return;
    }
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`);
    setActiveSection(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  const isSectionOpen = Boolean(activeSection);
  const hasOpenDialog = isSectionOpen || showContactForm;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const syncSectionFromUrl = () => {
      const nextSection = getSectionFromLocation();
      setActiveSection(nextSection);
      if (!nextSection) {
        window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
      }
    };
    window.addEventListener('popstate', syncSectionFromUrl);
    window.addEventListener('hashchange', syncSectionFromUrl);
    return () => {
      window.removeEventListener('popstate', syncSectionFromUrl);
      window.removeEventListener('hashchange', syncSectionFromUrl);
    };
  }, []);

  useEffect(() => {
    const sectionTitle = activeSection ? projectData[activeSection]?.title : null;
    document.title = sectionTitle
      ? `${sectionTitle} — João Santos Audio`
      : 'João Santos — Game Audio Designer & Music Producer';
  }, [activeSection]);

  useEffect(() => {
    if (!activeSection) return;
    const activeCategoryButton = sectionPanelRef.current?.querySelector(
      `[data-section-id="${activeSection}"]`
    );
    activeCategoryButton?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeSection]);

  useEffect(() => {
    if (!hasOpenDialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [hasOpenDialog]);

  useEffect(() => {
    if (!isSectionOpen) return;
    const previouslyFocusedElement = document.activeElement;
    const focusFrame = window.requestAnimationFrame(() => sectionBackButtonRef.current?.focus({ preventScroll: true }));
    return () => {
      window.cancelAnimationFrame(focusFrame);
      previouslyFocusedElement?.focus?.();
    };
  }, [isSectionOpen]);

  useEffect(() => {
    if (!isSectionOpen || showContactForm) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSection();
        return;
      }
      trapKeyboardFocus(event, sectionPanelRef.current);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeSection, isSectionOpen, showContactForm]);

  // Categories loaded from portfolio-data.json
  const sections = categories;
  const projectClasses = {
    sectionLabel: 'text-xs sm:text-sm tracking-widest uppercase mb-6 font-semibold',
    title: 'text-[15px] sm:text-xl font-bold text-white leading-snug',
    role: 'text-sm sm:text-base mb-2 font-medium',
    description: 'text-sm sm:text-base leading-relaxed',
    meta: 'text-xs sm:text-sm leading-relaxed',
    emoji: 'text-2xl sm:text-4xl w-8 sm:w-12 flex-shrink-0 text-center leading-none'
  };
  const categoryContactCopy = {
    game: 'Need audio for your game?',
    music: 'Need original music for your project?',
    mixing: 'Ready to give your music a professional finish?',
    vocal: 'Need clean, polished vocals?',
    media: 'Need sound that brings your visuals to life?'
  };

  const renderSectionContent = () => {
    if (!activeSection) return null;
    const data = projectData[activeSection];
    const section = sections.find(s => s.id === activeSection);
    
    return (
      <div 
        ref={sectionPanelRef}
        className="fixed inset-0 z-50 overflow-auto overscroll-contain"
        style={{ backgroundColor: '#0A0A0F' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="portfolio-section-title"
        aria-hidden={showContactForm ? 'true' : undefined}
        inert={showContactForm ? true : undefined}
        tabIndex={-1}
      >
        <GlobalBackground intensity={0.72} />

        <CategoryNavigation
          sections={sections}
          activeSection={activeSection}
          accentColor={section.color}
          backButtonRef={sectionBackButtonRef}
          onBack={closeSection}
          onSelect={(sectionId) => {
            sectionPanelRef.current?.scrollTo({ top: 0, behavior: 'auto' });
            openSection(sectionId);
          }}
        />

        <div className="relative z-10 min-h-screen px-4 py-8 sm:px-6 sm:py-12 md:py-16">
          <div className="w-full md:max-w-4xl md:mx-auto mb-10 sm:mb-12">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <span className="text-3xl sm:text-5xl" aria-hidden="true">{section.icon}</span>
              <h2 id="portfolio-section-title" className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: section.color }}>
                {data.title}
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed max-w-3xl" style={{ color: '#9aa0a6', whiteSpace: 'pre-line' }}>{data.description}</p>
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
            
            <PortfolioSectionBody
              activeSection={activeSection}
              data={data}
              section={section}
              classes={projectClasses}
            />

            <div
              className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl text-center"
              style={{
                background: `linear-gradient(135deg, ${section.color}14 0%, rgba(20, 22, 28, 0.96) 58%)`,
                border: `1px solid ${section.color}45`
              }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                {categoryContactCopy[activeSection]}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: '#9aa0a6' }}>
                Let&apos;s discuss the sound, scope and creative direction of your project.
              </p>
              <button
                onClick={() => setShowContactForm(true)}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-bold tracking-wider uppercase min-h-[44px] transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundColor: section.color,
                  color: '#0A0A0F',
                  '--tw-ring-color': section.color,
                  '--tw-ring-offset-color': '#0A0A0F'
                }}
              >
                Get in Touch →
              </button>
            </div>

            <button
              onClick={closeSection}
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
      {renderSectionContent()}

      {showContactForm && <ContactForm email={profile.email} onClose={closeContactForm} />}

      <div aria-hidden={hasOpenDialog ? 'true' : undefined} inert={hasOpenDialog ? true : undefined}>
        {!activeSection && <GlobalBackground />}

        <HeroSection profile={profile} isLoaded={isLoaded} />

      {/* Services Section with Animated Cards */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm tracking-widest uppercase text-center mb-12" style={{ color: '#8f949d' }}>
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
                onClick={() => openSection(section.id)}
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
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: '#8f949d' }}>
          <span>© 2026 João Santos. Game Audio Designer & Music Producer.</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00FFB2', boxShadow: '0 0 8px #00FFB2' }} />
            Available for projects
          </span>
        </div>
        </footer>
      </div>
    </div>
  );
}
