export default function parseDate(date) {
  if (!date) return;

  const [day, month, year] = date.split('.');
  return date ? `${year}-${month}-${day}` : '';
}
