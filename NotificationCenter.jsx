import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Bell, CheckCheck, Archive, Trash2, Filter, AlertCircle, 
    Info, CheckCircle, AlertTriangle, XCircle, Settings as SettingsIcon,
    Clock, ExternalLink, Search, MoreVertical, X
} from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NOTIFICATION_ICONS = {
    Info: Info,
    Success: CheckCircle,
    Warning: AlertTriangle,
    Error: XCircle,
    Alert: AlertCircle,
    System: SettingsIcon
};

const NOTIFICATION_COLORS = {
    Info: 'text-blue-400',
    Success: 'text-green-400',
    Warning: 'text-yellow-400',
    Error: 'text-red-400',
    Alert: 'text-orange-400',
    System: 'text-purple-400'
};

const NotificationCard = ({ notification, onMarkRead, onArchive, onDelete, onNavigate }) => {
    const Icon = NOTIFICATION_ICONS[notification.notification_type] || Info;
    const iconColor = NOTIFICATION_COLORS[notification.notification_type] || 'text-gray-400';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            <NeaCard className={`p-4 ${!notification.is_read ? 'border-l-4 border-[var(--nea-primary-blue)]' : ''} hover:shadow-lg transition-all`}>
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-${notification.notification_type.toLowerCase()}-500/20 flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                                <h4 className={`font-semibold ${!notification.is_read ? 'text-[var(--nea-text-title)]' : 'text-[var(--nea-text-primary)]'}`}>
                                    {notification.title}
                                </h4>
                                <p className="text-sm text-[var(--nea-text-secondary)] mt-1">
                                    {notification.message}
                                </p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="text-[var(--nea-text-secondary)] hover:text-[var(--nea-text-primary)]">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {!notification.is_read && (
                                        <DropdownMenuItem onClick={() => onMarkRead(notification)}>
                                            <CheckCheck className="w-4 h-4 mr-2" />
                                            Marquer comme lu
                                        </DropdownMenuItem>
                                    )}
                                    {!notification.is_archived && (
                                        <DropdownMenuItem onClick={() => onArchive(notification)}>
                                            <Archive className="w-4 h-4 mr-2" />
                                            Archiver
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => onDelete(notification)} className="text-red-400">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Supprimer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2 text-xs text-[var(--nea-text-muted)]">
                                <Clock className="w-3 h-3" />
                                {new Date(notification.created_date).toLocaleString('fr-CA')}
                            </div>
                            <Badge variant="outline" className="text-xs">
                                {notification.category}
                            </Badge>
                            {notification.priority !== 'Medium' && (
                                <Badge className={`text-xs ${
                                    notification.priority === 'Urgent' ? 'bg-red-500/20 text-red-400' :
                                    notification.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-blue-500/20 text-blue-400'
                                } border-0`}>
                                    {notification.priority}
                                </Badge>
                            )}
                        </div>

                        {notification.action_url && (
                            <button
                                onClick={() => onNavigate(notification)}
                                className="mt-3 flex items-center gap-2 text-sm text-[var(--nea-primary-blue)] hover:underline"
                            >
                                {notification.action_label || 'Voir détails'}
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </NeaCard>
        </motion.div>
    );
};

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('unread');
    const [filterCategory, setFilterCategory] = useState('all');
    const { containerVariants, itemVariants } = useStaggerAnimation();
    const navigate = useNavigate();

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        try {
            const user = await base44.auth.me();
            const data = await base44.entities.UserNotification.filter(
                { user_email: user.email },
                '-created_date',
                100
            );
            setNotifications(data);
        } catch (error) {
            console.error("Erreur chargement notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkRead = async (notification) => {
        try {
            await base44.entities.UserNotification.update(notification.id, {
                is_read: true,
                read_at: new Date().toISOString()
            });
            await loadNotifications();
            toast.success("Notification marquée comme lue");
        } catch (error) {
            console.error("Erreur marquage lu:", error);
            toast.error("Échec du marquage");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const unreadNotifs = notifications.filter(n => !n.is_read && !n.is_archived);
            await Promise.all(unreadNotifs.map(n => 
                base44.entities.UserNotification.update(n.id, { 
                    is_read: true,
                    read_at: new Date().toISOString()
                })
            ));
            await loadNotifications();
            toast.success(`${unreadNotifs.length} notification(s) marquée(s) comme lue(s)`);
        } catch (error) {
            console.error("Erreur marquage tout lu:", error);
            toast.error("Échec du marquage");
        }
    };

    const handleArchive = async (notification) => {
        try {
            await base44.entities.UserNotification.update(notification.id, {
                is_archived: true
            });
            await loadNotifications();
            toast.success("Notification archivée");
        } catch (error) {
            console.error("Erreur archivage:", error);
            toast.error("Échec de l'archivage");
        }
    };

    const handleDelete = async (notification) => {
        try {
            await base44.entities.UserNotification.delete(notification.id);
            await loadNotifications();
            toast.success("Notification supprimée");
        } catch (error) {
            console.error("Erreur suppression:", error);
            toast.error("Échec de la suppression");
        }
    };

    const handleNavigate = (notification) => {
        if (notification.action_url) {
            navigate(notification.action_url);
        }
    };

    const filteredNotifications = useMemo(() => {
        let filtered = notifications;

        // Filter by tab
        if (activeTab === 'unread') {
            filtered = filtered.filter(n => !n.is_read && !n.is_archived);
        } else if (activeTab === 'read') {
            filtered = filtered.filter(n => n.is_read && !n.is_archived);
        } else if (activeTab === 'archived') {
            filtered = filtered.filter(n => n.is_archived);
        }

        // Filter by category
        if (filterCategory !== 'all') {
            filtered = filtered.filter(n => n.category === filterCategory);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(n => 
                n.title.toLowerCase().includes(term) ||
                n.message.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [notifications, activeTab, filterCategory, searchTerm]);

    const stats = useMemo(() => {
        const unread = notifications.filter(n => !n.is_read && !n.is_archived).length;
        const read = notifications.filter(n => n.is_read && !n.is_archived).length;
        const archived = notifications.filter(n => n.is_archived).length;
        return { unread, read, archived, total: notifications.length };
    }, [notifications]);

    if (isLoading) {
        return <LoadingTransition message="Chargement des notifications..." />;
    }

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Centre de Notifications", href: "NotificationCenter" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Bell className="w-8 h-8 text-blue-400" />}
                    title="Centre de Notifications"
                    subtitle={`${stats.unread} notification${stats.unread > 1 ? 's' : ''} non lue${stats.unread > 1 ? 's' : ''}`}
                    actions={
                        <NeaButton onClick={handleMarkAllRead} disabled={stats.unread === 0}>
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Tout marquer comme lu
                        </NeaButton>
                    }
                />
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4">
                <NeaCard className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                    <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 text-blue-400" />
                        <div>
                            <p className="text-2xl font-bold text-[var(--nea-text-title)]">{stats.unread}</p>
                            <p className="text-xs text-[var(--nea-text-secondary)]">Non lues</p>
                        </div>
                    </div>
                </NeaCard>
                <NeaCard className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <div>
                            <p className="text-2xl font-bold text-[var(--nea-text-title)]">{stats.read}</p>
                            <p className="text-xs text-[var(--nea-text-secondary)]">Lues</p>
                        </div>
                    </div>
                </NeaCard>
                <NeaCard className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                    <div className="flex items-center gap-3">
                        <Archive className="w-8 h-8 text-purple-400" />
                        <div>
                            <p className="text-2xl font-bold text-[var(--nea-text-title)]">{stats.archived}</p>
                            <p className="text-xs text-[var(--nea-text-secondary)]">Archivées</p>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--nea-text-secondary)]" />
                            <Input
                                placeholder="Rechercher dans les notifications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-default)] text-[var(--nea-text-primary)]"
                        >
                            <option value="all">Toutes catégories</option>
                            <option value="System">Système</option>
                            <option value="Prediction">Prédiction</option>
                            <option value="Security">Sécurité</option>
                            <option value="Update">Mise à jour</option>
                            <option value="Subscription">Abonnement</option>
                            <option value="General">Général</option>
                        </select>
                    </div>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="unread">
                            <Bell className="w-4 h-4 mr-2" />
                            Non lues ({stats.unread})
                        </TabsTrigger>
                        <TabsTrigger value="read">
                            Lues ({stats.read})
                        </TabsTrigger>
                        <TabsTrigger value="archived">
                            <Archive className="w-4 h-4 mr-2" />
                            Archivées ({stats.archived})
                        </TabsTrigger>
                        <TabsTrigger value="all">
                            Toutes ({stats.total})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {filteredNotifications.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <NeaCard className="p-12 text-center">
                                        <Bell className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                                            Aucune notification
                                        </h3>
                                        <p className="text-[var(--nea-text-secondary)]">
                                            {activeTab === 'unread' && 'Vous êtes à jour !'}
                                            {activeTab === 'read' && 'Aucune notification lue'}
                                            {activeTab === 'archived' && 'Aucune notification archivée'}
                                            {activeTab === 'all' && 'Aucune notification pour le moment'}
                                        </p>
                                    </NeaCard>
                                </motion.div>
                            ) : (
                                filteredNotifications.map(notification => (
                                    <NotificationCard
                                        key={notification.id}
                                        notification={notification}
                                        onMarkRead={handleMarkRead}
                                        onArchive={handleArchive}
                                        onDelete={handleDelete}
                                        onNavigate={handleNavigate}
                                    />
                                ))
                            )}
                        </AnimatePresence>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </motion.div>
    );
}