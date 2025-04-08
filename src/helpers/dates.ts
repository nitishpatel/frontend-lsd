export const formatDateToFullDateTime = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    .replace(',', '');
};

export const formatDateToFullDate = (timeStamp: string) => {
  const date = new Date(timeStamp).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  return date;
};
