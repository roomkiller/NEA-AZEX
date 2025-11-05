import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export const exportBriefs = async (briefs, format, domain) => {
    try {
        toast.info(`Génération de l'export ${format.toUpperCase()}...`);

        if (format === 'json') {
            // Export JSON direct
            const dataStr = JSON.stringify(briefs, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${domain}_briefs_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast.success('Export JSON téléchargé');
            return;
        }

        if (format === 'csv') {
            // Export CSV
            const headers = ['ID', 'Titre', 'Domaine', 'Priorité', 'Classification', 'Score Confiance', 'Date Création'];
            const rows = briefs.map(b => [
                b.id,
                b.brief_title,
                b.domain,
                b.priority_level,
                b.classification,
                b.confidence_score,
                new Date(b.created_date).toLocaleDateString('fr-CA')
            ]);
            
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');
            
            const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${domain}_briefs_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast.success('Export CSV téléchargé');
            return;
        }

        if (format === 'pdf') {
            // Génération PDF via LLM
            const briefsSummary = briefs.map((b, idx) => `
${idx + 1}. ${b.brief_title}
   - Priorité: ${b.priority_level}
   - Classification: ${b.classification}
   - Résumé: ${b.executive_summary}
   - Score: ${b.confidence_score}%
   - Date: ${new Date(b.created_date).toLocaleDateString('fr-CA')}
            `).join('\n');

            const prompt = `Génère un rapport PDF formaté en HTML pour ces briefings d'intelligence du domaine ${domain}:

${briefsSummary}

Le rapport doit inclure:
- En-tête avec logo NEA-AZEX et date
- Table des matières
- Section pour chaque brief avec détails complets
- Statistiques globales
- Classification appropriée

Format HTML complet avec styles CSS intégrés pour impression PDF.`;

            const response = await base44.integrations.Core.InvokeLLM({
                prompt: prompt,
                add_context_from_internet: false
            });

            // Créer un HTML et l'ouvrir pour impression
            const htmlContent = response || '<html><body><h1>Rapport NEA-AZEX</h1><p>Erreur génération</p></body></html>';
            const printWindow = window.open('', '_blank');
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            
            setTimeout(() => {
                printWindow.print();
                toast.success('Export PDF généré - Utilisez l\'impression du navigateur');
            }, 500);
        }

    } catch (error) {
        console.error('Erreur export:', error);
        toast.error(`Échec de l'export ${format.toUpperCase()}`);
    }
};