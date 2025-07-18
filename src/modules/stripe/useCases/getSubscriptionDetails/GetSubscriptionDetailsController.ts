// src/modules/stripe/useCases/getSubscriptionDetails/GetSubscriptionDetailsController.ts

import { Request, Response } from 'express';
import { GetSubscriptionDetailsUseCase } from './GetSubscriptionDetailsUseCase';

/**
 * @class GetSubscriptionDetailsController
 * @description Lida com a requisição HTTP para buscar os detalhes da assinatura.
 */
class GetSubscriptionDetailsController {
    async handle(request: Request, response: Response): Promise<Response> {
        // O middleware 'checkJwt' já validou o token e adicionou o payload a 'request.auth'
        const auth0UserId = request.auth?.payload?.sub as string | undefined;

        if (!auth0UserId) {
            return response.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const getSubscriptionDetailsUseCase = new GetSubscriptionDetailsUseCase();
        
        try {
            // Chama o UseCase para buscar os dados
            const subscriptionDetails = await getSubscriptionDetailsUseCase.execute(auth0UserId);
            // Retorna os detalhes encontrados com sucesso
            return response.status(200).json(subscriptionDetails);
        } catch (err: any) {
            console.error("❌ Erro ao buscar detalhes da assinatura:", err.message);
            // Retorna um erro 404 (Not Found) se a assinatura não for encontrada
            return response.status(404).json({ error: err.message });
        }
    }
}

export { GetSubscriptionDetailsController };
