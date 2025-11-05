import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Star, Trash2, Filter, TrendingUp, Eye, Shield, Hash, 
    FileText, ExternalLink, Calendar, User, Search, Pin, Tag
} from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const FAVORITE_ICONS = {
    EventPrediction: TrendingUp,
    MediaSignal: Eye,
    IntelligenceBrief: Shield,
    Module: Hash,
    Documentation: FileText,
    TrendAnalysis: TrendingUp,
    Page: ExternalLink,
    Scenario: FileText,
    Trend: TrendingUp
};

const FavoriteCard = ({ favorite, onDelete, onTogglePin, onNavigate }) => {
    const Icon = FAVORITE_ICONS[favorite.favorite_type] || Star;
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await onDelete(favorite);
        setIsDeleting(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            <NeaCard className={`p-4 hover:border-[var(--nea-primary-blue)] transition-all ${favorite.is_pinned ? 'border-yellow-500/50 bg-yellow-500/5' : ''}`}>
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                        <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                                <h4 className="font-semibold text-[var(--nea-text-title)] mb-1">
                                    {favorite.favorite_name}
                                </h4>
                                {favorite.notes && (
                                    <p className="text-sm text-[var(--nea-text-secondary)] line-clamp-2">
                                        {favorite.notes}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {favorite.is_pinned && (
                                    <Pin className="w-4 h-4 text-yellow-400" />
                                )}
                                <button
                                    onClick={() => onTogglePin(favorite)}
                                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                                    title={favorite.is_pinned ? "Désépingler" : "Épingler"}
                                >
                                    <Pin className={`w-4 h-4 ${favorite.is_pinned ? 'fill-yellow-400' : ''}`} />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="text-gray-400 hover:text-red-400 transition-colors"
                                    title="Supprimer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                                {favorite.favorite_type}
                            </Badge>
                            {favorite.tags && favorite.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                    {favorite.tags.map((tag, i) => (
                                        <Badge key={i} className="bg-cyan-500/20 text-cyan-400 border-0 text-xs">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-1 text-xs text-[var(--nea-text-muted)]">
                                <Calendar className="w-3 h-3" />
                                {new Date(favorite.created_date).toLocaleDateString('fr-CA')}
                            </div>
                            {favorite.access_count > 0 && (
                                <div className="flex items-center gap-1 text-xs text-[var(--nea-text-muted)]">
                                    <Eye className="w-3 h-3" />
                                    {favorite.access_count} accès
                                </div>
                            )}
                        </div>

                        {favorite.favorite_url && (
                            <button
                                onClick={() => onNavigate(favorite)}
                                className="mt-3 flex items-center gap-2 text-sm text-[var(--nea-primary-blue)] hover:underline"
                            >
                                Accéder
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </NeaCard>
        </motion.div>
    );
};

export default function MyFavorites() {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [deleteId, setDeleteId] = useState(null);
    const { containerVariants, itemVariants } = useStaggerAnimation();
    const navigate = useNavigate();

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const user = await base44.auth.me();
            const data = await base44.entities.UserFavorite.filter(
                { user_email: user.email },
                '-created_date',
                100
            );
            setFavorites(data);
        } catch (error) {
            console.error("Erreur chargement favoris:", error);
            toast.error("Impossible de charger les favoris");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (favorite) => {
        try {
            await base44.entities.UserFavorite.delete(favorite.id);
            await loadFavorites();
            toast.success("Favori supprimé");
            setDeleteId(null);
        } catch (error) {
            console.error("Erreur suppression favori:", error);
            toast.error("Échec de la suppression");
        }
    };

    const handleTogglePin = async (favorite) => {
        try {
            await base44.entities.UserFavorite.update(favorite.id, {
                is_pinned: !favorite.is_pinned
            });
            await loadFavorites();
            toast.success(favorite.is_pinned ? "Favori désépinglé" : "Favori épinglé");
        } catch (error) {
            console.error("Erreur épinglage:", error);
            toast.error("Échec de l'épinglage");
        }
    };

    const handleNavigate = async (favorite) => {
        try {
            // Increment access count
            await base44.entities.UserFavorite.update(favorite.id, {
                access_count: (favorite.access_count || 0) + 1,
                last_accessed: new Date().toISOString()
            });

            if (favorite.favorite_url) {
                navigate(favorite.favorite_url);
            }
        } catch (error) {
            console.error("Erreur navigation:", error);
        }
    };

    const filteredFavorites = useMemo(() => {
        let filtered = favorites;

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(f => f.favorite_type === filterType);
        }

        // Filter by search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(f => 
                f.favorite_name.toLowerCase().includes(term) ||
                (f.notes && f.notes.toLowerCase().includes(term)) ||
                (f.tags && f.tags.some(tag => tag.toLowerCase().includes(term)))
            );
        }

        // Sort: pinned first, then by date
        return filtered.sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return new Date(b.created_date) - new Date(a.created_date);
        });
    }, [favorites, filterType, searchTerm]);

    const stats = useMemo(() => {
        const pinned = favorites.filter(f => f.is_pinned).length;
        const types = {};
        favorites.forEach(f => {
            types[f.favorite_type] = (types[f.favorite_type] || 0) + 1;
        });
        return { total: favorites.length, pinned, types };
    }, [favorites]);

    if (isLoading) {
        return <LoadingTransition message="Chargement de vos favoris..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Mes Favoris", href: "MyFavorites" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Star className="w-8 h-8 text-yellow-400" />}
                    title="Mes Favoris"
                    subtitle={`${stats.total} élément${stats.total > 1 ? 's' : ''} sauvegardé${stats.total > 1 ? 's' : ''}`}
                />
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--nea-text-secondary)]" />
                            <Input
                                placeholder="Rechercher dans vos favoris..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-default)] text-[var(--nea-text-primary)]"
                        >
                            <option value="all">Tous types</option>
                            {Object.entries(stats.types).map(([type, count]) => (
                                <option key={type} value={type}>
                                    {type} ({count})
                                </option>
                            ))}
                        </select>
                    </div>
                </NeaCard>
            </motion.div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredFavorites.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <NeaCard className="p-12 text-center">
                                <Star className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                                    {searchTerm || filterType !== 'all' ? 'Aucun favori trouvé' : 'Aucun favori'}
                                </h3>
                                <p className="text-[var(--nea-text-secondary)]">
                                    {searchTerm || filterType !== 'all' 
                                        ? 'Essayez d\'autres critères de recherche' 
                                        : 'Ajoutez des éléments à vos favoris en cliquant sur l\'étoile lors de vos recherches'}
                                </p>
                            </NeaCard>
                        </motion.div>
                    ) : (
                        filteredFavorites.map(favorite => (
                            <FavoriteCard
                                key={favorite.id}
                                favorite={favorite}
                                onDelete={() => setDeleteId(favorite.id)}
                                onTogglePin={handleTogglePin}
                                onNavigate={handleNavigate}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900 dark:text-white">
                            Supprimer ce favori ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                            Cette action est irréversible. Le favori sera définitivement supprimé.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[var(--nea-bg-surface-hover)] text-gray-900 dark:text-white">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDelete(favorites.find(f => f.id === deleteId))}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
}