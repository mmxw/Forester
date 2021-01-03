export const ONE_DAY = 1000 * 60 * 60 * 24;
export const ONE_MONTH = ONE_DAY * 30;
export const ONE_WEEK = ONE_DAY * 7;

export function formatDay(now: Date, date: Date): string {
  const diff = now.valueOf() - date.valueOf();
  const isFuture = diff < 0;

  const days = Math.ceil(Math.abs(diff) / ONE_DAY);
  if (days === 0) {
    return 'today';
  }
  if (days === 1) {
    return isFuture ? 'tomorrow' : 'yesterday';
  }
  if (isFuture && days < 7) {
    return formatDayOfWeek(date);
  }
  if (!isFuture && days <= 7) {
    return `${days} days ago`;
  }
  if (isFuture && days <= 14) {
    return `next ${formatDayOfWeek(date)}`;
  }
  const isThisYear = now.getFullYear() === date.getFullYear();
  return (
    formatMonthAndMonthDay(date) + (isThisYear ? '' : ` ${date.getFullYear()}`)
  );
}

function formatDayOfWeek(date: Date): string {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ][date.getDay()];
}

function formatMonthAndMonthDay(date: Date): string {
  const monthStr = [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'June',
    'July',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec',
  ][date.getMonth()];
  return `${date.getDate()} ${monthStr}`;
}
