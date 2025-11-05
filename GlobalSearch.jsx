import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Search, X, Loader2, FileText, TrendingUp, Eye, Shield, 
    Clock, ArrowRight, Filter, Hash, Calendar, User, Star, Trash2
} from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SEARCHABLE_ENTITIES = [
    { name: 'EventPrediction', label: 'Prédictions', icon: TrendingUp, fields: ['event_name', 'prediction_summary'], urlKey: 'EventPredictions' },
    { name: 'MediaSignal', label: 'Signaux Faibles', icon: Eye, fields: ['signal_title', 'content_summary'], urlKey: 'WeakSignals' },
    { name: 'IntelligenceBrief', label: 'Briefings', icon: Shield, fields: ['brief_title', 'executive_summary'], urlKey: null },
    { name: 'Module', label: 'Modules', icon: Hash, fields: ['name', 'description'], urlKey: 'Modules' },
    { name: 'Documentation', label: 'Documentation', icon: FileText, fields: ['title', 'content'], urlKey: 'Documentation' },
    { name: 'TrendAnalysis', label: 'Tendances', icon: TrendingUp, fields: ['trend_name'], urlKey: 'TrendAnalysis' },
];

const ResultCard = ({ result, entity, onAddFavorite, onNavigate }) => {
    const Icon = entity.icon;
    const [isFavoriting, setIsFavoriting] = useState(false);

    const handleFavorite = async (e) => {
        e.stopPropagation();
        setIsFavoriting(true);
        await onAddFavorite(result, entity);
        setIsFavoriting(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => onNavigate(result, entity)}
        >
            <NeaCard className="p-4 hover:border-[var(--nea-primary-blue)] transition-all">
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-${entity.name === 'EventPrediction' ? 'green' : entity.name === 'MediaSignal' ? 'cyan' : entity.name === 'IntelligenceBrief' ? 'purple' : 'blue'}-500/20`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-[var(--nea-text-title)] truncate flex-1">
                                {result[entity.fields[0]] || 'Sans titre'}
                            </h4>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                    {entity.label}
                                </Badge>
                                <button
                                    onClick={handleFavorite}
                                    disabled={isFavoriting}
                                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                                >
                                    {isFavoriting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Star className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {entity.fields[1] && result[entity.fields[1]] && (
                            <p className="text-sm text-[var(--nea-text-secondary)] line-clamp-2 mb-2">
                                {result[entity.fields[1]]}
                            </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-[var(--nea-text-muted)]">
                            {result.created_date && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(result.created_date).toLocaleDateString('fr-CA')}
                                </div>
                            )}
                            {result.created_by && (
                                <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {result.created_by}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </NeaCard>
        </motion.div>
    );
};

export default function GlobalSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState({});
    const [recentSearches, setRecentSearches] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const { containerVariants, itemVariants } = useStaggerAnimation();
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('nea_recent_searches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    const performSearch = async (term) => {
        if (!term.trim()) {
            setResults({});
            return;
        }

        setIsSearching(true);
        const searchResults = {};

        try {
            const searchPromises = SEARCHABLE_ENTITIES.map(async (entity) => {
                try {
                    const data = await base44.entities[entity.name].list();
                    const filtered = data.filter(item => {
                        return entity.fields.some(field => {
                            const value = item[field];
                            return value && value.toString().toLowerCase().includes(term.toLowerCase());
                        });
                    });
                    return { entity: entity.name, results: filtered };
                } catch (error) {
                    console.error(`Erreur recherche ${entity.name}:`, error);
                    return { entity: entity.name, results: [] };
                }
            });

            const allResults = await Promise.all(searchPromises);
            allResults.forEach(({ entity, results: entityResults }) => {
                searchResults[entity] = entityResults;
            });

            setResults(searchResults);

            const newRecent = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
            setRecentSearches(newRecent);
            localStorage.setItem('nea_recent_searches', JSON.stringify(newRecent));
        } catch (error) {
            console.error("Erreur recherche globale:", error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            performSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const totalResults = useMemo(() => {
        return Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
    }, [results]);

    const handleAddFavorite = async (item, entity) => {
        try {
            const user = await base44.auth.me();
            await base44.entities.UserFavorite.create({
                user_email: user.email,
                favorite_type: entity.name,
                favorite_id: item.id,
                favorite_name: item[entity.fields[0]] || 'Sans titre'
            });
            console.log("Ajouté aux favoris");
        } catch (error) {
            console.error("Erreur ajout favori:", error);
        }
    };

    const handleNavigate = (item, entity) => {
        if (entity.urlKey) {
            navigate(createPageUrl(entity.urlKey));
        }
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('nea_recent_searches');
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Recherche Globale", href: "GlobalSearch" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Search className="w-8 h-8 text-cyan-400" />}
                    title="Recherche Globale"
                    subtitle="Recherchez dans l'ensemble du système NEA-AZEX"
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="p-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[var(--nea-text-secondary)]" />
                        <Input
                            placeholder="Rechercher des prédictions, signaux, briefings, modules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-12 text-lg py-6"
                            autoFocus
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--nea-text-secondary)] hover:text-[var(--nea-text-primary)]"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {isSearching && (
                        <div className="flex items-center justify-center gap-2 mt-4 text-[var(--nea-text-secondary)]">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Recherche en cours...</span>
                        </div>
                    )}

                    {!searchTerm && recentSearches.length > 0 && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-[var(--nea-text-primary)]">
                                    Recherches récentes
                                </h4>
                                <button
                                    onClick={clearRecentSearches}
                                    className="text-xs text-[var(--nea-text-secondary)] hover:text-red-400"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {recentSearches.map((term, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSearchTerm(term)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-bg-surface)] text-sm text-[var(--nea-text-primary)] transition-colors"
                                    >
                                        <Clock className="w-3 h-3" />
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </NeaCard>
            </motion.div>

            {searchTerm && totalResults > 0 && (
                <motion.div variants={itemVariants}>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[var(--nea-text-secondary)]">
                            <strong className="text-[var(--nea-text-title)]">{totalResults}</strong> résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
                        </p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">
                                Tout ({totalResults})
                            </TabsTrigger>
                            {SEARCHABLE_ENTITIES.map(entity => {
                                const count = results[entity.name]?.length || 0;
                                if (count === 0) return null;
                                return (
                                    <TabsTrigger key={entity.name} value={entity.name}>
                                        {entity.label} ({count})
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        <TabsContent value="all" className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {SEARCHABLE_ENTITIES.map(entity => {
                                    const entityResults = results[entity.name] || [];
                                    if (entityResults.length === 0) return null;

                                    return (
                                        <div key={entity.name} className="space-y-3">
                                            <h3 className="text-lg font-bold text-[var(--nea-text-title)] flex items-center gap-2">
                                                <entity.icon className="w-5 h-5" />
                                                {entity.label}
                                                <Badge>{entityResults.length}</Badge>
                                            </h3>
                                            {entityResults.slice(0, 3).map(result => (
                                                <ResultCard
                                                    key={result.id}
                                                    result={result}
                                                    entity={entity}
                                                    onAddFavorite={handleAddFavorite}
                                                    onNavigate={handleNavigate}
                                                />
                                            ))}
                                            {entityResults.length > 3 && (
                                                <button
                                                    onClick={() => setActiveTab(entity.name)}
                                                    className="text-sm text-[var(--nea-primary-blue)] hover:underline flex items-center gap-1"
                                                >
                                                    Voir tous les {entityResults.length} résultats
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </AnimatePresence>
                        </TabsContent>

                        {SEARCHABLE_ENTITIES.map(entity => (
                            <TabsContent key={entity.name} value={entity.name} className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {(results[entity.name] || []).map(result => (
                                        <ResultCard
                                            key={result.id}
                                            result={result}
                                            entity={entity}
                                            onAddFavorite={handleAddFavorite}
                                            onNavigate={handleNavigate}
                                        />
                                    ))}
                                </AnimatePresence>
                            </TabsContent>
                        ))}
                    </Tabs>
                </motion.div>
            )}

            {searchTerm && !isSearching && totalResults === 0 && (
                <motion.div variants={itemVariants}>
                    <NeaCard className="p-12 text-center">
                        <Search className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                            Aucun résultat
                        </h3>
                        <p className="text-[var(--nea-text-secondary)]">
                            Aucun résultat trouvé pour "<strong>{searchTerm}</strong>"
                        </p>
                        <p className="text-sm text-[var(--nea-text-muted)] mt-2">
                            Essayez d'autres mots-clés ou vérifiez l'orthographe
                        </p>
                    </NeaCard>
                </motion.div>
            )}
        </motion.div>
    );
}