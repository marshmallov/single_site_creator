'use client'

// ========== Client-side ==========

export function getClientVisitorData() {
  if (typeof window === 'undefined') return {};

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    platform: navigator.platform,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export function getGeolocation(callback) {
  if (!navigator.geolocation) return callback(null);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      callback({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    },
    () => callback(null),
    { timeout: 3000 }
  );
}

// ========== Server-side ==========

export function extractIP(headers) {
  const xForwardedFor = headers.get('x-forwarded-for');
  return xForwardedFor ? xForwardedFor.split(',')[0] : 'Unknown';
}