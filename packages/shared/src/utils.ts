/**
 * Format a date to a string in the format "YYYY-MM-DD HH:MM:SS"
 */
export function formatDate(date: Date): string {
  return date.toISOString().replace("T", " ").substring(0, 19);
}

/**
 * Calculate the duration between two dates in milliseconds
 */
export function calculateDuration(startTime: Date, endTime: Date): number {
  return endTime.getTime() - startTime.getTime();
}

/**
 * Format milliseconds to a human-readable duration string (HH:MM:SS)
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    remainingSeconds.toString().padStart(2, "0"),
  ].join(":");
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
