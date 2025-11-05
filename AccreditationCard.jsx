import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NeaCard from '../ui/NeaCard';
import NeaButton from '../ui/NeaButton';
import { ShieldCheck, ShieldAlert, ShieldX, User, Calendar, MapPin, Award, XCircle, Pause, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
    Active: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', icon: ShieldCheck },
    Suspended: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: ShieldAlert },
    Revoked: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: ShieldX },
    Pending: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: ShieldCheck },
};

const roleColors = {
    technician: 'text-cyan-400',
    developer: 'text-purple-400',
    admin: 'text-red-400',
};

const clearanceColors = {
    Restricted: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    Confidential: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    Secret: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    Top_Secret: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export default function AccreditationCard({ accreditation, onRevoke, onSuspend, onActivate }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const config = statusConfig[accreditation.status] || statusConfig.Active;
    const StatusIcon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <NeaCard className="overflow-hidden hover:border-[var(--nea-primary-blue)]/50 transition-colors">
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <StatusIcon className={`w-6 h-6 ${config.text}`} />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{accreditation.username}</h3>
                                    <p className="text-sm text-[var(--nea-text-secondary)]">{accreditation.user_email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-[var(--nea-text-muted)]" />
                                    <div>
                                        <p className="text-xs text-[var(--nea-text-secondary)]">Rôle</p>
                                        <p className={`text-sm font-semibold ${roleColors[accreditation.role]}`}>
                                            {accreditation.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-[var(--nea-text-muted)]" />
                                    <div>
                                        <p className="text-xs text-[var(--nea-text-secondary)]">Niveau d'accès</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{accreditation.access_level}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[var(--nea-text-muted)]" />
                                    <div>
                                        <p className="text-xs text-[var(--nea-text-secondary)]">Émise le</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {new Date(accreditation.issued_date).toLocaleDateString('fr-CA')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[var(--nea-text-muted)]" />
                                    <div>
                                        <p className="text-xs text-[var(--nea-text-secondary)]">Département</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {accreditation.department || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <Badge className={`${config.bg} ${config.text} ${config.border} border`}>
                                    {accreditation.status}
                                </Badge>
                                <Badge className={`${clearanceColors[accreditation.security_clearance]} border`}>
                                    {accreditation.security_clearance}
                                </Badge>
                                <span className="text-xs text-[var(--nea-text-secondary)] font-mono">
                                    {accreditation.accreditation_number}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {accreditation.status === 'Active' && (
                                <>
                                    <NeaButton
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => onSuspend(accreditation.id)}
                                    >
                                        <Pause className="w-4 h-4 mr-2" />
                                        Suspendre
                                    </NeaButton>
                                    <NeaButton
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => onRevoke(accreditation.id)}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Révoquer
                                    </NeaButton>
                                </>
                            )}
                            {accreditation.status === 'Suspended' && (
                                <>
                                    <NeaButton
                                        size="sm"
                                        variant="primary"
                                        onClick={() => onActivate(accreditation.id)}
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        Activer
                                    </NeaButton>
                                    <NeaButton
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => onRevoke(accreditation.id)}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Révoquer
                                    </NeaButton>
                                </>
                            )}
                        </div>
                    </div>

                    {accreditation.notes && (
                        <div className="mt-4 p-3 bg-[var(--nea-bg-deep-space)] rounded-lg border border-[var(--nea-border-subtle)]">
                            <p className="text-xs text-[var(--nea-text-secondary)] mb-1">Notes:</p>
                            <p className="text-sm text-gray-900 dark:text-white">{accreditation.notes}</p>
                        </div>
                    )}
                </div>
            </NeaCard>
        </motion.div>
    );
}