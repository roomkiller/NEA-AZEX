import React, { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * TABS COMPONENT
 * Système d'onglets accessible et animé
 */
const TabsContext = createContext(null);

export function Tabs({ defaultValue, value, onValueChange, children, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultValue || value);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  const contextValue = {
    activeTab: value !== undefined ? value : activeTab,
    setActiveTab: handleTabChange
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-lg",
        "bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-default)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, disabled = false, className = '' }) {
  const context = useContext(TabsContext);
  const isActive = context.activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      disabled={disabled}
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "relative px-4 py-2 rounded-md text-sm font-medium transition-all",
        "focus:outline-none focus:ring-2 focus:ring-[var(--nea-primary-blue)] focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isActive
          ? "text-[var(--nea-text-title)] bg-[var(--nea-bg-surface)] shadow-sm"
          : "text-[var(--nea-text-secondary)] hover:text-[var(--nea-text-primary)] hover:bg-[var(--nea-bg-surface)]/50",
        className
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 rounded-md border-2 border-[var(--nea-primary-blue)]/30"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}

export function TabsContent({ value, children, className = '' }) {
  const context = useContext(TabsContext);
  const isActive = context.activeTab === value;

  if (!isActive) return null;

  return (
    <motion.div
      id={`panel-${value}`}
      role="tabpanel"
      aria-labelledby={`tab-${value}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn("mt-4", className)}
    >
      {children}
    </motion.div>
  );
}