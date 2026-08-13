export function CategoryCard({ section, isHovered, onHover, onLeave, onClick }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="p-6 rounded-2xl cursor-pointer transition-all duration-300 text-left relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        backgroundColor: '#14161c',
        border: `1px solid ${isHovered ? `${section.color}50` : '#1a1a24'}`,
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? `0 25px 50px rgba(0,0,0,0.5), 0 0 30px ${section.color}20`
          : '0 10px 30px rgba(0,0,0,0.3)',
        '--tw-ring-color': section.color,
        '--tw-ring-offset-color': '#0A0A0F'
      }}
    >
      {section.image && (
        <img
          src={section.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
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
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${section.color}15 0%, transparent 70%)` }}
        />
      )}

      <div className="relative z-10">
        <span className="text-4xl block mb-3 transition-transform duration-300">{section.icon}</span>
        <h3
          className="text-base font-semibold transition-colors duration-300"
          style={{ color: isHovered ? section.color : '#E8E8EC' }}
        >
          {section.label}
        </h3>
        <div
          className="h-0.5 mt-3 transition-all duration-500"
          style={{ backgroundColor: section.color, width: isHovered ? '100%' : '0%' }}
        />
        <p
          className="text-xs mt-2 transition-all duration-300"
          style={{ color: isHovered ? section.color : '#8f949d', opacity: isHovered ? 1 : 0.7 }}
        >
          View projects →
        </p>
      </div>
    </button>
  );
}

export function ProjectCard({ children, className = '' }) {
  return (
    <article
      className={`${className} rounded-2xl`}
      style={{ backgroundColor: '#14161c', border: '1px solid #242630' }}
    >
      {children}
    </article>
  );
}
