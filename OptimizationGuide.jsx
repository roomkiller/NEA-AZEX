import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Code, Database, Layers, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation } from '../components/navigation/PageTransition';
import ReactMarkdown from 'react-markdown';

const GUIDE_CONTENT = `
# Guide d'Optimisation des Performances NEA-AZEX

## 📊 Vue d'Ensemble

Ce guide détaille les meilleures pratiques pour optimiser les performances de vos composants et pages NEA-AZEX.

---

## 🚀 CacheService - Mise en Cache Intelligente

### Utilisation de Base

\`\`\`javascript
import cacheService from '@/components/performance/CacheService';

// Wrapper automatique avec cache
const data = await cacheService.withCache(
    'my_unique_key',
    async () => {
        // Votre fonction coûteuse ici
        return await base44.entities.Module.list();
    },
    {
        ttlHours: 1,                    // Durée de vie: 1 heure
        cacheType: 'Dashboard_Stats',   // Type pour catégorisation
        priority: 'High'                // Priorité (Low/Normal/High/Critical)
    }
);
\`\`\`

### Hook React pour Cache

\`\`\`javascript
import { useCachedData } from '@/components/performance/OptimizationProvider';

function MyComponent() {
    const { data, isLoading, error, refresh } = useCachedData(
        'modules_list',
        () => base44.entities.Module.list(),
        { ttlHours: 0.5, cacheType: 'Module_Data' }
    );

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;

    return <div>{/* Utiliser data */}</div>;
}
\`\`\`

### Invalidation du Cache

\`\`\`javascript
// Invalider un cache spécifique
await cacheService.invalidate('my_cache_key');

// Invalider tous les caches d'un type
await cacheService.invalidateByType('Dashboard_Stats');

// Vider complètement le cache
await cacheService.clearAll();
\`\`\`

---

## ⚡ Lazy Loading - Chargement Paresseux

### Créer un Composant Lazy

\`\`\`javascript
import { createLazyComponent } from '@/components/performance/LazyLoadWrapper';

// Composant chargé uniquement quand nécessaire
const HeavyChart = createLazyComponent(
    () => import('./components/HeavyChart'),
    {
        loadingMessage: "Chargement du graphique...",
        preload: false  // Précharger immédiatement si true
    }
);

function MyPage() {
    return (
        <div>
            <h1>Ma Page</h1>
            <HeavyChart data={chartData} />
        </div>
    );
}
\`\`\`

### Préchargement au Survol

\`\`\`javascript
import { usePreloadOnHover } from '@/components/performance/LazyLoadWrapper';

function MyButton() {
    const preloadProps = usePreloadOnHover(() => {
        // Précharger un composant quand on survole
        HeavyComponent.preload();
    });

    return (
        <button {...preloadProps}>
            Charger le Composant
        </button>
    );
}
\`\`\`

---

## 🎯 OptimizationProvider - Contexte Global

### Mode Économie d'Énergie

\`\`\`javascript
import { useOptimization } from '@/components/performance/OptimizationProvider';

function MyComponent() {
    const { 
        isLowPowerMode, 
        toggleLowPowerMode,
        prefersReducedMotion 
    } = useOptimization();

    return (
        <div>
            {!isLowPowerMode && <ExpensiveAnimation />}
            <button onClick={toggleLowPowerMode}>
                {isLowPowerMode ? 'Mode Normal' : 'Mode Économie'}
            </button>
        </div>
    );
}
\`\`\`

### Qualité d'Image Adaptative

\`\`\`javascript
const { getOptimizedImageQuality } = useOptimization();

// Retourne 60 en mode économie, 90 sinon
const quality = getOptimizedImageQuality();

<img 
    src={\`/api/image?quality=\${quality}\`}
    alt="Optimized"
/>
\`\`\`

---

## 📈 Meilleures Pratiques

### ✅ À Faire

1. **Utiliser le cache pour les données stables**
   - Modules système
   - Configurations
   - Statistiques qui changent peu

2. **Lazy load des composants lourds**
   - Graphiques complexes
   - Éditeurs de texte riches
   - Visualisations 3D

3. **Définir des TTL appropriés**
   - Données critiques: 5-15 minutes
   - Statistiques dashboard: 30 minutes - 1 heure
   - Données statiques: 6-24 heures

4. **Invalider le cache lors de modifications**
   \`\`\`javascript
   await base44.entities.Module.create(newModule);
   await cacheService.invalidateByType('Module_Data');
   \`\`\`

### ❌ À Éviter

1. **Ne PAS cacher des données temps réel**
   - Alertes de sécurité actives
   - Données de monitoring en direct
   - Statuts critiques

2. **Ne PAS définir de TTL trop longs**
   - Risque de données obsolètes
   - Maximum recommandé: 24 heures

3. **Ne PAS cacher les données utilisateur sensibles**
   - Mots de passe
   - Tokens d'authentification
   - Informations bancaires

---

## 🔧 Configuration Avancée

### Niveaux de Cache

\`\`\`javascript
// Cache en mémoire uniquement (ultra-rapide, non persistant)
await cacheService.set('key', data, {
    skipDatabase: true,
    ttlHours: 0.5
});

// Cache en DB uniquement (persistant entre sessions)
await cacheService.set('key', data, {
    skipMemory: true,
    ttlHours: 24
});

// Cache double niveau (recommandé)
await cacheService.set('key', data, {
    ttlHours: 2,
    priority: 'High'
});
\`\`\`

### Préchargement Conditionnel

\`\`\`javascript
const { shouldPreload } = useOptimization();

// Précharge uniquement sur bonne connexion
if (shouldPreload()) {
    HeavyComponent.preload();
}
\`\`\`

---

## 📊 Monitoring des Performances

### Obtenir les Statistiques

\`\`\`javascript
const { getCacheStats } = useOptimization();

const stats = getCacheStats();
console.log(\`Hit Rate: \${stats.hitRate}\`);
console.log(\`Hits: \${stats.hits}\`);
console.log(\`Misses: \${stats.misses}\`);
\`\`\`

### Page de Monitoring

Accédez à **Performance Monitoring** dans le menu pour :
- Surveiller le FPS en temps réel
- Analyser l'utilisation mémoire
- Voir le taux de succès du cache
- Obtenir des recommandations d'optimisation

---

## 🎓 Exemples Complets

### Dashboard Optimisé

\`\`\`javascript
import { useCachedData } from '@/components/performance/OptimizationProvider';

export default function OptimizedDashboard() {
    const { data: modules } = useCachedData(
        'dashboard_modules',
        () => base44.entities.Module.list(),
        { ttlHours: 0.5 }
    );

    const { data: stats } = useCachedData(
        'dashboard_stats',
        async () => {
            const predictions = await base44.entities.EventPrediction.list();
            const signals = await base44.entities.MediaSignal.list();
            
            return {
                totalPredictions: predictions.length,
                totalSignals: signals.length,
                highProbPredictions: predictions.filter(p => p.probability_score >= 80).length
            };
        },
        { ttlHours: 0.25 }
    );

    return (
        <div>
            <h1>Dashboard Optimisé</h1>
            {/* Utiliser modules et stats */}
        </div>
    );
}
\`\`\`

### Composant avec Lazy Loading

\`\`\`javascript
import { createLazyComponent } from '@/components/performance/LazyLoadWrapper';

const HeavyChart = createLazyComponent(
    () => import('./charts/ComplexChart')
);

const HeavyTable = createLazyComponent(
    () => import('./tables/DataTable')
);

export default function AnalyticsPage() {
    return (
        <div>
            <h1>Analytics</h1>
            <Suspense fallback={<Skeleton />}>
                <HeavyChart />
                <HeavyTable />
            </Suspense>
        </div>
    );
}
\`\`\`

---

## ⚠️ Avertissements Importants

1. **Éviction du Cache**
   - Le cache mémoire est limité et peut être vidé
   - Le cache DB persiste mais expire selon le TTL
   - Toujours gérer le cas où le cache est vide

2. **Invalidation**
   - Invalider le cache après chaque modification de données
   - Utiliser \`invalidateByType()\` pour batch invalidation

3. **Données Sensibles**
   - Ne jamais cacher d'informations sensibles
   - Les caches peuvent être inspectés

---

## 🎯 Checklist d'Optimisation

- [ ] Identifier les requêtes coûteuses
- [ ] Implémenter le cache avec TTL approprié
- [ ] Lazy load des composants lourds
- [ ] Tester le taux de succès du cache (>70% recommandé)
- [ ] Vérifier l'utilisation mémoire (<80%)
- [ ] Invalider le cache lors des modifications
- [ ] Documenter les clés de cache utilisées
- [ ] Configurer le mode économie pour mobiles

---

Pour plus d'informations, consultez la page **Performance Monitoring** dans le menu Configuration Système.
`;

export default function OptimizationGuide() {
    const { containerVariants, itemVariants } = useStaggerAnimation();

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Breadcrumbs pages={[
                    { name: "Système" },
                    { name: "Guide Optimisation", href: "OptimizationGuide" }
                ]} />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PageHeader
                    icon={<Zap className="w-8 h-8 text-yellow-400" />}
                    title="Guide d'Optimisation des Performances"
                    subtitle="Meilleures pratiques pour un système NEA-AZEX ultra-performant"
                />
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4">
                <NeaCard className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
                    <div className="flex items-center gap-3 mb-3">
                        <Database className="w-6 h-6 text-blue-400" />
                        <h3 className="font-bold text-[var(--nea-text-title)]">Cache Intelligent</h3>
                    </div>
                    <p className="text-sm text-[var(--nea-text-secondary)]">
                        Double niveau (mémoire + DB) pour réduire les requêtes de 50-80%
                    </p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
                    <div className="flex items-center gap-3 mb-3">
                        <Layers className="w-6 h-6 text-purple-400" />
                        <h3 className="font-bold text-[var(--nea-text-title)]">Lazy Loading</h3>
                    </div>
                    <p className="text-sm text-[var(--nea-text-secondary)]">
                        Chargement paresseux pour réduire le bundle initial de 40-60%
                    </p>
                </NeaCard>

                <NeaCard className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
                    <div className="flex items-center gap-3 mb-3">
                        <Zap className="w-6 h-6 text-green-400" />
                        <h3 className="font-bold text-[var(--nea-text-title)]">Mode Économie</h3>
                    </div>
                    <p className="text-sm text-[var(--nea-text-secondary)]">
                        Adaptation automatique aux ressources disponibles
                    </p>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="p-8">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                            components={{
                                code: ({ inline, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto my-3">
                                            <code className={className} {...props}>{children}</code>
                                        </pre>
                                    ) : (
                                        <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 text-sm font-mono">
                                            {children}
                                        </code>
                                    );
                                },
                                h1: ({ children }) => (
                                    <h1 className="text-3xl font-bold text-[var(--nea-text-title)] mb-6 pb-3 border-b-2 border-[var(--nea-border-default)]">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-2xl font-bold text-[var(--nea-text-title)] mb-4 mt-8">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-xl font-semibold text-[var(--nea-text-primary)] mb-3 mt-6">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className="text-[var(--nea-text-primary)] leading-relaxed mb-4">
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="list-disc list-inside text-[var(--nea-text-primary)] space-y-2 mb-4">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal list-inside text-[var(--nea-text-primary)] space-y-2 mb-4">
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => (
                                    <li className="ml-4">{children}</li>
                                ),
                                hr: () => (
                                    <hr className="border-[var(--nea-border-default)] my-8" />
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-yellow-500 pl-4 py-2 my-4 bg-yellow-500/10 rounded-r-lg">
                                        {children}
                                    </blockquote>
                                ),
                                a: ({ children, href }) => (
                                    <a href={href} className="text-[var(--nea-primary-blue)] hover:underline" target="_blank" rel="noopener noreferrer">
                                        {children}
                                    </a>
                                )
                            }}
                        >
                            {GUIDE_CONTENT}
                        </ReactMarkdown>
                    </div>
                </NeaCard>
            </motion.div>

            <motion.div variants={itemVariants}>
                <NeaCard className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30">
                    <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold text-[var(--nea-text-title)] mb-2">
                                🎯 Prochaines Étapes
                            </h3>
                            <ul className="space-y-2 text-[var(--nea-text-primary)]">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                                    Visitez <strong>Performance Monitoring</strong> pour analyser votre système
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                                    Implémentez le cache sur vos dashboards les plus utilisés
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                                    Testez le mode économie d'énergie sur mobile
                                </li>
                            </ul>
                        </div>
                    </div>
                </NeaCard>
            </motion.div>
        </motion.div>
    );
}