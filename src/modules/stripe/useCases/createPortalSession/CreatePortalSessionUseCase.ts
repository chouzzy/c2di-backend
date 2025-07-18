// src/modules/stripe/useCases/createPortalSession/CreatePortalSessionUseCase.ts

import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-06-30.basil',
});

/**
 * @class CreatePortalSessionUseCase
 * @description Lógica de negócio para criar uma sessão do Stripe Customer Portal.
 */
class CreatePortalSessionUseCase {
    /**
     * @param {string} auth0UserId - O ID do usuário autenticado.
     * @returns {Promise<{url: string}>} A URL para o portal do cliente.
     */
    async execute(auth0UserId: string): Promise<{ url: string }> {
        // 1. Encontra o usuário no banco de dados usando o ID do Auth0
        const user = await prisma.user.findUnique({
            where: { auth0UserId },
        });

        // 2. Verifica se o usuário existe e se tem um ID de cliente do Stripe
        if (!user || !user.stripe?.customerId) {
            throw new Error('Cliente Stripe não encontrado para este usuário.');
        }
        console.log('Usuário encontrado:', user);
        // 3. Cria a sessão do Portal de Faturamento no Stripe
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripe.customerId,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/minha-conta`, // Para onde o usuário volta
        });

        // 4. Retorna a URL gerada
        return { url: portalSession.url };
    }
}

export { CreatePortalSessionUseCase };
