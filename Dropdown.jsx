import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

/**
 * DROPDOWN COMPONENT
 * Menu déroulant accessible et élégant
 */
export default function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner...',
  disabled = false,
  className = '',
  label,
  error
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="block text-sm font-medium text-[var(--nea-text-primary)] mb-2">
          {label}
        </label>
      )}

      <div ref={dropdownRef} className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between px-4 py-2 rounded-lg",
            "bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]",
            "text-[var(--nea-text-primary)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--nea-primary-blue)] focus:border-transparent",
            "transition-all",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500",
            isOpen && "ring-2 ring-[var(--nea-primary-blue)]"
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={selectedOption ? '' : 'text-[var(--nea-text-muted)]'}>
            {selectedOption?.label || placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-[var(--nea-text-muted)]" />
          </motion.div>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute top-full left-0 right-0 mt-2 z-50",
                "bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]",
                "rounded-lg shadow-lg overflow-hidden"
              )}
              role="listbox"
            >
              <div className="max-h-60 overflow-y-auto styled-scrollbar">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5",
                      "text-left text-sm transition-colors",
                      "hover:bg-[var(--nea-bg-surface-hover)]",
                      "focus:outline-none focus:bg-[var(--nea-bg-surface-hover)]",
                      option.value === value
                        ? "bg-blue-500/10 text-[var(--nea-primary-blue)]"
                        : "text-[var(--nea-text-primary)]"
                    )}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <Check className="w-4 h-4 text-[var(--nea-primary-blue)]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}