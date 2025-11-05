
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Bell, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import ConfigureAlertsModal from './ConfigureAlertsModal';
import { exportBriefs } from './ExportService'; // Added import

export default function BriefActions({ onCreateBrief, onExport, onConfigureAlerts, showFilters, onToggleFilters, domain, briefs = [] }) { // Added briefs prop
    const [showAlertsModal, setShowAlertsModal] = React.useState(false);

    const handleExport = async (format) => { // Made async
        await exportBriefs(briefs, format, domain); // Added call to exportBriefs
        // toast.success(`Export ${format.toUpperCase()} en cours...`); // Removed this line, assuming exportBriefs handles toasts
        if (onExport) {
            onExport(format);
        }
    };

    const handleConfigureAlerts = () => {
        setShowAlertsModal(true);
        if (onConfigureAlerts) {
            onConfigureAlerts();
        }
    };

    return (
        <>
            <div className="flex items-center gap-3 flex-wrap">
                <Button onClick={onCreateBrief} className="bg-[var(--nea-primary-blue)] hover:bg-sky-500">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un Brief
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Exporter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleExport('pdf')}>
                            Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('csv')}>
                            Export CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('json')}>
                            Export JSON
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" onClick={handleConfigureAlerts}>
                    <Bell className="w-4 h-4 mr-2" />
                    Alertes
                </Button>

                <Button 
                    variant={showFilters ? "default" : "outline"} 
                    onClick={onToggleFilters}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                </Button>
            </div>

            <ConfigureAlertsModal 
                open={showAlertsModal}
                onClose={() => setShowAlertsModal(false)}
                domain={domain}
            />
        </>
    );
}
