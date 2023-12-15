export function formatHours(hours: number) {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 60) {
    return `${wholeHours + 1}h 0m`;
  }

  return `${wholeHours}h ${minutes}m`;
}