import { useEffect, useRef, useState } from 'react';

const dailymotionThumbnailCache = new Map();

function LazyEmbed({ className = '', placeholderClassName = '', style, children }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(() => !('IntersectionObserver' in window));

  useEffect(() => {
    if (isVisible) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      });
    }, { rootMargin: '200px 0px' });

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div ref={ref} className={className} style={style}>
      {isVisible ? children : <div className={`w-full h-full bg-[#0f1117] animate-pulse ${placeholderClassName}`} />}
    </div>
  );
}

export function SoundCloudEmbed({ url, title, height = 300, featured = false, compact = true, accentColor = '#1a1a24' }) {
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
      <div className="relative rounded-xl overflow-hidden" style={{ backgroundColor: '#14161c', height: finalHeight }}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0f1117] text-xs text-[#9aa0a6]">Loading audio...</div>
        )}
        <LazyEmbed className="w-full h-full" placeholderClassName="rounded-xl">
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
}

export function YouTubeEmbed({ videoId, title, featured = false, accentColor = '#1a1a24' }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActivated, setIsActivated] = useState(() => !('IntersectionObserver' in window));
  const containerRef = useRef(null);

  useEffect(() => {
    if (isActivated) return;
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsActivated(true);
          observer.disconnect();
        }
      });
    }, { rootMargin: '400px 0px' });
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
}

export function YouTubeExternalCard({ videoId, title, accentColor = '#1a1a24' }) {
  return (
    <div className="mt-3 sm:mt-2">
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-full overflow-hidden rounded-xl aspect-[16/10] sm:aspect-video focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          backgroundColor: '#14161c',
          boxShadow: `0 0 0 1px ${accentColor}70`,
          '--tw-ring-color': accentColor,
          '--tw-ring-offset-color': '#0A0A0F'
        }}
        aria-label={`Watch ${title} on YouTube`}
      >
        <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute inset-0 bg-black/45 transition-colors duration-300 group-hover:bg-black/55" aria-hidden="true" />
        <span
          className="absolute left-1/2 top-1/2 inline-flex min-h-[44px] -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold text-white shadow-xl transition-transform duration-300 group-hover:-translate-y-[55%] sm:text-sm"
          style={{ backgroundColor: accentColor, color: '#0A0A0F' }}
        >
          <span aria-hidden="true">▶</span>
          Watch on YouTube
        </span>
      </a>
    </div>
  );
}

function getVideoDetails(url) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtu.be')) {
      const id = parsedUrl.pathname.replace('/', '');
      return { provider: 'youtube', id, embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` };
    }
    if (parsedUrl.hostname.includes('youtube.com')) {
      const id = parsedUrl.searchParams.get('v');
      return { provider: 'youtube', id, embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` };
    }
    const parts = parsedUrl.pathname.split('/').filter(Boolean);
    const id = parsedUrl.hostname.includes('dai.ly') ? parts[0] : parts[parts.indexOf('video') + 1];
    if (parsedUrl.hostname.includes('dailymotion.com') || parsedUrl.hostname.includes('dai.ly')) {
      return { provider: 'dailymotion', id, embedUrl: `https://www.dailymotion.com/embed/video/${id}?autoplay=0&mute=0&start=0&queue-enable=0` };
    }
    return { provider: 'other', id: null, embedUrl: url };
  } catch {
    return { provider: 'other', id: null, embedUrl: null };
  }
}

export function VideoFrame({ url, title, accentColor }) {
  const { provider, id, embedUrl } = getVideoDetails(url);
  const [isActivated, setIsActivated] = useState(() => provider === 'other' || !('IntersectionObserver' in window));
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(() => dailymotionThumbnailCache.get(id) ?? null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (provider !== 'dailymotion' || !id || dailymotionThumbnailCache.has(id)) return;
    let isActive = true;
    fetch(`https://api.dailymotion.com/video/${id}?fields=thumbnail_url`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.thumbnail_url) {
          dailymotionThumbnailCache.set(id, data.thumbnail_url);
          if (isActive) setThumbnailUrl(data.thumbnail_url);
        }
      })
      .catch(() => {});
    return () => { isActive = false; };
  }, [provider, id]);

  useEffect(() => {
    if (provider !== 'youtube' || isActivated) return;
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsActivated(true);
          observer.disconnect();
        }
      });
    }, { rootMargin: '400px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [provider, isActivated]);

  const iframeAllow = provider === 'dailymotion'
    ? 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

  return (
    <div
      ref={containerRef}
      className="mb-3 mt-3 w-full overflow-hidden rounded-xl border bg-black aspect-[16/10] sm:aspect-video relative"
      style={{ borderColor: `${accentColor}70`, boxShadow: `0 0 0 1px ${accentColor}50` }}
    >
      {!isLoaded && provider === 'youtube' && id && (
        <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={`${title} thumbnail`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
      )}
      {!isLoaded && provider === 'dailymotion' && thumbnailUrl && (
        <img src={thumbnailUrl} alt={`${title} thumbnail`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
      )}
      {provider === 'dailymotion' && !isActivated && (
        <button type="button" onClick={() => setIsActivated(true)} aria-label="Play video" className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(10, 10, 15, 0.45)' }}>
          <span className="flex items-center justify-center" style={{ width: 84, height: 56, backgroundColor: '#FF0000', borderRadius: 14, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.35)' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><polygon points="12,8 25,16 12,24" fill="#FFFFFF" /></svg>
          </span>
        </button>
      )}
      {isActivated && embedUrl && (
        <LazyEmbed className="w-full h-full" placeholderClassName="rounded-xl">
          <iframe className="h-full w-full" src={embedUrl} title={title} frameBorder="0" allow={iframeAllow} loading={provider === 'youtube' ? 'eager' : 'lazy'} onLoad={() => setIsLoaded(true)} allowFullScreen />
        </LazyEmbed>
      )}
    </div>
  );
}
