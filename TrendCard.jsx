import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function TrendCard({ trend }) {
    const getDomainColor = (domain) => {
        const colors = {
            'Géopolitique': 'bg-blue-500/20 text-blue-400',
            'Économie': 'bg-green-500/20 text-green-400',
            'Société': 'bg-purple-500/20 text-purple-400',
            'Technologie': 'bg-orange-500/20 text-orange-400',
            'Environnement': 'bg-cyan-500/20 text-cyan-400'
        };
        return colors[domain] || 'bg-gray-500/20 text-gray-400';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-500/20 text-green-400';
            case 'Monitoring': return 'bg-yellow-500/20 text-yellow-400';
            case 'Archived': return 'bg-gray-500/20 text-gray-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const isGrowing = (trend.growth_rate || 0) > 0;

    return (
        <div className="p-4 rounded-lg bg-[var(--nea-bg-surface-hover)] border border-[var(--nea-border-subtle)] hover:border-[var(--nea-primary-blue)] transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getDomainColor(trend.domain)} border-0 text-xs`}>
                            {trend.domain}
                        </Badge>
                        <Badge className={`${getStatusColor(trend.status)} border-0 text-xs`}>
                            {trend.status}
                        </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--nea-text-title)] mb-2">
                        {trend.trend_name}
                    </h3>
                </div>
                <div className="text-right shrink-0">
                    {isGrowing ? (
                        <TrendingUp className="w-6 h-6 text-green-400" />
                    ) : (
                        <TrendingDown className="w-6 h-6 text-red-400" />
                    )}
                    <p className={`text-sm font-bold mt-1 ${isGrowing ? 'text-green-400' : 'text-red-400'}`}>
                        {trend.growth_rate > 0 ? '+' : ''}{(trend.growth_rate || 0).toFixed(1)}%
                    </p>
                </div>
            </div>
            <div className="mb-2">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[var(--nea-text-secondary)]">Élan de la tendance</span>
                    <span className="font-semibold text-[var(--nea-text-primary)]">{trend.momentum_score}/100</span>
                </div>
                <Progress value={trend.momentum_score} className="h-2" />
            </div>
            {trend.analysis_period && (
                <p className="text-xs text-[var(--nea-text-secondary)] mt-2">
                    Période: {new Date(trend.analysis_period.start_date).toLocaleDateString('fr-CA')} - {new Date(trend.analysis_period.end_date).toLocaleDateString('fr-CA')}
                </p>
            )}
        </div>
    );
}