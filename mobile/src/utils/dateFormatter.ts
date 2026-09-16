/**
 * Formats a date ISO string into human-readable deadline label and relative countdown
 */
export const formatDeadlineLabel = (deadlineIso: string): { label: string; isOverdue: boolean; urgencyText: string } => {
  const deadline = new Date(deadlineIso);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  const isOverdue = diffMs < 0;

  // Format time (e.g. 5:30 PM)
  const timeStr = deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Format date (e.g. Sep 16)
  const dateStr = deadline.toLocaleDateString([], { month: 'short', day: 'numeric' });

  let urgencyText = '';

  if (isOverdue) {
    const absMins = Math.abs(diffMinutes);
    const absHours = Math.abs(diffHours);
    if (absMins < 60) {
      urgencyText = `Overdue by ${absMins}m`;
    } else if (absHours < 24) {
      urgencyText = `Overdue by ${absHours}h`;
    } else {
      urgencyText = `Overdue by ${Math.floor(absHours / 24)}d`;
    }
  } else {
    if (diffMinutes < 60) {
      urgencyText = `Due in ${diffMinutes}m`;
    } else if (diffHours < 24) {
      urgencyText = `Due in ${diffHours}h`;
    } else if (diffDays === 1) {
      urgencyText = `Due Tomorrow at ${timeStr}`;
    } else if (diffDays < 7) {
      urgencyText = `Due in ${diffDays} days`;
    } else {
      urgencyText = `Due ${dateStr}`;
    }
  }

  return {
    label: `${dateStr}, ${timeStr}`,
    isOverdue,
    urgencyText,
  };
};
