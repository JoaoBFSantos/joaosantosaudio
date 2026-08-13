export default function CategoryNavigation({ sections, activeSection, accentColor, backButtonRef, onBack, onSelect }) {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: 'rgba(10, 10, 15, 0.96)', borderColor: '#242630', backdropFilter: 'blur(18px)' }}
    >
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <nav className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0" aria-label="Portfolio categories">
          <div className="flex w-max min-w-full items-center justify-start gap-2 py-3 sm:justify-center sm:flex-wrap">
            <button
              ref={backButtonRef}
              onClick={onBack}
              className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                color: '#F3F3F6',
                backgroundColor: '#1B1E28',
                borderColor: '#3A3E4B',
                boxShadow: '0 5px 14px rgba(0, 0, 0, 0.24)',
                '--tw-ring-color': accentColor,
                '--tw-ring-offset-color': '#0A0A0F'
              }}
              aria-label="Back to portfolio home"
            >
              <span aria-hidden="true">←</span>
              <span className="sm:hidden">Home</span>
              <span className="hidden sm:inline">Back to Home</span>
            </button>

            {sections.map((section) => {
              const isActive = section.id === activeSection;
              return (
                <button
                  key={section.id}
                  data-section-id={section.id}
                  onClick={() => onSelect(section.id)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    color: isActive ? '#0A0A0F' : '#B8BBC2',
                    backgroundColor: isActive ? section.color : '#171922',
                    border: `1px solid ${isActive ? section.color : '#292c36'}`,
                    '--tw-ring-color': section.color,
                    '--tw-ring-offset-color': '#0A0A0F'
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span aria-hidden="true">{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
        <span className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-[#0A0A0F] to-transparent sm:hidden" aria-hidden="true" />
        <span className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-[#0A0A0F] to-transparent sm:hidden" aria-hidden="true" />
      </div>
    </header>
  );
}
