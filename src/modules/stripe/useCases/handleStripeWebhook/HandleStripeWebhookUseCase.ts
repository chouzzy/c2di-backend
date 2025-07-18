// src/modules/stripe/useCases/handleStripeWebhook/HandleStripeWebhookUseCase.ts

import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

// Inicializa o cliente do Prisma
const prisma = new PrismaClient();

// Inicializa o cliente do Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-06-30.basil',
});

/**
 * @class HandleStripeWebhookUseCase
 * @description Contém a lógica de negócio para processar os eventos recebidos do Stripe.
 */
class HandleStripeWebhookUseCase {
    /**
     * Executa a lógica principal baseada no evento do Stripe.
     * @param {Stripe.Event} event - O objeto de evento verificado do Stripe.
     */
    async execute(event: Stripe.Event): Promise<void> {

        switch (event.type) {

            // Caso: Um cliente finalizou um checkout com sucesso
            case 'checkout.session.completed': {
                console.log('✅ Evento: checkout.session.completed recebido.');
                const session = event.data.object as Stripe.Checkout.Session;

                const customerId = session.customer as string;
                const subscriptionId = session.subscription as string;
                const auth0UserId = session.client_reference_id; // ID do nosso usuário (Auth0)

                if (!auth0UserId) {
                    console.error("❌ Erro: client_reference_id (auth0UserId) não encontrado na sessão do Stripe.");
                    return;
                }

                // Busca os detalhes completos da assinatura para ter todas as informações
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                // CORREÇÃO: Acessa a data do fim do período a partir do primeiro item da assinatura
                const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
                if (!currentPeriodEnd) {
                    console.error(`❌ Erro: Não foi possível encontrar current_period_end para a assinatura ${subscriptionId}`);
                    return;
                }

                // Atualiza o usuário no nosso banco de dados
                await prisma.user.update({
                    where: { auth0UserId },
                    data: {
                        stripe: {
                            customerId: customerId,
                            subscriptionId: subscription.id,
                            status: subscription.status,
                            currentPeriodEnd: new Date(currentPeriodEnd * 1000), // Converte de timestamp para Date
                        },
                    },
                });

                console.log(`✅ Assinatura criada para o usuário ${auth0UserId}. Status: ${subscription.status}`);
                break;
            }

            // Caso: Uma assinatura existente foi atualizada
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                // CORREÇÃO: Encontra o usuário primeiro para uma atualização segura
                const user = await prisma.user.findFirst({
                    where: { stripe: { is: { customerId: customerId } } }
                });

                if (!user || !user.stripe) {
                    console.error(`❌ Erro: Usuário com customerId ${customerId} não encontrado.`);
                    return;
                }

                // CORREÇÃO: Acessa a data do fim do período a partir do primeiro item
                const currentPeriodEnd = subscription.items.data[0]?.current_period_end;

                // Atualiza o registro do usuário específico
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        stripe: {
                            customerId: user.stripe.customerId, // Mantém o customerId original
                            subscriptionId: subscription.id, // Atualiza para o ID de assinatura mais recente
                            status: subscription.status,
                            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : user.stripe.currentPeriodEnd,
                        },
                    },
                });

                console.log(`🔄 Assinatura atualizada para o usuário ${user.auth0UserId}. Novo status: ${subscription.status}`);
                break;
            }

            // Caso: Uma assinatura foi cancelada
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                // CORREÇÃO: Encontra o usuário primeiro
                const user = await prisma.user.findFirst({
                    where: { stripe: { is: { customerId: customerId } } }
                });

                if (!user || !user.stripe) {
                    console.error(`❌ Erro: Usuário com customerId ${customerId} não encontrado.`);
                    return;
                }

                // Atualiza o status para "canceled"
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        stripe: {
                            ...user.stripe, // Mantém os dados existentes
                            status: subscription.status, // Apenas atualiza o status
                        },
                    },
                });

                console.log(`🗑️ Assinatura cancelada para o usuário ${user.auth0UserId}. Status: ${subscription.status}`);
                break;
            }

            default:
                console.log(`🔔 Evento não tratado do tipo ${event.type}`);
        }
    }
}

export { HandleStripeWebhookUseCase };
