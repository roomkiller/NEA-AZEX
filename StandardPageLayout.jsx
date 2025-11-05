import React from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from '../navigation/Breadcrumbs';
import PageHeader from '../ui/PageHeader';
import ProfessionalCentersNav from '../navigation/ProfessionalCentersNav';
import { useStaggerAnimation } from '../navigation/PageTransition';

/**
 * LAYOUT STANDARDISÉ POUR TOUTES LES PAGES
 * Wrapper uniforme avec Breadcrumbs + PageHeader + Navigation optionnelle
 * 
 * @param {Object} props
 * @param {Array} props.breadcrumbs - Pages pour fil d'ariane [{name, href}]
 * @param {React.ReactNode} props.icon - Icône du header
 * @param {string} props.title - Titre de la page
 * @param {string} props.subtitle - Sous-titre de la page
 * @param {React.ReactNode} props.actions - Boutons d'actions dans le header
 * @param {boolean} props.showProfessionalNav - Afficher navigation centres professionnels
 * @param {React.ReactNode} props.children - Contenu de la page
 */
export default function StandardPageLayout({
  breadcrumbs = [],
  icon,
  title,
  subtitle,
  actions,
  showProfessionalNav = false,
  children
}) {
  const { containerVariants, itemVariants } = useStaggerAnimation();

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <motion.div variants={itemVariants}>
          <Breadcrumbs pages={breadcrumbs} />
        </motion.div>
      )}

      {/* Page Header */}
      {(icon || title) && (
        <motion.div variants={itemVariants}>
          <PageHeader
            icon={icon}
            title={title}
            subtitle={subtitle}
            actions={actions}
          />
        </motion.div>
      )}

      {/* Navigation Centres Professionnels (optionnel) */}
      {showProfessionalNav && (
        <motion.div variants={itemVariants}>
          <ProfessionalCentersNav />
        </motion.div>
      )}

      {/* Contenu de la page */}
      {children}
    </motion.div>
  );
}