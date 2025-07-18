// src/modules/stripe/useCases/createPortalSession/CreatePortalSessionController.ts

import { Request, Response } from 'express';
import { CreatePortalSessionUseCase } from './CreatePortalSessionUseCase';

/**
 * @class CreatePortalSessionController
 * @description Lida com a requisição HTTP para criar a sessão do portal.
 */
class CreatePortalSessionController {
    async handle(request: Request, response: Response): Promise<Response> {
        // O middleware 'checkJwt' já validou o token e adicionou o payload a 'request.auth'
        const auth0UserId = request.auth?.payload?.sub as string | undefined;

        if (!auth0UserId) {
            return response.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const createPortalSessionUseCase = new CreatePortalSessionUseCase();
        
        try {
            const { url } = await createPortalSessionUseCase.execute(auth0UserId);
            return response.status(200).json({ url });
        } catch (err: any) {
            console.error("❌ Erro ao criar sessão do portal:", err.message);
            return response.status(400).json({ error: err.message });
        }
    }
}

export { CreatePortalSessionController };
