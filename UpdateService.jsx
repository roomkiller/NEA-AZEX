import { base44 } from '@/api/base44Client';

let lastCheck = {
    incidents: null,
    signals: null,
    predictions: null
};

export async function checkForUpdates() {
    try {
        const now = Date.now();
        const fiveMinutesAgo = new Date(now - 5 * 60 * 1000).toISOString();

        // Faire les appels en séquence avec un délai pour éviter le rate limiting
        const [incidents, signals, predictions] = await Promise.all([
            base44.entities.SecurityIncident.filter(
                { detected_timestamp: { $gte: fiveMinutesAgo } },
                '-detected_timestamp',
                10
            ).catch(() => []),
            
            // Attendre 200ms avant le prochain appel
            new Promise(resolve => setTimeout(resolve, 200)).then(() =>
                base44.entities.MediaSignal.filter(
                    { detection_timestamp: { $gte: fiveMinutesAgo } },
                    '-detection_timestamp',
                    10
                ).catch(() => [])
            ),
            
            // Attendre 200ms avant le prochain appel
            new Promise(resolve => setTimeout(resolve, 400)).then(() =>
                base44.entities.EventPrediction.filter(
                    { created_date: { $gte: fiveMinutesAgo } },
                    '-created_date',
                    10
                ).catch(() => [])
            )
        ]);

        const newIncidents = lastCheck.incidents 
            ? incidents.filter(inc => !lastCheck.incidents.some(prev => prev.id === inc.id))
            : [];
        
        const newSignals = lastCheck.signals
            ? signals.filter(sig => !lastCheck.signals.some(prev => prev.id === sig.id))
            : [];

        const newPredictions = lastCheck.predictions
            ? predictions.filter(pred => !lastCheck.predictions.some(prev => prev.id === pred.id))
            : [];

        lastCheck = { incidents, signals, predictions };

        return {
            newIncidents,
            newSignals,
            newPredictions
        };
    } catch (error) {
        console.error("Erreur checkForUpdates:", error);
        return {
            newIncidents: [],
            newSignals: [],
            newPredictions: []
        };
    }
}