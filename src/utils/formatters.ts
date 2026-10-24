/**
 * Utility functions for formatting dates, times, currencies, and location strings.
 */

export function formatEventDate(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoDateString;
  }
}

export function formatShortDate(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoDateString;
  }
}

export function formatEventTimeRange(startIso: string, endIso: string): string {
  try {
    const start = new Date(startIso);
    const end = new Date(endIso);
    const startTime = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const endTime = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${startTime} – ${endTime}`;
  } catch {
    return 'Time TBA';
  }
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  return `$${price.toFixed(0)}`;
}

export function getMapsSearchUrl(address: string, city: string = 'Metro City'): string {
  const query = encodeURIComponent(`${address}, ${city}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
