export function getVideoProvider(url) {
  if (!url) return 'other';
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('youtu.be') || parsedUrl.hostname.includes('youtube.com')) return 'youtube';
    if (parsedUrl.hostname.includes('dailymotion.com') || parsedUrl.hostname.includes('dai.ly')) return 'dailymotion';
    return 'other';
  } catch {
    return 'other';
  }
}
