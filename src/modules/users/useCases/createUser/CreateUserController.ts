// src/modules/users/useCases/createUser/CreateUserController.ts

import { Request, Response } from 'express';
import { CreateUserUseCase } from './CreateUserUseCase';

/**
 * @class CreateUserController
 * @description Lida com a requisição HTTP para criar um novo usuário.
 */
class CreateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        // --- 1. Verificação de Segurança ---
        // Comparamos uma chave secreta enviada no cabeçalho da requisição
        // com uma chave guardada nas nossas variáveis de ambiente.
        // Isso garante que apenas o Auth0 possa chamar este endpoint.
        const secretKey = request.headers['x-auth0-secret'];
        if (secretKey !== process.env.AUTH0_HOOK_SECRET) {
            return response.status(401).json({ error: 'Acesso não autorizado.' });
        }

        // --- 2. Extração dos Dados ---
        // Pegamos o e-mail e o ID do usuário do corpo da requisição,
        // que serão enviados pela "Ação" do Auth0.
        const { email, auth0UserId } = request.body;

        // Validação básica dos dados recebidos
        if (!email || !auth0UserId) {
            return response.status(400).json({ error: 'E-mail e auth0UserId são obrigatórios.' });
        }

        // --- 3. Execução da Lógica de Negócio ---
        const createUserUseCase = new CreateUserUseCase();

        try {
            const newUser = await createUserUseCase.execute({ email, auth0UserId });
            // Retorna o usuário criado com o status 201 (Created)
            return response.status(201).json(newUser);
        } catch (err: any) {
            console.error("❌ Erro ao criar usuário:", err.message);
            // Retorna um erro genérico caso algo dê errado no UseCase
            return response.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
}

export { CreateUserController };
