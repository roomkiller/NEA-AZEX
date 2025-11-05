import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Award, Save, DollarSign, Users, Settings, Shield, Plus, X } from 'lucide-react';
import EnhancedDialog, { DialogSection, DialogField, EnhancedInput, EnhancedTextarea } from '../ui/EnhancedDialog';
import NeaButton from '../ui/NeaButton';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const PLAN_CODES = ['DISCOVERY', 'SOLO', 'TEAM', 'ENTERPRISE'];
const CURRENCIES = ['CAD', 'USD', 'EUR', 'GBP'];
const BILLING_CYCLES = ['Monthly', 'Yearly', 'Lifetime'];
const SUPPORT_LEVELS = ['Community', 'Email', 'Priority_Email', '24_7_Phone'];
const PRIORITY_LEVELS = ['Standard', 'Priority', 'Premium', 'VIP'];

export default function AddPlanModal({ plan, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    plan_name: '',
    plan_code: 'DISCOVERY',
    description: '',
    monthly_price: 0,
    yearly_price: 0,
    currency: 'CAD',
    billing_cycle: 'Monthly',
    max_users: 1,
    max_predictions: 10,
    max_modules: 5,
    features: [],
    restrictions: {
      can_access_predictions: true,
      can_access_scenarios: false,
      can_access_crisis_manager: false,
      can_access_deep_analysis: false,
      can_access_correlation: false,
      can_export_reports: true,
      can_use_api: false,
      max_api_calls_per_day: 100
    },
    priority_level: 'Standard',
    support_level: 'Email',
    status: 'Active',
    display_order: 1,
    is_popular: false,
    trial_days: 0
  });

  const [currentFeature, setCurrentFeature] = useState('');

  useEffect(() => {
    if (plan) {
      setFormData({
        plan_name: plan.plan_name || '',
        plan_code: plan.plan_code || 'DISCOVERY',
        description: plan.description || '',
        monthly_price: plan.monthly_price || 0,
        yearly_price: plan.yearly_price || 0,
        currency: plan.currency || 'CAD',
        billing_cycle: plan.billing_cycle || 'Monthly',
        max_users: plan.max_users || 1,
        max_predictions: plan.max_predictions || 10,
        max_modules: plan.max_modules || 5,
        features: plan.features || [],
        restrictions: plan.restrictions || {
          can_access_predictions: true,
          can_access_scenarios: false,
          can_access_crisis_manager: false,
          can_access_deep_analysis: false,
          can_access_correlation: false,
          can_export_reports: true,
          can_use_api: false,
          max_api_calls_per_day: 100
        },
        priority_level: plan.priority_level || 'Standard',
        support_level: plan.support_level || 'Email',
        status: plan.status || 'Active',
        display_order: plan.display_order || 1,
        is_popular: plan.is_popular || false,
        trial_days: plan.trial_days || 0
      });
    }
  }, [plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.plan_name || !formData.plan_code) {
      toast.error('Nom et code du plan requis');
      return;
    }

    try {
      if (plan?.id) {
        await base44.entities.SubscriptionPlan.update(plan.id, formData);
        toast.success('Plan mis à jour avec succès');
      } else {
        await base44.entities.SubscriptionPlan.create(formData);
        toast.success('Plan créé avec succès');
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, currentFeature.trim()]
      });
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  return (
    <EnhancedDialog
      open={true}
      onOpenChange={onClose}
      title={plan ? "Modifier le Forfait" : "Nouveau Forfait"}
      description="Configurez un plan d'abonnement pour le système NEA-AZEX"
      icon={Award}
      iconColor="text-purple-400"
      iconBg="from-purple-500/20 to-pink-500/30"
      headerGradient="from-purple-500/10 via-pink-500/10 to-blue-500/10"
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <NeaButton type="button" onClick={onClose} variant="ghost">
            Annuler
          </NeaButton>
          <NeaButton type="submit" onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            {plan ? 'Mettre à Jour' : 'Créer le Forfait'}
          </NeaButton>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identification */}
        <DialogSection title="Identification du Forfait" icon={Award}>
          <div className="grid grid-cols-2 gap-4">
            <DialogField label="Nom du Forfait" required>
              <EnhancedInput
                placeholder="Ex: DISCOVERY"
                value={formData.plan_name}
                onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
              />
            </DialogField>

            <DialogField label="Code du Plan">
              <Select
                value={formData.plan_code}
                onValueChange={(value) => setFormData({ ...formData, plan_code: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-border-default)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  {PLAN_CODES.map(code => (
                    <SelectItem key={code} value={code} className="text-white hover:bg-[var(--nea-bg-surface-hover)]">
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogField>
          </div>

          <DialogField label="Description" required help="Description marketing du forfait">
            <EnhancedTextarea
              placeholder="Pour qui? Quels avantages? Quels cas d'usage?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </DialogField>

          <div className="grid grid-cols-2 gap-4">
            <DialogField label="Ordre d'Affichage">
              <EnhancedInput
                type="number"
                min="1"
                placeholder="1"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
              />
            </DialogField>

            <DialogField label="Badge Populaire">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
                <Switch
                  checked={formData.is_popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked })}
                />
                <span className="text-sm text-[var(--nea-text-primary)]">
                  Marquer comme "Populaire"
                </span>
              </div>
            </DialogField>
          </div>
        </DialogSection>

        {/* Tarification */}
        <DialogSection title="Tarification" icon={DollarSign}>
          <div className="grid grid-cols-3 gap-4">
            <DialogField label="Prix Mensuel" required>
              <EnhancedInput
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.monthly_price}
                onChange={(e) => setFormData({ ...formData, monthly_price: parseFloat(e.target.value) || 0 })}
              />
            </DialogField>

            <DialogField label="Prix Annuel" help="Économie annuelle recommandée">
              <EnhancedInput
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.yearly_price}
                onChange={(e) => setFormData({ ...formData, yearly_price: parseFloat(e.target.value) || 0 })}
              />
            </DialogField>

            <DialogField label="Devise">
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-border-default)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  {CURRENCIES.map(curr => (
                    <SelectItem key={curr} value={curr} className="text-white hover:bg-[var(--nea-bg-surface-hover)]">
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DialogField label="Cycle de Facturation">
              <Select
                value={formData.billing_cycle}
                onValueChange={(value) => setFormData({ ...formData, billing_cycle: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-border-default)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  {BILLING_CYCLES.map(cycle => (
                    <SelectItem key={cycle} value={cycle} className="text-white hover:bg-[var(--nea-bg-surface-hover)]">
                      {cycle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogField>

            <DialogField label="Période d'Essai" help="Nombre de jours gratuits">
              <EnhancedInput
                type="number"
                min="0"
                placeholder="0"
                value={formData.trial_days}
                onChange={(e) => setFormData({ ...formData, trial_days: parseInt(e.target.value) || 0 })}
              />
            </DialogField>
          </div>

          {formData.monthly_price > 0 && formData.yearly_price > 0 && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm text-green-400 font-semibold">
                💰 Économie annuelle: ${Math.round((formData.monthly_price * 12) - formData.yearly_price)} {formData.currency}
                {' '}({Math.round(((formData.monthly_price * 12 - formData.yearly_price) / (formData.monthly_price * 12)) * 100)}%)
              </p>
            </div>
          )}
        </DialogSection>

        {/* Limites & Quotas */}
        <DialogSection title="Limites & Quotas" icon={Users}>
          <div className="grid grid-cols-3 gap-4">
            <DialogField label="Utilisateurs Max" help="0 = illimité">
              <EnhancedInput
                type="number"
                min="0"
                placeholder="1"
                value={formData.max_users}
                onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) || 0 })}
              />
            </DialogField>

            <DialogField label="Prédictions/Mois" help="0 = illimité">
              <EnhancedInput
                type="number"
                min="0"
                placeholder="10"
                value={formData.max_predictions}
                onChange={(e) => setFormData({ ...formData, max_predictions: parseInt(e.target.value) || 0 })}
              />
            </DialogField>

            <DialogField label="Modules Actifs" help="0 = illimité">
              <EnhancedInput
                type="number"
                min="0"
                placeholder="5"
                value={formData.max_modules}
                onChange={(e) => setFormData({ ...formData, max_modules: parseInt(e.target.value) || 0 })}
              />
            </DialogField>
          </div>
        </DialogSection>

        {/* Permissions */}
        <DialogSection title="Permissions & Accès" icon={Shield}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
              <span className="text-sm text-[var(--nea-text-primary)]">Accès Prédictions</span>
              <Switch
                checked={formData.restrictions.can_access_predictions}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  restrictions: { ...formData.restrictions, can_access_predictions: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
              <span className="text-sm text-[var(--nea-text-primary)]">Accès Scénarios</span>
              <Switch
                checked={formData.restrictions.can_access_scenarios}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  restrictions: { ...formData.restrictions, can_access_scenarios: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
              <span className="text-sm text-[var(--nea-text-primary)]">Gestionnaire Crises</span>
              <Switch
                checked={formData.restrictions.can_access_crisis_manager}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  restrictions: { ...formData.restrictions, can_access_crisis_manager: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
              <span className="text-sm text-[var(--nea-text-primary)]">Analyse Approfondie</span>
              <Switch
                checked={formData.restrictions.can_access_deep_analysis}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  restrictions: { ...formData.restrictions, can_access_deep_analysis: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
              <span className="text-sm text-[var(--nea-text-primary)]">Moteur Corrélation</span>
              <Switch
                checked={formData.restrictions.can_access_correlation}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  restrictions: { ...formData.restrictions, can_access_correlation: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
              <span className="text-sm text-[var(--nea-text-primary)]">Export Rapports</span>
              <Switch
                checked={formData.restrictions.can_export_reports}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  restrictions: { ...formData.restrictions, can_export_reports: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface-hover)]">
              <span className="text-sm text-[var(--nea-text-primary)]">Accès API</span>
              <Switch
                checked={formData.restrictions.can_use_api}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  restrictions: { ...formData.restrictions, can_use_api: checked }
                })}
              />
            </div>

            {formData.restrictions.can_use_api && (
              <DialogField label="Appels API/Jour" help="0 = illimité">
                <EnhancedInput
                  type="number"
                  min="0"
                  placeholder="100"
                  value={formData.restrictions.max_api_calls_per_day}
                  onChange={(e) => setFormData({
                    ...formData,
                    restrictions: {
                      ...formData.restrictions,
                      max_api_calls_per_day: parseInt(e.target.value) || 0
                    }
                  })}
                />
              </DialogField>
            )}
          </div>
        </DialogSection>

        {/* Support */}
        <DialogSection title="Support & Priorité" icon={Settings}>
          <div className="grid grid-cols-2 gap-4">
            <DialogField label="Niveau de Support">
              <Select
                value={formData.support_level}
                onValueChange={(value) => setFormData({ ...formData, support_level: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-border-default)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  {SUPPORT_LEVELS.map(level => (
                    <SelectItem key={level} value={level} className="text-white hover:bg-[var(--nea-bg-surface-hover)]">
                      {level.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogField>

            <DialogField label="Niveau de Priorité">
              <Select
                value={formData.priority_level}
                onValueChange={(value) => setFormData({ ...formData, priority_level: value })}
              >
                <SelectTrigger className="bg-[var(--nea-bg-surface-hover)] border-2 border-[var(--nea-border-default)] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
                  {PRIORITY_LEVELS.map(priority => (
                    <SelectItem key={priority} value={priority} className="text-white hover:bg-[var(--nea-bg-surface-hover)]">
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </DialogField>
          </div>
        </DialogSection>

        {/* Fonctionnalités */}
        <DialogSection title="Fonctionnalités Incluses" icon={Settings}>
          <div className="space-y-3">
            <div className="flex gap-2">
              <EnhancedInput
                placeholder="Ajouter une fonctionnalité..."
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
              />
              <NeaButton type="button" onClick={handleAddFeature} variant="secondary">
                <Plus className="w-4 h-4" />
              </NeaButton>
            </div>

            {formData.features.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto styled-scrollbar">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--nea-bg-surface)] border border-[var(--nea-border-subtle)] group hover:border-[var(--nea-primary-blue)] transition-all"
                  >
                    <span className="text-sm text-[var(--nea-text-primary)] flex-1">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.features.length === 0 && (
              <p className="text-xs text-[var(--nea-text-muted)] italic text-center py-4">
                Aucune fonctionnalité ajoutée. Utilisez le champ ci-dessus pour en ajouter.
              </p>
            )}
          </div>
        </DialogSection>
      </form>
    </EnhancedDialog>
  );
}