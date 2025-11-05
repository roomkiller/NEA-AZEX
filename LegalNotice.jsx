import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Scale, Copyright, Landmark, ShieldCheck, Globe, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import NeaCard from '../components/ui/NeaCard';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useStaggerAnimation, LoadingTransition } from '../components/navigation/PageTransition';

const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4">
        <Icon className="w-6 h-6 text-[var(--nea-primary-blue)] mt-1 flex-shrink-0" />
        <div>
            <h4 className="font-semibold text-[var(--nea-text-title)]">{label}</h4>
            <p className="text-[var(--nea-text-secondary)]">{value}</p>
        </div>
    </div>
);

export default function LegalNotice() {
    const [license, setLicense] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { containerVariants, itemVariants } = useStaggerAnimation();

    useEffect(() => {
        const fetchLicense = async () => {
            try {
                const licenses = await base44.entities.LegalLicense.list();
                if (licenses.length > 0) {
                    setLicense(licenses[0]);
                }
            } catch (error) {
                console.error("Erreur chargement de la licence:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLicense();
    }, []);

    if (isLoading) {
        return <LoadingTransition message="Chargement des documents légaux..." />;
    }

    if (!license) {
        return (
            <div className="min-h-screen bg-[var(--nea-bg-deep-space)] flex items-center justify-center text-center p-4">
                <div>
                    <h1 className="text-2xl font-bold text-red-500">Erreur Critique</h1>
                    <p className="text-[var(--nea-text-secondary)]">La licence maîtresse du système est introuvable. Système non autorisé.</p>
                     <Link to={createPageUrl("Home")} className="mt-4 inline-block text-[var(--nea-primary-blue)] hover:underline">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--nea-bg-deep-space)] text-[var(--nea-text-primary)] p-6 sm:p-12 tech-pattern">
            <div className="max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Scale className="w-16 h-16 mx-auto text-[var(--nea-text-title)] mb-4" />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--nea-text-title)] text-glow">
                        Mentions Légales & Licence Maîtresse
                    </h1>
                    <p className="text-[var(--nea-text-secondary)] text-lg max-w-2xl mx-auto mt-4">
                        Cadre juridique et attestation de propriété intellectuelle du logiciel NEA-AZEX.
                    </p>
                </motion.div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <NeaCard className="p-8">
                        <motion.div variants={itemVariants} className="space-y-8">
                            <DetailItem icon={Copyright} label="Propriétaire Intellectuel" value={license.owner_organization} />
                            <DetailItem icon={Landmark} label="Juridiction d'Opération" value={license.jurisdiction} />
                            <DetailItem icon={FileText} label="Clé de Licence Maîtresse" value={license.license_key} />
                            <DetailItem icon={ShieldCheck} label="Niveau de Chiffrement Racine" value={license.encryption_level} />
                            <DetailItem icon={Globe} label="Standards de Conformité" value={license.compliance_standards.join(', ')} />
                        </motion.div>
                        <motion.div variants={itemVariants} className="mt-10 pt-6 border-t border-[var(--nea-border-default)]">
                            <h3 className="font-semibold text-lg text-[var(--nea-text-title)] mb-4">Déclaration de l'Éditeur</h3>
                            <p className="text-[var(--nea-text-secondary)] text-sm">
                                Le logiciel NEA-AZEX est une œuvre de l'esprit originale, conçue, développée et maintenue au Québec, Canada. Il est soumis aux lois et réglementations en vigueur dans cette juridiction. Toute reproduction, distribution ou modification non autorisée est strictement interdite et constitue une violation des droits de propriété intellectuelle.
                            </p>
                        </motion.div>
                    </NeaCard>
                    <motion.div variants={itemVariants} className="text-center mt-8">
                         <Link to={createPageUrl("Home")} className="text-sm text-[var(--nea-primary-blue)] hover:underline">
                            Retour à l'interface de connexion
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}