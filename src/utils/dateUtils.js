// Date utility functions for spiritual tracker

export const getMonthRanges = (baseDate = new Date()) => {
  const format = (date) => date.toLocaleDateString('en-CA');

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  return {
    previous: {
      start: format(new Date(prevYear, prevMonth, 1)),
      end: format(new Date(year, month, 0)),
    },
    current: {
      start: format(new Date(year, month, 1)),
      end: format(new Date(year, month + 1, 0)),
    },
    next: {
      start: format(new Date(nextYear, nextMonth, 1)),
      end: format(new Date(nextYear, nextMonth + 1, 0)),
    },
  };
};

export const getFormattedDateMonthYear = (date) => {
  if (!date || !(date instanceof Date)) return '';

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};





export const getIanaTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getFormattedDate = ({ year, month, date }) => {
  const formattedMonth = String(month + 1).padStart(2, '0');
  const formattedDate = String(date).padStart(2, '0');
  return `${year}-${formattedMonth}-${formattedDate}`;
};

export const getFormattedDateWithTimeZone = ({ year, month, date }) => {
  const now = new Date();
  const jsDate = new Date(year, month, date, now.getHours(), now.getMinutes(), now.getSeconds());

  const formattedMonth = String(month + 1).padStart(2, '0');
  const formattedDate = String(date).padStart(2, '0');

  const hours = String(jsDate.getHours()).padStart(2, '0');
  const minutes = String(jsDate.getMinutes()).padStart(2, '0');
  const seconds = String(jsDate.getSeconds()).padStart(2, '0');
  const time = `${hours}:${minutes}:${seconds}`;

  const offset = -jsDate.getTimezoneOffset();
  const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
  const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0');
  const sign = offset >= 0 ? '+' : '-';
  
  return `${year}-${formattedMonth}-${formattedDate}T${time}${sign}${offsetHours}:${offsetMinutes}`;
};
export const isFutureDate = (date) => {
  if (!date || !date.date || !date.month || !date.year) return false;
  const checkDate = new Date(date.year, date.month, date.date);
  return checkDate > new Date();
};

export const getMonthName = (monthIndex, year) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex - 1] || 'Invalid Month';
};