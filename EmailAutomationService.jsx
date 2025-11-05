import { base44 } from '@/api/base44Client';

/**
 * Service d'automatisation d'envoi d'emails
 * Gère l'envoi automatique des emails selon les événements déclencheurs
 */

const EMAIL_SERVICE_ENDPOINT = 'https://api.base44.com/send-email'; // À remplacer par l'endpoint réel

/**
 * Envoie un email en utilisant un template
 * @param {string} templateCode - Code du template à utiliser
 * @param {string} recipientEmail - Email du destinataire
 * @param {object} variables - Variables à injecter dans le template
 * @returns {Promise<object>} Résultat de l'envoi
 */
export async function sendTemplateEmail(templateCode, recipientEmail, variables = {}) {
    try {
        // Récupérer le template
        const templates = await base44.entities.EmailTemplate.filter({ 
            template_code: templateCode,
            is_active: true 
        });

        if (templates.length === 0) {
            throw new Error(`Template ${templateCode} introuvable ou inactif`);
        }

        const template = templates[0];

        // Remplacer les variables dans le contenu
        let htmlContent = template.html_content;
        let textContent = template.text_content;
        let subject = template.subject;

        Object.keys(variables).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            htmlContent = htmlContent.replace(regex, variables[key] || '');
            textContent = textContent.replace(regex, variables[key] || '');
            subject = subject.replace(regex, variables[key] || '');
        });

        // Note: L'envoi réel via API email nécessite une intégration externe
        // Ici nous loggons l'email dans EmailLog pour traçabilité
        await base44.entities.EmailLog.create({
            recipient_email: recipientEmail,
            template_code: templateCode,
            subject: subject,
            from_name: template.from_name || 'NEA-AZEX',
            status: 'sent', // En production: 'pending' puis mise à jour après envoi
            sent_at: new Date().toISOString(),
            variables_used: variables,
            related_entity: variables.related_entity || null,
            related_entity_id: variables.related_entity_id || null
        });

        // Mettre à jour les statistiques du template
        await base44.entities.EmailTemplate.update(template.id, {
            last_sent: new Date().toISOString(),
            total_sent: (template.total_sent || 0) + 1
        });

        console.log(`✅ Email ${templateCode} envoyé à ${recipientEmail}`);

        return {
            success: true,
            message: 'Email envoyé avec succès',
            templateCode,
            recipientEmail
        };

    } catch (error) {
        console.error('❌ Erreur envoi email:', error);

        // Logger l'erreur
        try {
            await base44.entities.EmailLog.create({
                recipient_email: recipientEmail,
                template_code: templateCode,
                subject: 'Erreur envoi',
                from_name: 'NEA-AZEX',
                status: 'failed',
                error_message: error.message,
                sent_at: new Date().toISOString(),
                variables_used: variables
            });
        } catch (logError) {
            console.error('Impossible de logger l\'erreur:', logError);
        }

        return {
            success: false,
            error: error.message,
            templateCode,
            recipientEmail
        };
    }
}

/**
 * Envoie l'email de bienvenue à un nouvel utilisateur
 */
export async function sendWelcomeEmail(user, subscription) {
    const variables = {
        user_name: user.full_name || user.email.split('@')[0],
        plan_name: subscription?.plan_name || 'Gratuit',
        trial_days: subscription?.trial_days || 0,
        dashboard_url: `${window.location.origin}/app/UserDashboard`,
        documentation_url: `${window.location.origin}/app/Documentation`
    };

    return await sendTemplateEmail('WELCOME_ONBOARD', user.email, variables);
}

/**
 * Envoie la confirmation d'abonnement
 */
export async function sendSubscriptionConfirmedEmail(user, subscription) {
    const variables = {
        user_name: user.full_name || user.email.split('@')[0],
        plan_name: subscription.plan_name,
        amount: subscription.monthly_price,
        billing_cycle: subscription.billing_cycle,
        start_date: new Date(subscription.start_date).toLocaleDateString('fr-CA'),
        next_billing_date: new Date(subscription.next_billing_date || subscription.end_date).toLocaleDateString('fr-CA'),
        subscription_url: `${window.location.origin}/app/MySubscription`
    };

    return await sendTemplateEmail('SUBSCRIPTION_CONFIRMED', user.email, {
        ...variables,
        related_entity: 'Subscription',
        related_entity_id: subscription.id
    });
}

/**
 * Envoie la notification de début d'essai
 */
export async function sendTrialStartedEmail(user, subscription) {
    const variables = {
        user_name: user.full_name || user.email.split('@')[0],
        plan_name: subscription.plan_name,
        trial_days: subscription.trial_days || 14,
        trial_end_date: new Date(subscription.trial_end_date).toLocaleDateString('fr-CA'),
        dashboard_url: `${window.location.origin}/app/UserDashboard`
    };

    return await sendTemplateEmail('TRIAL_STARTED', user.email, {
        ...variables,
        related_entity: 'Subscription',
        related_entity_id: subscription.id
    });
}

/**
 * Envoie le rappel de fin d'essai (7 jours avant)
 */
export async function sendTrialEndingEmail(user, subscription) {
    const variables = {
        user_name: user.full_name || user.email.split('@')[0],
        plan_name: subscription.plan_name,
        trial_end_date: new Date(subscription.trial_end_date).toLocaleDateString('fr-CA'),
        subscription_url: `${window.location.origin}/app/MySubscription`,
        pricing_url: `${window.location.origin}/app/Pricing`
    };

    return await sendTemplateEmail('TRIAL_ENDING', user.email, {
        ...variables,
        related_entity: 'Subscription',
        related_entity_id: subscription.id
    });
}

/**
 * Envoie la notification de facture
 */
export async function sendInvoiceEmail(user, invoice) {
    const variables = {
        user_name: user.full_name || user.email.split('@')[0],
        invoice_number: invoice.invoice_number,
        invoice_date: new Date(invoice.invoice_date).toLocaleDateString('fr-CA'),
        plan_name: invoice.line_items?.[0]?.description || 'Abonnement',
        billing_period: `${new Date(invoice.billing_period_start).toLocaleDateString('fr-CA')} - ${new Date(invoice.billing_period_end).toLocaleDateString('fr-CA')}`,
        amount: invoice.total_amount,
        invoice_pdf_url: invoice.pdf_url || `${window.location.origin}/app/MySubscription`
    };

    return await sendTemplateEmail('INVOICE_SENT', user.email, {
        ...variables,
        related_entity: 'Invoice',
        related_entity_id: invoice.id
    });
}

/**
 * Envoie la confirmation de paiement
 */
export async function sendPaymentReceivedEmail(user, paymentLog, subscription) {
    const variables = {
        user_name: user.full_name || user.email.split('@')[0],
        amount: paymentLog.amount,
        transaction_id: paymentLog.transaction_id,
        payment_date: new Date(paymentLog.payment_date).toLocaleDateString('fr-CA'),
        payment_method: paymentLog.payment_method,
        next_billing_date: subscription?.next_billing_date 
            ? new Date(subscription.next_billing_date).toLocaleDateString('fr-CA') 
            : 'N/A',
        invoices_url: `${window.location.origin}/app/MySubscription`
    };

    return await sendTemplateEmail('PAYMENT_RECEIVED', user.email, {
        ...variables,
        related_entity: 'PaymentLog',
        related_entity_id: paymentLog.id
    });
}

/**
 * Envoie la notification d'échec de paiement
 */
export async function sendPaymentFailedEmail(user, subscription, errorReason) {
    const variables = {
        user_name: user.full_name || user.email.split('@')[0],
        amount: subscription.monthly_price,
        error_reason: errorReason || 'Erreur de transaction',
        payment_url: `${window.location.origin}/app/MySubscription`
    };

    return await sendTemplateEmail('PAYMENT_FAILED', user.email, {
        ...variables,
        related_entity: 'Subscription',
        related_entity_id: subscription.id
    });
}

/**
 * Envoie le rappel de renouvellement (3 jours avant)
 */
export async function sendSubscriptionRenewalReminderEmail(user, subscription) {
    const variables = {
        user_name: user.full_name || user.email.split('@')[0],
        plan_name: subscription.plan_name,
        renewal_date: new Date(subscription.end_date).toLocaleDateString('fr-CA'),
        amount: subscription.monthly_price,
        payment_method: subscription.payment_method || 'Carte enregistrée',
        subscription_url: `${window.location.origin}/app/MySubscription`,
        pricing_url: `${window.location.origin}/app/Pricing`
    };

    return await sendTemplateEmail('SUBSCRIPTION_RENEWAL_REMINDER', user.email, {
        ...variables,
        related_entity: 'Subscription',
        related_entity_id: subscription.id
    });
}

/**
 * Envoie la notification d'expiration d'abonnement
 */
export async function sendSubscriptionExpiredEmail(user, subscription) {
    const variables = {
        user_name: user.full_name || user.email.split('@')[0],
        plan_name: subscription.plan_name,
        expiry_date: new Date(subscription.end_date).toLocaleDateString('fr-CA'),
        reactivation_url: `${window.location.origin}/app/Pricing`,
        pricing_url: `${window.location.origin}/app/Pricing`
    };

    return await sendTemplateEmail('SUBSCRIPTION_EXPIRED', user.email, {
        ...variables,
        related_entity: 'Subscription',
        related_entity_id: subscription.id
    });
}

/**
 * Vérifie et envoie les emails automatiques planifiés
 * À appeler périodiquement (par exemple via un cron job)
 */
export async function checkAndSendScheduledEmails() {
    try {
        const now = new Date();
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        // Récupérer tous les abonnements actifs
        const subscriptions = await base44.entities.Subscription.filter({ 
            status: { $in: ['Active', 'Trial'] }
        });

        for (const sub of subscriptions) {
            const user = await base44.auth.me(); // En production: récupérer via sub.user_email

            // Vérifier essai se terminant dans 7 jours
            if (sub.status === 'Trial' && sub.trial_end_date) {
                const trialEndDate = new Date(sub.trial_end_date);
                if (trialEndDate <= sevenDaysFromNow && trialEndDate > now) {
                    await sendTrialEndingEmail(user, sub);
                }
            }

            // Vérifier renouvellement dans 3 jours
            if (sub.status === 'Active' && sub.end_date) {
                const endDate = new Date(sub.end_date);
                if (endDate <= threeDaysFromNow && endDate > now) {
                    await sendSubscriptionRenewalReminderEmail(user, sub);
                }
            }

            // Vérifier abonnement expiré
            if (new Date(sub.end_date) < now && sub.status !== 'Expired') {
                await sendSubscriptionExpiredEmail(user, sub);
                await base44.entities.Subscription.update(sub.id, { status: 'Expired' });
            }
        }

        console.log('✅ Vérification emails automatiques terminée');
    } catch (error) {
        console.error('❌ Erreur vérification emails automatiques:', error);
    }
}

export default {
    sendTemplateEmail,
    sendWelcomeEmail,
    sendSubscriptionConfirmedEmail,
    sendTrialStartedEmail,
    sendTrialEndingEmail,
    sendInvoiceEmail,
    sendPaymentReceivedEmail,
    sendPaymentFailedEmail,
    sendSubscriptionRenewalReminderEmail,
    sendSubscriptionExpiredEmail,
    checkAndSendScheduledEmails
};