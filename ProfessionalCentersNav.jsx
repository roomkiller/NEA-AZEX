import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
    Shield, Activity, FileText, Globe, DollarSign, Cloud, ShieldAlert,
    Zap, Anchor, Rocket, Package, Building, Database, Radio, Users, Newspaper, 
    Wheat, Cpu, Scale, Leaf, GraduationCap, Plane, Droplet, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import NeaCard from '../ui/NeaCard';

const PROFESSIONAL_CENTERS = [
    { name: "Intelligence Militaire", url: "MilitaryIntelligence", icon: Shield, color: "text-red-400" },
    { name: "Santé Publique", url: "PublicHealthMonitor", icon: Activity, color: "text-red-400" },
    { name: "Investigation", url: "InvestigativeJournalism", icon: FileText, color: "text-blue-400" },
    { name: "Diplomatie", url: "DiplomaticIntelligence", icon: Globe, color: "text-purple-400" },
    { name: "Finance", url: "FinancialIntelligence", icon: DollarSign, color: "text-green-400" },
    { name: "Météorologie", url: "ClimateWeatherCenter", icon: Cloud, color: "text-cyan-400" },
    { name: "Forces de l'Ordre", url: "LawEnforcementCenter", icon: ShieldAlert, color: "text-orange-400" },
    { name: "Énergie", url: "EnergyCenter", icon: Zap, color: "text-yellow-400" },
    { name: "Maritime", url: "MaritimeIntelligence", icon: Anchor, color: "text-blue-400" },
    { name: "Spatial", url: "SpaceCenter", icon: Rocket, color: "text-purple-400" },
    { name: "Supply Chain", url: "SupplyChainIntelligence", icon: Package, color: "text-orange-400" },
    { name: "Corporatif", url: "CorporateIntelligence", icon: Building, color: "text-gray-400" },
    { name: "Infrastructure", url: "CriticalInfrastructure", icon: Database, color: "text-red-400" },
    { name: "Agriculture", url: "AgricultureSecurityCenter", icon: Wheat, color: "text-green-400" },
    { name: "Télécom", url: "TelecommunicationsCenter", icon: Radio, color: "text-cyan-400" },
    { name: "Commerce", url: "TradeIntelligence", icon: DollarSign, color: "text-yellow-400" },
    { name: "Migration", url: "MigrationBorderSecurity", icon: Users, color: "text-purple-400" },
    { name: "Tech & Innovation", url: "TechnologyInnovationCenter", icon: Cpu, color: "text-blue-400" },
    { name: "Médias", url: "MediaInfluenceCenter", icon: Newspaper, color: "text-orange-400" },
    { name: "Juridique", url: "LegalIntelligence", icon: Scale, color: "text-indigo-400" },
    { name: "Environnement", url: "EnvironmentalIntelligence", icon: Leaf, color: "text-emerald-400" },
    { name: "Éducation & Recherche", url: "EducationResearchCenter", icon: GraduationCap, color: "text-violet-400" },
    { name: "Transport & Mobilité", url: "TransportMobilityCenter", icon: Plane, color: "text-sky-400" },
    { name: "Ressources Hydriques", url: "WaterResourcesCenter", icon: Droplet, color: "text-blue-400" },
    { name: "Tourisme & Hôtellerie", url: "TourismHospitalityCenter", icon: MapPin, color: "text-pink-400" }
];

export default function ProfessionalCentersNav() {
    const location = useLocation();

    return (
        <NeaCard className="sticky top-0 z-10 bg-[var(--nea-bg-surface)]/95 backdrop-blur-sm">
            <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-[var(--nea-primary-blue)]" />
                    <h3 className="text-xs font-semibold text-[var(--nea-text-secondary)] uppercase tracking-wider">
                        Centres Professionnels ({PROFESSIONAL_CENTERS.length})
                    </h3>
                </div>
                <div className="flex overflow-x-auto gap-2 pb-2 styled-scrollbar">
                    {PROFESSIONAL_CENTERS.map((center) => {
                        const Icon = center.icon;
                        const isActive = location.pathname === createPageUrl(center.url);

                        return (
                            <Link
                                key={center.url}
                                to={createPageUrl(center.url)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border",
                                    "hover:scale-105 active:scale-95",
                                    isActive
                                        ? "bg-[var(--nea-primary-blue)]/20 text-[var(--nea-text-title)] border-[var(--nea-primary-blue)] shadow-lg shadow-[var(--nea-primary-blue)]/20"
                                        : "bg-[var(--nea-bg-surface-hover)] text-[var(--nea-text-secondary)] border-[var(--nea-border-default)] hover:bg-[var(--nea-bg-surface)] hover:text-[var(--nea-text-primary)] hover:border-[var(--nea-primary-blue)]/50"
                                )}
                                aria-label={`Naviguer vers ${center.name}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <Icon className={cn("w-4 h-4", isActive ? "text-[var(--nea-primary-blue)]" : center.color)} />
                                <span>{center.name}</span>
                                {isActive && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--nea-primary-blue)] animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </NeaCard>
    );
}