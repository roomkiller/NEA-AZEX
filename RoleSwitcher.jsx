import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Wrench, Cpu, Shield, Crown, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import NeaCard from '../ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ROLE_CONFIG = {
    user: {
        icon: Target,
        title: "Utilisateur",
        dashboard: "UserDashboard",
        color: "blue",
        description: "Poste de veille basique",
        requiredPlan: "DISCOVERY",
        features: ["Accès aux prédictions", "Signaux faibles", "Tableaux de bord"]
    },
    technician: {
        icon: Wrench,
        title: "Technicien",
        dashboard: "TechnicianDashboard",
        color: "cyan",
        description: "Centre de contrôle technique",
        requiredPlan: "SOLO",
        features: ["Gestion modules", "Monitoring système", "Configuration réseau"]
    },
    developer: {
        icon: Cpu,
        title: "Développeur",
        dashboard: "DeveloperDashboard",
        color: "purple",
        description: "Atelier de développement",
        requiredPlan: "TEAM",
        features: ["Analyse avancée", "Corrélation", "Automatisation", "Macros"]
    },
    admin: {
        icon: Shield,
        title: "Administrateur",
        dashboard: "AdminDashboard",
        color: "red",
        description: "Pont de commandement",
        requiredPlan: "ENTERPRISE",
        features: ["Gestion utilisateurs", "Protocoles avancés", "Sécurité", "Configuration système"]
    },
    master: {
        icon: Crown,
        title: "Master",
        dashboard: "MasterDashboard",
        color: "yellow",
        description: "Contrôle absolu du système",
        requiredPlan: "ADMIN_ONLY",
        features: ["Accès complet", "Tous les protocoles", "Architecture système"]
    }
};

const ROLE_HIERARCHY = { user: 1, technician: 2, developer: 3, admin: 5, master: 5 };

export default function RoleSwitcher({ currentUserRole, currentDisplayRole, subscription }) {
    const [hoveredRole, setHoveredRole] = useState(null);
    const [switchingTo, setSwitchingTo] = useState(null);
    const navigate = useNavigate();

    const handleRoleSwitch = async (targetRole) => {
        const realRoleLevel = ROLE_HIERARCHY[currentUserRole] || 1;
        const targetRoleLevel = ROLE_HIERARCHY[targetRole] || 1;

        if (targetRoleLevel > realRoleLevel) {
            toast.error("Accès refusé", {
                description: "Votre niveau d'autorisation ne permet pas d'accéder à cette interface."
            });
            return;
        }

        setSwitchingTo(targetRole);

        await new Promise(resolve => setTimeout(resolve, 800));

        if (targetRole === currentUserRole) {
            localStorage.removeItem('impersonated_role');
        } else {
            localStorage.setItem('impersonated_role', targetRole);
        }

        const dashboardUrl = ROLE_CONFIG[targetRole].dashboard;
        
        toast.success(`Interface changée avec succès`, {
            description: `Bienvenue dans l'interface ${ROLE_CONFIG[targetRole].title}`,
            icon: React.createElement(ROLE_CONFIG[targetRole].icon, { className: "w-5 h-5" })
        });

        navigate(createPageUrl(dashboardUrl));
        window.location.reload();
    };

    const isRoleAccessible = (role) => {
        const realRoleLevel = ROLE_HIERARCHY[currentUserRole] || 1;
        const targetRoleLevel = ROLE_HIERARCHY[role] || 1;
        return targetRoleLevel <= realRoleLevel;
    };

    const getPlanBadge = (requiredPlan) => {
        const planColors = {
            'DISCOVERY': 'bg-blue-500/20 text-blue-400',
            'SOLO': 'bg-purple-500/20 text-purple-400',
            'TEAM': 'bg-green-500/20 text-green-400',
            'ENTERPRISE': 'bg-yellow-500/20 text-yellow-400',
            'ADMIN_ONLY': 'bg-red-500/20 text-red-400'
        };
        return planColors[requiredPlan] || 'bg-gray-500/20 text-gray-400';
    };

    const accessPercentage = useMemo(() => {
        const totalRoles = Object.keys(ROLE_CONFIG).length;
        const accessibleRoles = Object.keys(ROLE_CONFIG).filter(isRoleAccessible).length;
        return Math.round((accessibleRoles / totalRoles) * 100);
    }, [currentUserRole]);

    return (
        <div className="space-y-6">
            {/* Access Summary */}
            <NeaCard className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-[var(--nea-text-title)] mb-1">
                            Votre Niveau d'Accès
                        </h3>
                        <p className="text-sm text-[var(--nea-text-secondary)]">
                            Vous avez accès à {Object.keys(ROLE_CONFIG).filter(isRoleAccessible).length} interface(s) sur {Object.keys(ROLE_CONFIG).length}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-cyan-400">{accessPercentage}%</p>
                        <p className="text-xs text-[var(--nea-text-secondary)]">Accès Système</p>
                    </div>
                </div>
                <Progress value={accessPercentage} className="h-2" />
            </NeaCard>

            {/* Role Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {Object.entries(ROLE_CONFIG).map(([role, config], index) => {
                        const Icon = config.icon;
                        const isAccessible = isRoleAccessible(role);
                        const isActive = role === currentDisplayRole;
                        const isSwitching = role === switchingTo;

                        return (
                            <motion.div
                                key={role}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                onMouseEnter={() => setHoveredRole(role)}
                                onMouseLeave={() => setHoveredRole(null)}
                            >
                                <NeaCard 
                                    className={cn(
                                        "p-5 h-full transition-all relative overflow-hidden",
                                        isActive && "border-2 border-cyan-500 shadow-lg shadow-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10",
                                        !isAccessible && "opacity-50",
                                        isAccessible && !isActive && "hover:border-cyan-500 hover:shadow-md cursor-pointer",
                                        isSwitching && "animate-pulse"
                                    )}
                                    onClick={() => isAccessible && !isActive && handleRoleSwitch(role)}
                                >
                                    {/* Status Badges */}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        {!isAccessible && (
                                            <Badge className="bg-red-500/20 text-red-400 border-0 text-xs flex items-center gap-1">
                                                <Lock className="w-3 h-3" />
                                                Verrouillé
                                            </Badge>
                                        )}
                                        {isActive && (
                                            <Badge className="bg-cyan-500/20 text-cyan-400 border-0 text-xs flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                ACTUEL
                                            </Badge>
                                        )}
                                        {isSwitching && (
                                            <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs animate-pulse">
                                                Chargement...
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Icon */}
                                    <div className={cn(
                                        "p-3 rounded-lg inline-flex mb-4",
                                        `bg-${config.color}-500/20`,
                                        hoveredRole === role && isAccessible && "scale-110 transition-transform"
                                    )}>
                                        <Icon className={`w-8 h-8 text-${config.color}-400`} />
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-lg font-bold text-[var(--nea-text-title)] mb-2">
                                        {config.title}
                                    </h3>
                                    <p className="text-xs text-[var(--nea-text-secondary)] mb-4">
                                        {config.description}
                                    </p>

                                    {/* Plan Badge */}
                                    <Badge className={`${getPlanBadge(config.requiredPlan)} border-0 text-xs mb-4`}>
                                        {config.requiredPlan.replace('_', ' ')}
                                    </Badge>

                                    {/* Features */}
                                    {hoveredRole === role && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-4 pt-4 border-t border-[var(--nea-border-subtle)]"
                                        >
                                            <p className="text-xs font-semibold text-[var(--nea-text-primary)] mb-2">
                                                Fonctionnalités:
                                            </p>
                                            <ul className="space-y-1">
                                                {config.features.map((feature, idx) => (
                                                    <li key={idx} className="text-xs text-[var(--nea-text-secondary)] flex items-start gap-2">
                                                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}

                                    {/* Access Warning */}
                                    {!isAccessible && (
                                        <div className="mt-4 p-2 rounded bg-red-500/10 border border-red-500/20">
                                            <p className="text-xs text-red-400 flex items-center gap-2">
                                                <AlertTriangle className="w-3 h-3" />
                                                {role === 'master' && currentUserRole !== 'admin' ? 
                                                    'Réservé aux administrateurs' : 
                                                    'Niveau d\'autorisation insuffisant'}
                                            </p>
                                        </div>
                                    )}
                                </NeaCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Help Section */}
            <NeaCard className="p-6 bg-blue-500/5 border-blue-500/20">
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-[var(--nea-text-title)] mb-2">
                            Changement d'Interface Instantané
                        </h3>
                        <p className="text-sm text-[var(--nea-text-secondary)]">
                            Adaptez votre interface à vos besoins. Chaque rôle offre des fonctionnalités 
                            spécifiques optimisées pour différents cas d'usage. Le changement est immédiat 
                            et vous pouvez revenir à tout moment.
                        </p>
                    </div>
                </div>
            </NeaCard>
        </div>
    );
}