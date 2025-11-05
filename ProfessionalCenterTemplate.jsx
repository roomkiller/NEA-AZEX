
import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '../navigation/Breadcrumbs';
import PageHeader from '../ui/PageHeader';
import ProfessionalCentersNav from '../navigation/ProfessionalCentersNav';
import RoleSwitcher from '../navigation/RoleSwitcher';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation, LoadingTransition } from '../navigation/PageTransition';
import BriefActions from './BriefActions';
import BriefFilters from './BriefFilters';
import BriefSearch from './BriefSearch';
import CreateBriefModal from './CreateBriefModal';
import RelatedDataWidget from './RelatedDataWidget';
import { formatLargeNumber, formatDate } from '../utils/NumberFormatter';
import StatsCard from '../ui/StatsCard';
import { FileText, TrendingUp, Eye, Activity } from 'lucide-react'; // Import Lucide icons

/**
 * TEMPLATE UNIFIÉ POUR TOUS LES CENTRES PROFESSIONNELS
 * Élimine la duplication de 90% du code
 * VERSION 2.0: Accessibilité améliorée avec ARIA + Navigation améliorée
 */
export default function ProfessionalCenterTemplate({
  // Configuration du centre
  domain,              
  title,               
  subtitle,            
  icon: Icon,          
  iconColor = "blue",  
  
  // Configuration des stats (optionnel)
  statsConfig = null,  
  
  // Configuration des données connexes (optionnel)
  relatedDataConfig = null, 
  
  // Rendu personnalisé de brief (optionnel)
  renderBrief = null   
}) {
  const [briefs, setBriefs] = useState([]);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { containerVariants, itemVariants } = useStaggerAnimation();

  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priority: 'all',
    period: 'all',
    region: '',
    confidence: 'all',
    startDate: null,
    endDate: null
  });
  const [relatedData, setRelatedData] = useState({ predictions: [], signals: [], trends: [] });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [briefsData, currentUser] = await Promise.all([
          base44.entities.IntelligenceBrief.filter({ domain }, '-created_date'),
          base44.auth.me().catch(() => null)
        ]);

        setBriefs(briefsData);
        setUser(currentUser);

        if (currentUser) {
          const subs = await base44.entities.Subscription.filter({ user_email: currentUser.email });
          if (subs.length > 0) setSubscription(subs[0]);
        }

        // Charger données connexes si config fournie
        if (relatedDataConfig) {
          const related = await relatedDataConfig();
          setRelatedData(related);
        }
      } catch (error) {
        console.error(`Erreur chargement ${domain}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [domain, relatedDataConfig]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      priority: 'all',
      period: 'all',
      region: '',
      confidence: 'all',
      startDate: null,
      endDate: null
    });
    setSearchTerm('');
  };

  const filteredBriefs = useMemo(() => {
    let filtered = briefs;

    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.brief_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.executive_summary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(b => b.priority_level === filters.priority);
    }

    if (filters.confidence !== 'all') {
      const minConfidence = parseInt(filters.confidence);
      filtered = filtered.filter(b => b.confidence_score >= minConfidence);
    }

    if (filters.region) {
      filtered = filtered.filter(b => {
        const regions = b.geographic_focus?.regions || [];
        return regions.some(r => r.toLowerCase().includes(filters.region.toLowerCase()));
      });
    }

    if (filters.period !== 'all' && filters.period !== 'custom') {
      const now = new Date();
      const periodMap = { today: 1, '7days': 7, '30days': 30 };
      const days = periodMap[filters.period];
      if (days) {
        const cutoff = new Date(now.setDate(now.getDate() - days));
        filtered = filtered.filter(b => new Date(b.created_date) >= cutoff);
      }
    }

    if (filters.period === 'custom' && filters.startDate) {
      filtered = filtered.filter(b => new Date(b.created_date) >= new Date(filters.startDate));
    }

    if (filters.period === 'custom' && filters.endDate) {
      const endOfDay = new Date(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(b => new Date(b.created_date) <= endOfDay);
    }

    return filtered;
  }, [briefs, searchTerm, filters]);

  // New stats calculation for StatsCard
  const stats = useMemo(() => {
    const defaultStats = {
      totalBriefs: briefs.length,
      criticalBriefs: briefs.filter(b => b.priority_level === 'Critique' || b.priority_level === 'Flash').length,
      linkedPredictions: relatedData.predictions.length,
      // Assuming predictions have a 'confidence_score' property
      highProbPredictions: relatedData.predictions.filter(p => p.confidence_score > 70).length, 
      linkedSignals: relatedData.signals.length,
      linkedTrends: relatedData.trends.length,
    };

    if (statsConfig) {
      const customStats = statsConfig(briefs, relatedData);
      // Merge custom stats, allowing them to override default values
      return { ...defaultStats, ...customStats };
    }

    return defaultStats;
  }, [briefs, relatedData, statsConfig]);

  // Couleurs par iconColor (mapping complet pour éviter les classes dynamiques)
  const colorClasses = useMemo(() => {
    const colorMap = {
      blue: {
        icon: 'text-blue-400',
        border: 'border-blue-500/30',
        bg: 'bg-blue-500/5',
        hover: 'hover:border-blue-500',
        badge: 'bg-blue-500/20 text-blue-400'
      },
      red: {
        icon: 'text-red-400',
        border: 'border-red-500/30',
        bg: 'bg-red-500/5',
        hover: 'hover:border-red-500',
        badge: 'bg-red-500/20 text-red-400'
      },
      purple: {
        icon: 'text-purple-400',
        border: 'border-purple-500/30',
        bg: 'bg-purple-500/5',
        hover: 'hover:border-purple-500',
        badge: 'bg-purple-500/20 text-purple-400'
      },
      green: {
        icon: 'text-green-400',
        border: 'border-green-500/30',
        bg: 'bg-green-500/5',
        hover: 'hover:border-green-500',
        badge: 'bg-green-500/20 text-green-400'
      },
      cyan: {
        icon: 'text-cyan-400',
        border: 'border-cyan-500/30',
        bg: 'bg-cyan-500/5',
        hover: 'hover:border-cyan-500',
        badge: 'bg-cyan-500/20 text-cyan-400'
      },
      orange: {
        icon: 'text-orange-400',
        border: 'border-orange-500/30',
        bg: 'bg-orange-500/5',
        hover: 'hover:border-orange-500',
        badge: 'bg-orange-500/20 text-orange-400'
      },
      yellow: {
        icon: 'text-yellow-400',
        border: 'border-yellow-500/30',
        bg: 'bg-yellow-500/5',
        hover: 'hover:border-yellow-500',
        badge: 'bg-yellow-500/20 text-yellow-400'
      },
      gray: {
        icon: 'text-gray-400',
        border: 'border-gray-500/30',
        bg: 'bg-gray-500/5',
        hover: 'hover:border-gray-500',
        badge: 'bg-gray-500/20 text-gray-400'
      },
      indigo: {
        icon: 'text-indigo-400',
        border: 'border-indigo-500/30',
        bg: 'bg-indigo-500/5',
        hover: 'hover:border-indigo-500',
        badge: 'bg-indigo-500/20 text-indigo-400'
      },
      emerald: {
        icon: 'text-emerald-400',
        border: 'border-emerald-500/30',
        bg: 'bg-emerald-500/5',
        hover: 'hover:border-emerald-500',
        badge: 'bg-emerald-500/20 text-emerald-400'
      },
      violet: {
        icon: 'text-violet-400',
        border: 'border-violet-500/30',
        bg: 'bg-violet-500/5',
        hover: 'hover:border-violet-500',
        badge: 'bg-violet-500/20 text-violet-400'
      },
      sky: {
        icon: 'text-sky-400',
        border: 'border-sky-500/30',
        bg: 'bg-sky-500/5',
        hover: 'hover:border-sky-500',
        badge: 'bg-sky-500/20 text-sky-400'
      },
      pink: {
        icon: 'text-pink-400',
        border: 'border-pink-500/30',
        bg: 'bg-pink-500/5',
        hover: 'hover:border-pink-500',
        badge: 'bg-pink-500/20 text-pink-400'
      }
    };
    return colorMap[iconColor] || colorMap.blue;
  }, [iconColor]);

  // Rendu de brief par défaut avec ARIA amélioré et classes statiques
  const defaultRenderBrief = (brief, index) => (
    <motion.div
      key={brief.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-5 rounded-lg border-2 ${colorClasses.border} ${colorClasses.bg} ${colorClasses.hover} transition-all cursor-pointer`}
      role="article"
      aria-labelledby={`brief-title-${brief.id}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Ouvrir le brief
        }
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap" role="group" aria-label="Métadonnées du brief">
            <Badge className={`border-0 ${
              brief.priority_level === 'Flash' || brief.priority_level === 'Critique' ? 'bg-red-500 text-white' :
              brief.priority_level === 'Urgent' ? 'bg-orange-500 text-white' :
              'bg-blue-500 text-white'
            }`}
            role="status"
            aria-label={`Priorité: ${brief.priority_level}`}
            >
              {brief.priority_level}
            </Badge>
            {brief.classification && (
              <Badge variant="outline" className="text-xs" aria-label={`Classification: ${brief.classification}`}>
                {brief.classification}
              </Badge>
            )}
            {brief.confidence_score && (
              <Badge 
                className={`${colorClasses.badge} border-0 text-xs`}
                aria-label={`Score de confiance: ${brief.confidence_score} pourcent`}
              >
                {brief.confidence_score}% confiance
              </Badge>
            )}
          </div>
          <h3 
            id={`brief-title-${brief.id}`}
            className="text-lg font-bold text-[var(--nea-text-title)] mb-2"
          >
            {brief.brief_title}
          </h3>
          <p className="text-sm text-[var(--nea-text-primary)] mb-3">
            {brief.executive_summary}
          </p>
          {brief.geographic_focus?.regions && brief.geographic_focus.regions.length > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap" role="group" aria-label="Régions concernées">
              <span className="text-xs text-[var(--nea-text-muted)]" aria-hidden="true">Régions:</span>
              {brief.geographic_focus.regions.slice(0, 3).map((region, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {region}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return <LoadingTransition message={`Chargement ${title.toLowerCase()}...`} />;
  }

  const userRole = user?.role || 'user';
  const displayRole = localStorage.getItem('impersonated_role') || userRole;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="main"
      aria-label={title}
    >
      {/* Breadcrumbs */}
      <motion.div variants={itemVariants}>
        <Breadcrumbs pages={[
          { name: "Intelligence Sectorielle" },
          { name: title, href: domain.replace(/\s+/g, '') }
        ]} />
      </motion.div>

      {/* Menu de Navigation des Centres - POSITION PROMINENTE */}
      <motion.div variants={itemVariants} className="sticky top-0 z-20">
        <ProfessionalCentersNav />
      </motion.div>

      {/* Header de la page */}
      <motion.div variants={itemVariants}>
        <PageHeader
          icon={<Icon className={`w-8 h-8 ${colorClasses.icon}`} aria-hidden="true" />}
          title={title}
          subtitle={subtitle}
          actions={
            <BriefActions 
              onCreateBrief={() => setShowCreateModal(true)}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              domain={domain}
              briefs={filteredBriefs}
            />
          }
        />
      </motion.div>

      {/* Role Switcher */}
      {user && (
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

      {/* Search */}
      <motion.div variants={itemVariants}>
        <BriefSearch value={searchTerm} onChange={setSearchTerm} />
      </motion.div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            variants={itemVariants}
          >
            <BriefFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Stats Grid - Updated with StatsCard */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6" role="region" aria-label="Statistiques">
            <StatsCard
                title="Briefings Actifs"
                value={stats.totalBriefs}
                icon={FileText}
                iconColor="text-blue-400"
                iconBg="from-blue-500/20 to-blue-600/30"
                borderColor="border-blue-500/30"
                valueColor="text-blue-400"
                subtitle={`${stats.criticalBriefs} critiques`}
                size="default"
            />

            <StatsCard
                title="Prédictions Liées"
                value={stats.linkedPredictions}
                icon={TrendingUp}
                iconColor="text-purple-400"
                iconBg="from-purple-500/20 to-purple-600/30"
                borderColor="border-purple-500/30"
                valueColor="text-purple-400"
                badge={`${stats.highProbPredictions} >70%`}
                badgeColor="bg-purple-500/20 text-purple-400"
                size="default"
            />

            <StatsCard
                title="Signaux Détectés"
                value={stats.linkedSignals}
                icon={Eye}
                iconColor="text-orange-400"
                iconBg="from-orange-500/20 to-orange-600/30"
                borderColor="border-orange-500/30"
                valueColor="text-orange-400"
                subtitle="dernières 24h" // This might require a specific calculation for real-time signals
                size="default"
            />

            <StatsCard
                title="Tendances Suivies"
                value={stats.linkedTrends}
                icon={Activity}
                iconColor="text-green-400"
                iconBg="from-green-500/20 to-green-600/30"
                borderColor="border-green-500/30"
                valueColor="text-green-400"
                subtitle="en surveillance" // This might require a specific calculation
                size="default"
            />
          </motion.div>

          {/* Briefs List */}
          <motion.div variants={itemVariants}>
            <NeaCard className={colorClasses.border}>
              <div className="p-4 border-b border-[var(--nea-border-default)]">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${colorClasses.icon}`} aria-hidden="true" />
                    {title}
                  </h3>
                  <span 
                    className="text-sm text-[var(--nea-text-secondary)]"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {filteredBriefs.length} résultat{filteredBriefs.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4" role="feed" aria-label="Liste des briefs">
                {filteredBriefs.map((brief, index) => 
                  renderBrief ? renderBrief(brief, index) : defaultRenderBrief(brief, index)
                )}

                {filteredBriefs.length === 0 && (
                  <div className="text-center py-12" role="status">
                    <Icon className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" aria-hidden="true" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Aucun brief ne correspond aux filtres
                    </p>
                  </div>
                )}
              </div>
            </NeaCard>
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} role="complementary" aria-label="Données connexes">
          <RelatedDataWidget 
            predictions={relatedData.predictions}
            signals={relatedData.signals}
            trends={relatedData.trends}
          />
        </motion.div>
      </div>

      <CreateBriefModal 
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        domain={domain}
      />
    </motion.div>
  );
}
