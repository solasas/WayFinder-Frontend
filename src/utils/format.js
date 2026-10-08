export function formatDistance(meters) {
  return meters < 1000
    ? { value: Math.round(meters), unit: 'm' }
    : { value: (meters / 1000).toFixed(1), unit: 'km' }
}

export function formatDuration(secs) {
  if (secs < 60) return { value: Math.max(1, Math.round(secs)), unit: 'sec' }
  return { value: Math.round(secs / 60), unit: 'min' }
}
