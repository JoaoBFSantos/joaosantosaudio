export default function HeroSection({ profile, isLoaded }) {
  return (
    <section className="hero-section relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-12 sm:py-16">
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
            loading="eager"
            fetchPriority="high"
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
              fontFamily: 'system-ui, sans-serif',
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
          {profile.tagline.map((tag, index) => (
            <span key={tag}>
              {index > 0 && <span style={{ color: index % 2 === 1 ? '#00FFB2' : '#7B61FF' }} className="mr-3">◆</span>}
              {tag}
            </span>
          ))}
        </div>

        <p className="max-w-lg mx-auto text-sm sm:text-base leading-relaxed mb-8 sm:mb-10" style={{ color: '#8f949d' }}>
          {profile.bio}
        </p>

        <div className="flex justify-center">
          <svg
            className="hero-waveform h-auto"
            style={{ width: 'min(92vw, 760px)' }}
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
              {Array.from({ length: 16 }).map((_, index) => (
                <rect
                  key={index}
                  className="hero-waveform__bar"
                  x={40.5 + index * 22}
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
        className="relative z-10 mt-8 sm:mt-10 text-center hero-explore"
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease-out 0.5s' }}
      >
        <p className="text-sm tracking-widest mb-3 hero-explore__text" style={{ color: '#8f949d' }}>EXPLORE WORK</p>
        <div className="w-px h-8 sm:h-10 mx-auto hero-explore__line" style={{ background: 'linear-gradient(to bottom, #8f949d, transparent)' }} />
      </div>
    </section>
  );
}
