import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Wrench, Cpu, Shield, Crown, Lock, ChevronRight, Zap, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

const ROLE_CONFIG = {
    user: {
        icon: Target,
        title: "Utilisateur",
        dashboard: "UserDashboard",
        color: "blue",
        gradient: "from-blue-500/20 to-blue-600/20",
        borderGradient: "from-blue-500 to-blue-600",
        description: "Poste de veille - Accès aux données essentielles",
        level: 1
    },
    technician: {
        icon: Wrench,
        title: "Technicien",
        dashboard: "TechnicianDashboard",
        color: "cyan",
        gradient: "from-cyan-500/20 to-cyan-600/20",
        borderGradient: "from-cyan-500 to-cyan-600",
        description: "Centre de contrôle - Gestion technique du système",
        level: 2
    },
    developer: {
        icon: Cpu,
        title: "Développeur",
        dashboard: "DeveloperDashboard",
        color: "purple",
        gradient: "from-purple-500/20 to-purple-600/20",
        borderGradient: "from-purple-500 to-purple-600",
        description: "Atelier - Développement et analyse avancée",
        level: 3
    },
    admin: {
        icon: Shield,
        title: "Administrateur",
        dashboard: "AdminDashboard",
        color: "red",
        gradient: "from-red-500/20 to-red-600/20",
        borderGradient: "from-red-500 to-red-600",
        description: "Pont de commandement - Contrôle total",
        level: 4
    },
    master: {
        icon: Crown,
        title: "Master",
        dashboard: "MasterDashboard",
        color: "yellow",
        gradient: "from-yellow-500/20 to-yellow-600/20",
        borderGradient: "from-yellow-500 to-yellow-600",
        description: "Nexus absolu - Accès illimité au système",
        level: 5
    }
};

const ROLE_HIERARCHY = { user: 1, technician: 2, developer: 3, admin: 5, master: 5 };

export default function QuickRoleSwitcher({ currentUserRole, currentDisplayRole, isOpen, onClose }) {
    const [selectedRole, setSelectedRole] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();

    const handleRoleSwitch = async (targetRole) => {
        const realRoleLevel = ROLE_HIERARCHY[currentUserRole] || 1;
        const targetRoleLevel = ROLE_HIERARCHY[targetRole] || 1;

        if (targetRoleLevel > realRoleLevel) {
            toast.error("Accès refusé", {
                description: `Votre niveau d'autorisation ne permet pas d'accéder à cette interface.`
            });
            return;
        }

        setIsTransitioning(true);
        setSelectedRole(targetRole);

        await new Promise(resolve => setTimeout(resolve, 500));

        if (targetRole === currentUserRole) {
            localStorage.removeItem('impersonated_role');
        } else {
            localStorage.setItem('impersonated_role', targetRole);
        }

        const dashboardUrl = ROLE_CONFIG[targetRole].dashboard;
        
        toast.success(`Interface changée`, {
            description: `Vous êtes maintenant en mode ${ROLE_CONFIG[targetRole].title}`,
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

    const availableRoles = Object.entries(ROLE_CONFIG).filter(([role]) => 
        isRoleAccessible(role)
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1a1f2e] border-2 border-[var(--nea-border-default)] max-w-5xl p-0 gap-0 rounded-2xl overflow-hidden shadow-2xl">
                {/* Header avec gradient */}
                <div className="relative bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-b border-[var(--nea-border-default)] p-6">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-[var(--nea-text-title)]">
                                    Changement d'Interface
                                </DialogTitle>
                                <DialogDescription className="text-[var(--nea-text-secondary)] mt-1">
                                    Adaptez votre environnement de travail en un clic
                                </DialogDescription>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center"
                        >
                            <X className="w-5 h-5 text-[var(--nea-text-secondary)]" />
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-[#1a1f2e]">
                    {/* Current Interface Indicator */}
                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                        <p className="text-xs font-semibold text-[var(--nea-text-secondary)] mb-2 uppercase tracking-wider">Interface Actuelle</p>
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ROLE_CONFIG[currentDisplayRole].gradient} border-2 border-${ROLE_CONFIG[currentDisplayRole].color}-500/30 flex items-center justify-center shadow-lg`}>
                                {React.createElement(ROLE_CONFIG[currentDisplayRole].icon, { 
                                    className: `w-6 h-6 text-${ROLE_CONFIG[currentDisplayRole].color}-400` 
                                })}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[var(--nea-text-title)]">
                                    {ROLE_CONFIG[currentDisplayRole].title}
                                </h3>
                                <p className="text-xs text-[var(--nea-text-secondary)]">
                                    {ROLE_CONFIG[currentDisplayRole].description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Role Selection Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <AnimatePresence mode="wait">
                            {availableRoles.map(([role, config], index) => {
                                const Icon = config.icon;
                                const isActive = role === currentDisplayRole;
                                const isSwitching = role === selectedRole && isTransitioning;

                                return (
                                    <motion.button
                                        key={role}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => !isActive && handleRoleSwitch(role)}
                                        disabled={isActive || isTransitioning}
                                        className={cn(
                                            "relative group p-6 rounded-xl border-2 transition-all text-left overflow-hidden bg-[#232936]",
                                            isActive && "border-cyan-500 shadow-lg shadow-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10",
                                            !isActive && "border-[var(--nea-border-default)] hover:border-cyan-500/50 hover:shadow-lg hover:scale-[1.02]",
                                            isSwitching && "animate-pulse"
                                        )}
                                    >
                                        {/* Background gradient on hover */}
                                        {!isActive && (
                                            <div className={cn(
                                                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity",
                                                config.gradient
                                            )}></div>
                                        )}

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={cn(
                                                    "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                                                    config.gradient,
                                                    `border-2 border-${config.color}-500/30`
                                                )}>
                                                    <Icon className={`w-7 h-7 text-${config.color}-400`} />
                                                </div>
                                                <div>
                                                    {isActive ? (
                                                        <Badge className="bg-cyan-500/20 text-cyan-400 border-0 shadow-lg">
                                                            ACTUEL
                                                        </Badge>
                                                    ) : isSwitching ? (
                                                        <Badge className="bg-blue-500/20 text-blue-400 border-0 animate-pulse">
                                                            CHARGEMENT
                                                        </Badge>
                                                    ) : (
                                                        <ChevronRight className="w-6 h-6 text-[var(--nea-text-secondary)] group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                                                {config.title}
                                            </h3>
                                            <p className="text-sm text-[var(--nea-text-secondary)] leading-relaxed">
                                                {config.description}
                                            </p>

                                            <div className="mt-4 pt-4 border-t border-[var(--nea-border-subtle)]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-[var(--nea-text-secondary)] font-medium">
                                                        Niveau {config.level}
                                                    </span>
                                                    {!isActive && (
                                                        <span className={`text-xs text-${config.color}-400 font-semibold group-hover:translate-x-1 transition-transform`}>
                                                            Accéder →
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Locked Roles */}
                    {Object.entries(ROLE_CONFIG).filter(([role]) => !isRoleAccessible(role)).length > 0 && (
                        <div className="mt-6">
                            <p className="text-sm text-[var(--nea-text-secondary)] mb-3 flex items-center gap-2 font-semibold">
                                <Lock className="w-4 h-4" />
                                Interfaces Verrouillées
                            </p>
                            <div className="grid md:grid-cols-2 gap-3">
                                {Object.entries(ROLE_CONFIG)
                                    .filter(([role]) => !isRoleAccessible(role))
                                    .map(([role, config]) => {
                                        const Icon = config.icon;
                                        return (
                                            <div
                                                key={role}
                                                className="p-4 rounded-lg bg-[#232936] border border-[var(--nea-border-subtle)] opacity-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                                                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-[var(--nea-text-title)] text-sm">
                                                            {config.title}
                                                        </h4>
                                                        <p className="text-xs text-[var(--nea-text-secondary)]">
                                                            Autorisation requise
                                                        </p>
                                                    </div>
                                                    <Lock className="w-4 h-4 text-red-400" />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Help Text */}
                    <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20">
                        <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-[var(--nea-text-secondary)] leading-relaxed">
                                    <strong className="text-blue-400">Conseil:</strong> Chaque interface est optimisée pour des tâches spécifiques. 
                                    Changez librement selon vos besoins. Vos préférences et données restent sauvegardées.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}