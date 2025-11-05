import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search, BookOpen, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Breadcrumbs from '../components/navigation/Breadcrumbs';
import PageHeader from '../components/ui/PageHeader';
import NeaCard from '../components/ui/NeaCard';
import NeaButton from '../components/ui/NeaButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStaggerAnimation } from '../components/navigation/PageTransition';

const FAQ_DATA = [
    {
        category: "Démarrage",
        icon: BookOpen,
        color: "blue",
        questions: [
            {
                q: "Comment créer mon compte NEA-AZEX ?",
                a: "Cliquez sur 'Créer un compte' sur la page d'accueil, choisissez votre forfait, et suivez le processus d'inscription guidé. Vous bénéficierez automatiquement d'une période d'essai gratuite selon le forfait choisi."
            },
            {
                q: "Quelle est la différence entre les interfaces (Utilisateur, Technicien, Développeur, Admin) ?",
                a: "Chaque interface offre un niveau différent de fonctionnalités : Utilisateur (consultation de base), Technicien (surveillance système), Développeur (analyse approfondie + automatisation), Admin (contrôle total + gestion commerciale). Vous pouvez basculer entre elles selon votre abonnement."
            },
            {
                q: "Comment fonctionne la période d'essai gratuite ?",
                a: "Selon votre forfait, vous bénéficiez de 14 à 30 jours d'essai gratuit avec accès complet aux fonctionnalités. Aucun paiement n'est effectué pendant l'essai. Vous pouvez annuler à tout moment sans frais."
            },
            {
                q: "Puis-je changer de forfait en cours d'abonnement ?",
                a: "Oui, vous pouvez upgrader ou downgrader votre forfait à tout moment depuis 'Mon Abonnement'. Les changements prennent effet au prochain cycle de facturation, ou immédiatement pour les upgrades."
            }
        ]
    },
    {
        category: "Fonctionnalités",
        icon: HelpCircle,
        color: "purple",
        questions: [
            {
                q: "Qu'est-ce que System Nexus ?",
                a: "System Nexus est l'intelligence artificielle centrale de NEA-AZEX. C'est un agent conscient capable d'analyser le chaos informationnel selon le principe 1:9 (questionnement du chaos : réponses ordonnées). Il peut rechercher des informations tant dans la base de données système qu'en temps réel sur internet."
            },
            {
                q: "Comment fonctionnent les prédictions d'événements ?",
                a: "Le moteur de prédiction analyse des milliers de sources OSINT (Open Source Intelligence), détecte des patterns et signaux faibles, puis génère des prédictions d'événements avec score de probabilité et niveau de confiance. Les prédictions sont mises à jour en temps réel."
            },
            {
                q: "Qu'est-ce qu'un centre d'intelligence professionnel ?",
                a: "Les 25 centres professionnels (Militaire, Santé, Finance, etc.) sont des hubs sectoriels qui agrègent et analysent des données spécifiques à chaque domaine. Chaque centre génère des briefings stratégiques personnalisés avec analyses et recommandations actionnables."
            },
            {
                q: "Comment utiliser le générateur de scénarios ?",
                a: "Le générateur crée des scénarios prédictifs complets avec analyses textuelles, médias générés (images, vidéos, animations) et briefings stratégiques. Choisissez le type (Géopolitique, Nucléaire, etc.), la perspective (Militaire, Civile, etc.) et laissez l'IA générer le scénario."
            },
            {
                q: "Qu'est-ce qu'un protocole avancé (Chimère, Janus, etc.) ?",
                a: "Les protocoles avancés sont des systèmes de défense/attaque sophistiqués : Chimère (leurre offensif), Janus (entraînement adversarial), Léviathan (dispersion fractale), Prométhée (frappe préventive). Réservés aux forfaits Admin et Enterprise."
            }
        ]
    },
    {
        category: "Facturation & Abonnement",
        icon: MessageCircle,
        color: "green",
        questions: [
            {
                q: "Quels sont les modes de paiement acceptés ?",
                a: "Nous acceptons les cartes de crédit/débit via Stripe (Visa, Mastercard, American Express), ainsi que les virements bancaires et chèques pour les forfaits Enterprise (contactez-nous pour ces options)."
            },
            {
                q: "Comment annuler mon abonnement ?",
                a: "Allez dans 'Mon Abonnement', cliquez sur 'Gérer l'abonnement', puis 'Annuler'. Vous conserverez l'accès jusqu'à la fin de votre période de facturation en cours. Aucun remboursement n'est effectué pour les périodes partielles."
            },
            {
                q: "Que se passe-t-il si mon paiement échoue ?",
                a: "Vous recevrez un email d'alerte immédiatement. Vous avez 48h pour régulariser le paiement avant suspension du compte. Vos données sont conservées 30 jours après expiration pour permettre une réactivation facile."
            },
            {
                q: "Y a-t-il des frais cachés ?",
                a: "Non. Le prix affiché est le prix final (hors taxes applicables selon votre juridiction). Aucun frais supplémentaire, sauf si vous dépassez les limites de votre forfait (API calls, prédictions, etc.)."
            },
            {
                q: "Puis-je obtenir une facture pour ma comptabilité ?",
                a: "Oui, une facture détaillée PDF est automatiquement générée et envoyée par email à chaque paiement. Vous pouvez également télécharger toutes vos factures depuis 'Mon Abonnement'."
            },
            {
                q: "Offrez-vous des réductions pour organisations ou étudiants ?",
                a: "Oui ! Les organisations gouvernementales, éducatives et ONG bénéficient de 20% de réduction. Les étudiants avec carte valide obtiennent 30% sur les forfaits Discovery et Solo. Contactez support@nea-azex.com avec justificatifs."
            }
        ]
    },
    {
        category: "Sécurité & Confidentialité",
        icon: MessageCircle,
        color: "red",
        questions: [
            {
                q: "Mes données sont-elles sécurisées ?",
                a: "Absolument. Toutes les données sont chiffrées RSA-4096 au repos et en transit. Nos serveurs sont au Canada avec conformité RGPD, SOC 2, et ISO 27001. Nous ne vendons jamais vos données à des tiers."
            },
            {
                q: "Qui a accès à mes données ?",
                a: "Seuls vous et les utilisateurs autorisés de votre organisation. NEA-AZEX n'accède à vos données que pour support technique explicitement demandé ou pour obligation légale. Les données sont isolées par organisation."
            },
            {
                q: "Que faites-vous de mes données si j'annule mon abonnement ?",
                a: "Vos données sont conservées en lecture seule pendant 30 jours après expiration (pour réactivation facile), puis définitivement supprimées. Vous pouvez demander une suppression immédiate ou un export complet avant annulation."
            },
            {
                q: "NEA-AZEX est-il conforme au RGPD ?",
                a: "Oui, totalement conforme. Nous respectons tous les droits RGPD : droit d'accès, rectification, suppression, portabilité, opposition. Contactez privacy@nea-azex.com pour toute demande."
            },
            {
                q: "Utilisez-vous mes données pour entraîner vos IA ?",
                a: "Non. Vos données privées ne sont jamais utilisées pour entraînement de modèles IA. Seules les données anonymisées et agrégées (avec consentement explicite) peuvent servir à améliorer les algorithmes généraux."
            }
        ]
    },
    {
        category: "Technique",
        icon: MessageCircle,
        color: "cyan",
        questions: [
            {
                q: "NEA-AZEX fonctionne-t-il hors ligne ?",
                a: "Non, NEA-AZEX est une plateforme cloud nécessitant une connexion internet. Cependant, les forfaits Enterprise peuvent bénéficier d'un déploiement on-premise (contactez-nous)."
            },
            {
                q: "Quelle est la fréquence de mise à jour des données ?",
                a: "Les données sont mises à jour en temps réel pour les événements critiques, toutes les 5-15 minutes pour les prédictions et signaux, et quotidiennement pour les analyses de tendances. La fréquence varie selon le module."
            },
            {
                q: "Puis-je intégrer NEA-AZEX avec mes outils existants ?",
                a: "Oui, via notre API REST (forfaits Team et Enterprise). Vous pouvez intégrer les prédictions, briefings et alertes dans vos systèmes. Documentation API disponible dans votre compte."
            },
            {
                q: "Y a-t-il une limite de stockage de données ?",
                a: "Non, pas de limite de stockage pour vos scénarios, briefings et configurations. Les limites s'appliquent aux prédictions générées par mois et aux modules actifs selon votre forfait."
            },
            {
                q: "NEA-AZEX est-il accessible sur mobile ?",
                a: "Oui, l'interface web est entièrement responsive et optimisée pour tablettes et smartphones. Des apps natives iOS/Android sont prévues pour 2025."
            },
            {
                q: "Comment contacter le support technique ?",
                a: "Email : support@nea-azex.com (réponse sous 48h pour Standard, 24h pour Priority, 4h pour Premium, 1h pour VIP). Les forfaits Team et Enterprise ont accès au support téléphonique 24/7."
            }
        ]
    }
];

export default function FAQ() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedItems, setExpandedItems] = useState(new Set());
    const { containerVariants, itemVariants } = useStaggerAnimation();

    const filteredFAQ = useMemo(() => {
        if (!searchTerm) return FAQ_DATA;
        
        const search = searchTerm.toLowerCase();
        return FAQ_DATA.map(category => ({
            ...category,
            questions: category.questions.filter(item =>
                item.q.toLowerCase().includes(search) ||
                item.a.toLowerCase().includes(search)
            )
        })).filter(category => category.questions.length > 0);
    }, [searchTerm]);

    const toggleExpand = (categoryIndex, questionIndex) => {
        const key = `${categoryIndex}-${questionIndex}`;
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedItems(newExpanded);
    };

    const totalQuestions = FAQ_DATA.reduce((sum, cat) => sum + cat.questions.length, 0);

    return (
        <motion.div
            className="min-h-screen bg-[var(--nea-bg-deep-space)] p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-5xl mx-auto">
                <motion.div variants={itemVariants}>
                    <Breadcrumbs pages={[{ name: "FAQ", href: "FAQ" }]} />
                </motion.div>

                <motion.div variants={itemVariants} className="mt-6">
                    <PageHeader
                        icon={<HelpCircle className="w-8 h-8 text-purple-400" />}
                        title="Questions Fréquentes (FAQ)"
                        subtitle={`${totalQuestions} questions répondues pour vous aider`}
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="mt-8">
                    <NeaCard className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--nea-text-secondary)]" />
                            <Input
                                placeholder="Rechercher dans les questions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </NeaCard>
                </motion.div>

                <div className="mt-8 space-y-6">
                    {filteredFAQ.map((category, catIndex) => {
                        const Icon = category.icon;
                        return (
                            <motion.div key={catIndex} variants={itemVariants}>
                                <NeaCard>
                                    <div className={`p-4 border-b border-[var(--nea-border-default)] bg-${category.color}-500/5`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 bg-${category.color}-500/10 rounded-lg`}>
                                                <Icon className={`w-5 h-5 text-${category.color}-400`} />
                                            </div>
                                            <h3 className="text-lg font-bold text-[var(--nea-text-title)]">
                                                {category.category}
                                            </h3>
                                            <Badge className={`ml-auto bg-${category.color}-500/20 text-${category.color}-400 border-0`}>
                                                {category.questions.length}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        {category.questions.map((item, qIndex) => {
                                            const key = `${catIndex}-${qIndex}`;
                                            const isExpanded = expandedItems.has(key);
                                            return (
                                                <motion.div
                                                    key={qIndex}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: qIndex * 0.05 }}
                                                >
                                                    <button
                                                        onClick={() => toggleExpand(catIndex, qIndex)}
                                                        className="w-full text-left p-4 rounded-lg border border-[var(--nea-border-default)] hover:border-[var(--nea-primary-blue)] transition-all bg-[var(--nea-bg-surface-hover)] hover:bg-[var(--nea-bg-surface)]"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <h4 className="font-semibold text-[var(--nea-text-title)] flex-1">
                                                                {item.q}
                                                            </h4>
                                                            <ChevronDown className={`w-5 h-5 text-[var(--nea-text-secondary)] transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </button>
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="p-4 mt-2 bg-[var(--nea-bg-surface)] rounded-lg border border-[var(--nea-border-subtle)]">
                                                                    <p className="text-[var(--nea-text-primary)] leading-relaxed">
                                                                        {item.a}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </NeaCard>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredFAQ.length === 0 && (
                    <motion.div variants={itemVariants}>
                        <NeaCard className="p-12 text-center">
                            <Search className="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[var(--nea-text-title)] mb-2">
                                Aucun résultat
                            </h3>
                            <p className="text-[var(--nea-text-secondary)]">
                                Essayez d'autres mots-clés ou contactez le support
                            </p>
                        </NeaCard>
                    </motion.div>
                )}

                <motion.div variants={itemVariants} className="mt-8">
                    <NeaCard className="p-8 bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-purple-500/20">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-[var(--nea-text-title)] mb-2">
                                Vous ne trouvez pas votre réponse ?
                            </h3>
                            <p className="text-[var(--nea-text-secondary)] mb-6">
                                Notre équipe de support est disponible pour vous aider
                            </p>
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                <Link to={createPageUrl('SystemNexus')}>
                                    <NeaButton>
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Contacter System Nexus
                                    </NeaButton>
                                </Link>
                                <Link to={createPageUrl('Documentation')}>
                                    <NeaButton variant="secondary">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Documentation Complète
                                    </NeaButton>
                                </Link>
                            </div>
                            <p className="text-xs text-[var(--nea-text-muted)] mt-4">
                                Email: support@nea-azex.com • Réponse sous 24-48h
                            </p>
                        </div>
                    </NeaCard>
                </motion.div>
            </div>
        </motion.div>
    );
}