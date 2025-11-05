import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { 
    Shield, Activity, FileText, Globe, DollarSign, Cloud, 
    ShieldAlert, Zap, TrendingUp, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const DOMAIN_ICONS = {
    'Militaire': Shield,
    'Santé_Publique': Activity,
    'Investigation': FileText,
    'Diplomatie': Globe,
    'Finance': DollarSign,
    'Météorologie': Cloud,
    'Forces_Ordre': ShieldAlert,
    'Énergie': Zap,
    'Maritime': Activity,
    'Spatial': Activity,
    'Supply_Chain': Activity,
    'Corporatif': Activity,
    'Infrastructure': Activity,
    'Agriculture': Activity,
    'Télécom': Activity,
    'Commerce': DollarSign,
    'Migration': Activity,
    'Technologie': Activity,
    'Médias': Activity
};

const DOMAIN_PAGES = {
    'Militaire': 'MilitaryIntelligence',
    'Santé_Publique': 'PublicHealthMonitor',
    'Investigation': 'InvestigativeJournalism',
    'Diplomatie': 'DiplomaticIntelligence',
    'Finance': 'FinancialIntelligence',
    'Météorologie': 'ClimateWeatherCenter',
    'Forces_Ordre': 'LawEnforcementCenter',
    'Énergie': 'EnergyCenter',
    'Maritime': 'MaritimeIntelligence',
    'Spatial': 'SpaceCenter',
    'Supply_Chain': 'SupplyChainIntelligence',
    'Corporatif': 'CorporateIntelligence',
    'Infrastructure': 'CriticalInfrastructure',
    'Agriculture': 'AgricultureSecurityCenter',
    'Télécom': 'TelecommunicationsCenter',
    'Commerce': 'TradeIntelligence',
    'Migration': 'MigrationBorderSecurity',
    'Technologie': 'TechnologyInnovationCenter',
    'Médias': 'MediaInfluenceCenter'
};

export default function AllCentersWidget() {
    const [stats, setStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const briefs = await base44.entities.IntelligenceBrief.list();
                
                const domainStats = {};
                briefs.forEach(brief => {
                    const domain = brief.domain;
                    if (!domainStats[domain]) {
                        domainStats[domain] = {
                            total: 0,
                            critical: 0,
                            lastUpdate: brief.created_date
                        };
                    }
                    domainStats[domain].total++;
                    if (brief.priority_level === 'Critique' || brief.priority_level === 'Flash') {
                        domainStats[domain].critical++;
                    }
                    if (new Date(brief.created_date) > new Date(domainStats[domain].lastUpdate)) {
                        domainStats[domain].lastUpdate = brief.created_date;
                    }
                });

                const statsArray = Object.entries(domainStats).map(([domain, data]) => ({
                    domain,
                    ...data
                })).sort((a, b) => b.total - a.total);

                setStats(statsArray);
            } catch (error) {
                console.error('Erreur chargement stats centres:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadStats();
    }, []);

    if (isLoading) {
        return (
            <NeaCard className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </NeaCard>
        );
    }

    return (
        <NeaCard>
            <div className="p-4 border-b border-[var(--nea-border-default)]">
                <h3 className="font-bold text-[var(--nea-text-title)] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Activité Multi-Centres
                </h3>
                <p className="text-xs text-[var(--nea-text-secondary)] mt-1">
                    Vue consolidée de tous les centres professionnels
                </p>
            </div>
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto styled-scrollbar">
                {stats.map((stat, index) => {
                    const Icon = DOMAIN_ICONS[stat.domain] || Activity;
                    const pageName = DOMAIN_PAGES[stat.domain];
                    
                    return (
                        <motion.div
                            key={stat.domain}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link to={createPageUrl(pageName)}>
                                <div className="p-3 rounded-lg bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-bg-surface)] border border-[var(--nea-border-subtle)] hover:border-[var(--nea-primary-blue)] transition-all cursor-pointer group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <Icon className="w-4 h-4 text-[var(--nea-text-secondary)] group-hover:text-[var(--nea-primary-blue)] transition-colors" />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-[var(--nea-text-title)]">
                                                    {stat.domain.replace('_', ' ')}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {stat.total} briefs
                                                    </Badge>
                                                    {stat.critical > 0 && (
                                                        <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
                                                            {stat.critical} critique{stat.critical > 1 ? 's' : ''}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-[var(--nea-text-muted)] group-hover:text-[var(--nea-primary-blue)] transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}

                {stats.length === 0 && (
                    <div className="text-center py-8">
                        <Globe className="w-12 h-12 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-[var(--nea-text-secondary)]">
                            Aucune activité détectée
                        </p>
                    </div>
                )}
            </div>
        </NeaCard>
    );
}