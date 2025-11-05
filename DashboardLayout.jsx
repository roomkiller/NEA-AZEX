import React from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from '../navigation/Breadcrumbs';
import PageHeader from '../ui/PageHeader';
import RoleSwitcher from '../navigation/RoleSwitcher';
import NeaCard from '../ui/NeaCard';
import { useStaggerAnimation } from '../navigation/PageTransition';

/**
 * LAYOUT STANDARDISÉ POUR DASHBOARDS
 * Inclut automatiquement Breadcrumbs, Header, RoleSwitcher, Stats Grid
 * 
 * @param {Object} props
 * @param {Array} props.breadcrumbs - Pages pour fil d'ariane
 * @param {React.ReactNode} props.icon - Icône du dashboard
 * @param {string} props.title - Titre du dashboard
 * @param {string} props.subtitle - Sous-titre
 * @param {Object} props.user - Utilisateur actuel
 * @param {Object} props.subscription - Abonnement de l'utilisateur
 * @param {React.ReactNode} props.statsCards - Cartes de statistiques (4 métriques)
 * @param {React.ReactNode} props.mainContent - Contenu principal du dashboard
 * @param {React.ReactNode} props.sidebarContent - Contenu sidebar (optionnel)
 * @param {boolean} props.showRoleSwitcher - Afficher le RoleSwitcher (default: true)
 */
export default function DashboardLayout({
  breadcrumbs = [],
  icon,
  title,
  subtitle,
  user,
  subscription,
  statsCards,
  mainContent,
  sidebarContent = null,
  showRoleSwitcher = true
}) {
  const { containerVariants, itemVariants } = useStaggerAnimation();
  const userRole = user?.role || 'user';
  const displayRole = localStorage.getItem('impersonated_role') || userRole;

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
      <motion.div variants={itemVariants}>
        <PageHeader icon={icon} title={title} subtitle={subtitle} />
      </motion.div>

      {/* RoleSwitcher */}
      {showRoleSwitcher && user && (
        <motion.div variants={itemVariants}>
          <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Changement d'Interface
              </h3>
            </div>
            <div className="p-6">
              <RoleSwitcher
                currentUserRole={userRole}
                currentDisplayRole={displayRole}
                subscription={subscription}
              />
            </div>
          </NeaCard>
        </motion.div>
      )}

      {/* Stats Cards Grid */}
      {statsCards && (
        <motion.div variants={itemVariants} className="grid md:grid-cols-4 gap-4">
          {statsCards}
        </motion.div>
      )}

      {/* Main Content + Sidebar (si présent) */}
      {sidebarContent ? (
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            {mainContent}
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-6">
            {sidebarContent}
          </motion.div>
        </div>
      ) : (
        <motion.div variants={itemVariants}>
          {mainContent}
        </motion.div>
      )}
    </motion.div>
  );
}