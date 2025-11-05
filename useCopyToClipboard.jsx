import { useState, useCallback } from 'react';

/**
 * COPY TO CLIPBOARD HOOK
 * Copie du texte dans le presse-papiers
 */
export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState(null);
  const [error, setError] = useState(null);

  const copy = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      setError(new Error('Clipboard not supported'));
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setError(null);
      return true;
    } catch (error) {
      setError(error);
      setCopiedText(null);
      return false;
    }
  }, []);

  return { copy, copiedText, error };
}

export default useCopyToClipboard;