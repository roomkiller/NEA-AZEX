import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function useStaggerAnimation(staggerChildren = 0.1, delayChildren = 0) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return { containerVariants, itemVariants };
}

export function LoadingTransition({ message = "Chargement..." }) {
  return (
    <div className="flex-1 flex justify-center items-center h-full min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center space-y-4"
      >
        <Loader2 className="w-8 h-8 text-[var(--nea-primary-blue)] animate-spin mx-auto" />
        <p className="text-[var(--nea-text-primary)] text-glow">{message}</p>
      </motion.div>
    </div>
  );
}