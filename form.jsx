import React from 'react';
import { cn } from '@/lib/utils';

/**
 * FORM COMPONENTS
 * Système de formulaires composable et accessible
 */
export function Form({ onSubmit, children, className = '' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)} noValidate>
      {children}
    </form>
  );
}

export function FormField({ children, className = '' }) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}

export function FormLabel({ children, htmlFor, required = false, className = '' }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-[var(--nea-text-primary)]",
        className
      )}
    >
      {children}
      {required && <span className="text-red-400 ml-1" aria-label="requis">*</span>}
    </label>
  );
}

export function FormInput({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) {
  return (
    <>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full px-3 py-2 rounded-lg",
          "bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]",
          "text-[var(--nea-text-primary)] placeholder:text-[var(--nea-text-muted)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--nea-primary-blue)] focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

export function FormTextarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) {
  return (
    <>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full px-3 py-2 rounded-lg resize-none",
          "bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]",
          "text-[var(--nea-text-primary)] placeholder:text-[var(--nea-text-muted)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--nea-primary-blue)] focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

export function FormSelect({
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner...',
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) {
  return (
    <>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full px-3 py-2 rounded-lg",
          "bg-[var(--nea-bg-surface)] border border-[var(--nea-border-default)]",
          "text-[var(--nea-text-primary)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--nea-primary-blue)] focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

export function FormCheckbox({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  error,
  className = ''
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "w-4 h-4 rounded",
            "bg-[var(--nea-bg-surface)] border-2 border-[var(--nea-border-default)]",
            "text-[var(--nea-primary-blue)]",
            "focus:ring-2 focus:ring-[var(--nea-primary-blue)] focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "cursor-pointer",
            error && "border-red-500",
            className
          )}
        />
        {label && (
          <label
            htmlFor={id}
            className="text-sm text-[var(--nea-text-primary)] cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

export function FormError({ children, className = '' }) {
  if (!children) return null;
  
  return (
    <div
      className={cn(
        "p-3 rounded-lg bg-red-500/10 border border-red-500/30",
        "text-sm text-red-400",
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
}

export function FormHelp({ children, className = '' }) {
  if (!children) return null;
  
  return (
    <p className={cn("text-xs text-[var(--nea-text-secondary)]", className)}>
      {children}
    </p>
  );
}