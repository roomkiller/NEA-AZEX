import React from 'react';
import { motion } from 'framer-motion';
import { useStaggerAnimation } from '../navigation/PageTransition';

/**
 * LAYOUT DEUX COLONNES STANDARDISÉ
 * 2/3 pour le contenu principal + 1/3 pour sidebar
 * Responsive: pleine largeur sur mobile
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.mainContent - Contenu principal (gauche, 2/3)
 * @param {React.ReactNode} props.sidebarContent - Contenu sidebar (droite, 1/3)
 * @param {string} props.mainClassName - Classes CSS additionnelles pour main
 * @param {string} props.sidebarClassName - Classes CSS additionnelles pour sidebar
 */
export default function TwoColumnLayout({
  mainContent,
  sidebarContent,
  mainClassName = '',
  sidebarClassName = ''
}) {
  const { itemVariants } = useStaggerAnimation();

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Colonne principale - 2/3 */}
      <motion.div 
        variants={itemVariants}
        className={`lg:col-span-2 ${mainClassName}`}
      >
        {mainContent}
      </motion.div>

      {/* Sidebar - 1/3 */}
      <motion.div 
        variants={itemVariants}
        className={sidebarClassName}
      >
        {sidebarContent}
      </motion.div>
    </div>
  );
}