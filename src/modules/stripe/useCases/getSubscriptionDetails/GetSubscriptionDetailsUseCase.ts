// src/modules/stripe/useCases/getSubscriptionDetails/GetSubscriptionDetailsUseCase.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- Tipagem para os dados que vamos retornar ---
interface SubscriptionDetails {
    status: string;
    currentPeriodEnd: Date;
    planName: string; // Ex: "Plano Anual"
}

/**
 * @class GetSubscriptionDetailsUseCase
 * @description Lógica de negócio para buscar os detalhes da assinatura de um usuário.
 */
class GetSubscriptionDetailsUseCase {
    /**
     * @param {string} auth0UserId - O ID do usuário autenticado.
     * @returns {Promise<SubscriptionDetails>} Os detalhes formatados da assinatura.
     */
    async execute(auth0UserId: string): Promise<SubscriptionDetails> {
        // 1. Encontra o usuário no banco de dados usando o ID do Auth0
        const user = await prisma.user.findUnique({
            where: { auth0UserId },
        });

        // 2. Verifica se o usuário ou a assinatura existem
        if (!user || !user.stripe || !user.stripe.status || !user.stripe.currentPeriodEnd) {
            throw new Error('Assinatura não encontrada para este usuário.');
        }

        // 3. Lógica para determinar o nome do plano (pode ser aprimorada no futuro)
        // Por enquanto, vamos retornar um nome genérico baseado no status.
        // O ideal seria salvar o ID do plano do Stripe no DB e buscar o nome dele.
        const planName = user.stripe.subscriptionId?.includes('anual') ? "Plano Anual" : "Plano Mensal";

        // 4. Formata e retorna os dados para o frontend
        const subscriptionDetails: SubscriptionDetails = {
            status: user.stripe.status,
            currentPeriodEnd: user.stripe.currentPeriodEnd,
            planName: planName, // Simples lógica para determinar o nome do plano
        };

        return subscriptionDetails;
    }
}

export { GetSubscriptionDetailsUseCase };
