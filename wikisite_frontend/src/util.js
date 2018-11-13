/**
 * Formats a date string for the current locale
 * @param {String} dateString Date string as given by the API
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

export { formatDate };
