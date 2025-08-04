// ========== Server-side ==========

export function extractIP(headers) {
    const xForwardedFor = headers.get('x-forwarded-for');
    return xForwardedFor ? xForwardedFor.split(',')[0] : 'Unknown';
  }