// src/modules/stripe/useCases/handleStripeWebhook/HandleStripeWebhookUseCase.ts

import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

// Inicializa o cliente do Prisma
const prisma = new PrismaClient();

// Inicializa o cliente do Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    // Nota: '2025-06-30.basil' é uma versão beta. Para produção, considere usar a última versão estável, ex: '2024-06-20'.
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

                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
                if (!currentPeriodEnd) {
                    console.error(`❌ Erro: Não foi possível encontrar current_period_end para a assinatura ${subscriptionId}`);
                    return;
                }

                await prisma.user.update({
                    where: { auth0UserId },
                    data: {
                        stripe: {
                            customerId: customerId,
                            subscriptionId: subscription.id,
                            status: subscription.status,
                            currentPeriodEnd: new Date(currentPeriodEnd * 1000),
                        },
                    },
                });

                console.log(`✅ Assinatura criada para o usuário ${auth0UserId}. Status: ${subscription.status}`);
                break;
            }

            // Este evento lida com renovações, falhas de pagamento, cancelamentos, etc.
            // Ele é a nossa única fonte da verdade para o status da assinatura.
            case 'customer.subscription.updated': {
                console.log('🔄 Evento: customer.subscription.updated recebido.');
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                
                console.log('🔄 !!!Status:', subscription.status)
                const user = await prisma.user.findFirst({
                    where: { stripe: { is: { customerId: customerId } } }
                });

                if (!user || !user.stripe) {
                    console.error(`❌ Erro: Usuário com customerId ${customerId} não encontrado para subscription.updated.`);
                    return;
                }

                const currentPeriodEnd = subscription.items.data[0]?.current_period_end;


                // Apenas atualizamos nosso banco de dados para espelhar o estado atual do Stripe.
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        stripe: {
                            ...user.stripe, // Mantém dados como o customerId
                            subscriptionId: subscription.id,
                            status: subscription.status, // O status mais recente vindo do Stripe
                            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : user.stripe.currentPeriodEnd,
                        },
                    },
                });

                console.log(`🔄 Assinatura atualizada para o usuário ${user.auth0UserId}. Novo status: ${subscription.status}`);
                break;
            }

            // Caso: Uma fatura de renovação foi paga com sucesso
            case 'invoice.paid': {
                console.log('💰 Evento: invoice.paid recebido.');
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;

                // O ID da assinatura vem de dentro do primeiro item da fatura.
                const subscriptionId = invoice.lines.data[0]?.subscription as string;
                if (!subscriptionId) {
                    // Ignora faturas que não são de assinaturas (ex: pagamentos únicos)
                    console.log(`🔔 Fatura avulsa paga (ID: ${invoice.id}), ignorando.`);
                    return;
                }

                const user = await prisma.user.findFirst({
                    where: { stripe: { is: { customerId: customerId } } }
                });
                if (!user || !user.stripe) {
                    console.error(`❌ Erro: Usuário com customerId ${customerId} não encontrado para invoice.paid.`);
                    return;
                }

                // Busca os dados mais recentes da assinatura para garantir que temos o status e a data corretos
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const currentPeriodEnd = subscription.items.data[0]?.current_period_end;

                // Atualiza o status e a data de renovação
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        stripe: {
                            ...user.stripe,
                            status: subscription.status, // Deve ser 'active'
                            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : user.stripe.currentPeriodEnd,
                        }
                    }
                });

                console.log(`💰 Fatura paga para o usuário ${user.auth0UserId}. Assinatura renovada.`);
                break;
            }

            // Caso: Uma fatura de renovação falhou
            case 'invoice.payment_failed': {
                console.log('⚠️ Evento: invoice.payment_failed recebido.');
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;

                // CORREÇÃO: Pegamos o ID da assinatura aqui
                const subscriptionId = invoice.lines.data[0]?.subscription as string;
                if (!subscriptionId) {
                    console.error(`❌ Erro: subscriptionId não encontrado na fatura invoice.payment_failed.`);
                    return;
                }

                const user = await prisma.user.findFirst({
                    where: { stripe: { is: { customerId: customerId } } }
                });
                if (!user || !user.stripe) {
                    console.error(`❌ Erro: Usuário com customerId ${customerId} não encontrado.`);
                    return;
                }

                // CORREÇÃO: Buscamos a assinatura completa para pegar o status
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        stripe: {
                            ...user.stripe,
                            status: subscription.status, // Atualiza para 'past_due'
                        }
                    }
                });

                console.log(`⚠️ Falha no pagamento para o usuário ${user.auth0UserId}. Status: ${subscription.status}`);
                break;
            }

            // Caso: Uma assinatura existente foi atualizada
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const user = await prisma.user.findFirst({
                    where: { stripe: { is: { customerId: customerId } } }
                });
                if (!user || !user.stripe) {
                    console.error(`❌ Erro: Usuário com customerId ${customerId} não encontrado.`);
                    return;
                }

                const currentPeriodEnd = subscription.items.data[0]?.current_period_end;

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        stripe: {
                            customerId: user.stripe.customerId,
                            subscriptionId: subscription.id,
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

                const user = await prisma.user.findFirst({
                    where: { stripe: { is: { customerId: customerId } } }
                });
                if (!user || !user.stripe) {
                    console.error(`❌ Erro: Usuário com customerId ${customerId} não encontrado.`);
                    return;
                }

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        stripe: {
                            ...user.stripe,
                            status: subscription.status,
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
