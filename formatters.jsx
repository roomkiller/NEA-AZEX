/**
 * FORMATTERS UTILITY
 * Fonctions utilitaires pour formatter les données
 */

/**
 * Formatte un nombre avec des séparateurs de milliers
 */
export function formatNumber(num, decimals = 0, locale = 'fr-FR') {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}

/**
 * Formatte une devise
 */
export function formatCurrency(amount, currency = 'CAD', locale = 'fr-CA') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Formatte une date
 */
export function formatDate(date, format = 'full', locale = 'fr-FR') {
  const formats = {
    full: { dateStyle: 'full' },
    long: { dateStyle: 'long' },
    medium: { dateStyle: 'medium' },
    short: { dateStyle: 'short' },
    time: { timeStyle: 'medium' },
    datetime: { dateStyle: 'medium', timeStyle: 'short' }
  };

  return new Intl.DateTimeFormat(locale, formats[format] || formats.medium).format(
    typeof date === 'string' ? new Date(date) : date
  );
}

/**
 * Formatte une date relative (il y a X jours)
 */
export function formatRelativeTime(date, locale = 'fr-FR') {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((past - now) / 1000);

  const units = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 }
  ];

  for (const { unit, seconds } of units) {
    if (Math.abs(diffInSeconds) >= seconds) {
      const value = Math.floor(diffInSeconds / seconds);
      return rtf.format(value, unit);
    }
  }

  return rtf.format(0, 'second');
}

/**
 * Formatte une taille de fichier
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Formatte un pourcentage
 */
export function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Tronque un texte avec ellipsis
 */
export function truncate(text, maxLength = 100, suffix = '...') {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Formatte un nom en initiales
 */
export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Formatte une durée en millisecondes
 */
export function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export default {
  formatNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatFileSize,
  formatPercentage,
  truncate,
  getInitials,
  formatDuration
};