import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Users, Search, RefreshCw, UserPlus } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';
import { toast } from 'sonner';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const { containerVariants, itemVariants } = useStaggerAnimation();

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await base44.entities.User.list();
            setUsers(data);
        } catch (error) {
            console.error("Erreur chargement utilisateurs:", error);
            toast.error("Échec du chargement des utilisateurs");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const stats = {
        total: users.length,
        admin: users.filter(u => u.role === 'admin').length,
        developer: users.filter(u => u.role === 'developer').length,
        technician: users.filter(u => u.role === 'technician').length,
        user: users.filter(u => u.role === 'user').length
    };

    const roleColors = {
        'admin': 'bg-red-500/20 text-red-400 border-red-500/30',
        'developer': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        'technician': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        'user': 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    if (isLoading) {
        return <LoadingTransition message="Chargement des utilisateurs..." />;
    }

    return (
        <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[{ name: "Gestion des Utilisateurs", href: "UserManagement" }]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader 
                    icon={<Users className="w-8 h-8 text-blue-400" />}
                    title="Gestion des Utilisateurs"
                    subtitle={`${filteredUsers.length} utilisateurs`}
                    actions={
                        <NeaButton onClick={loadUsers}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Actualiser
                        </NeaButton>
                    }
                />
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-5 gap-4">
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
                    <p className="text-3xl font-bold text-red-400">{stats.admin}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Développeurs</p>
                    <p className="text-3xl font-bold text-purple-400">{stats.developer}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Techniciens</p>
                    <p className="text-3xl font-bold text-cyan-400">{stats.technician}</p>
                </NeaCard>
                <NeaCard className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.user}</p>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard>
                    <div className="p-4 border-b border-[var(--nea-border-default)]">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <Input
                                    placeholder="Rechercher un utilisateur..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white pl-10"
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full md:w-48 bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-gray-900 dark:text-white">
                                    <SelectValue placeholder="Rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous rôles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="developer">Développeur</SelectItem>
                                    <SelectItem value="technician">Technicien</SelectItem>
                                    <SelectItem value="user">Utilisateur</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="divide-y divide-[var(--nea-border-subtle)]">
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-6 hover:bg-[var(--nea-bg-surface-hover)] transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {user.full_name || 'N/A'}
                                            </h3>
                                            <Badge className={roleColors[user.role] || roleColors['user']}>
                                                {user.role}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {user.email}
                                        </p>
                                        {user.created_date && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                Créé le {new Date(user.created_date).toLocaleDateString('fr-CA')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}