/**
 * VALIDATORS UTILITY
 * Fonctions de validation courantes
 */

/**
 * Valide une adresse email
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valide un numéro de téléphone
 */
export function validatePhone(phone) {
  const regex = /^[\d\s\-\+\(\)]+$/;
  return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Valide une URL
 */
export function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valide un mot de passe
 */
export function validatePassword(password, options = {}) {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false
  } = options;

  if (password.length < minLength) {
    return { valid: false, error: `Minimum ${minLength} caractères requis` };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, error: 'Au moins une majuscule requise' };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { valid: false, error: 'Au moins une minuscule requise' };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return { valid: false, error: 'Au moins un chiffre requis' };
  }

  if (requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Au moins un caractère spécial requis' };
  }

  return { valid: true };
}

/**
 * Valide un code postal canadien
 */
export function validatePostalCode(code) {
  const regex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
  return regex.test(code);
}

/**
 * Valide une adresse IP
 */
export function validateIP(ip) {
  const regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!regex.test(ip)) return false;
  
  return ip.split('.').every(part => {
    const num = parseInt(part);
    return num >= 0 && num <= 255;
  });
}

/**
 * Valide que la valeur n'est pas vide
 */
export function validateRequired(value) {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

/**
 * Valide une longueur min/max
 */
export function validateLength(value, min, max) {
  const length = value?.length || 0;
  if (min && length < min) {
    return { valid: false, error: `Minimum ${min} caractères` };
  }
  if (max && length > max) {
    return { valid: false, error: `Maximum ${max} caractères` };
  }
  return { valid: true };
}

/**
 * Valide un nombre dans une plage
 */
export function validateRange(value, min, max) {
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, error: 'Doit être un nombre' };
  }
  if (min !== undefined && num < min) {
    return { valid: false, error: `Minimum ${min}` };
  }
  if (max !== undefined && num > max) {
    return { valid: false, error: `Maximum ${max}` };
  }
  return { valid: true };
}

export default {
  validateEmail,
  validatePhone,
  validateURL,
  validatePassword,
  validatePostalCode,
  validateIP,
  validateRequired,
  validateLength,
  validateRange
};