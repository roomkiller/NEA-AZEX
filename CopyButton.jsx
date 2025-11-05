import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

/**
 * COPY BUTTON
 * Bouton de copie avec feedback visuel
 */
export default function CopyButton({ 
  text, 
  className = '',
  size = 'sm',
  variant = 'ghost',
  showText = false
}) {
  const { copy } = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copy(text);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      size={size}
      variant={variant}
      className={cn("transition-all", className)}
      aria-label={isCopied ? "Copié" : "Copier"}
    >
      {isCopied ? (
        <>
          <Check className="w-4 h-4 text-green-400" />
          {showText && <span className="ml-2 text-green-400">Copié!</span>}
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {showText && <span className="ml-2">Copier</span>}
        </>
      )}
    </Button>
  );
}