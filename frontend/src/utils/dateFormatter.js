/**
 * Date and Time Formatting Utilities
 * Provides consistent date/time formatting across the application
 */

/**
 * Format timestamp for chat messages
 * - If today: shows time only (e.g., "2:30 PM")
 * - If yesterday: shows "Yesterday, 2:30 PM"
 * - If within current year: shows "Jan 15, 2:30 PM"
 * - If previous years: shows "Jan 15, 2024, 2:30 PM"
 *
 * @param {string|Date} timestamp - The timestamp to format
 * @returns {string} Formatted time string
 */
export const formatChatTimestamp = (timestamp) => {
  if (!timestamp) return '';

  const messageDate = new Date(timestamp);
  const now = new Date();

  // Check if the date is valid
  if (isNaN(messageDate.getTime())) return 'Invalid Date';

  // Get start of today (midnight)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get start of yesterday
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  // Format time
  const timeString = messageDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Today: Show time only
  if (messageDate >= todayStart) {
    return timeString;
  }

  // Yesterday: Show "Yesterday" + time
  if (messageDate >= yesterdayStart && messageDate < todayStart) {
    return `Yesterday, ${timeString}`;
  }

  // This year: Show "Month Day" + time
  if (messageDate.getFullYear() === now.getFullYear()) {
    const dateString = messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return `${dateString}, ${timeString}`;
  }

  // Previous years: Show full date + time
  const dateString = messageDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${dateString}, ${timeString}`;
};

