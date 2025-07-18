// src/routes/welcome.routes.ts

import { Router } from 'express';

// Cria uma nova instância do roteador do Express
const welcomeRoutes = Router();

/**
 * @route   GET /
 * @desc    Rota de boas-vindas da API
 * @access  Público
 */
welcomeRoutes.get('/', (request, response) => {
    // Retorna uma resposta JSON simples para indicar que a API está online
    return response.status(200).json({
        message: 'Bem-vindo à API de Licenciamento do BoTRT!',
        status: 'online',
        version: '1.0.0',
    });
});

// Exporta o roteador para ser usado no arquivo principal de rotas (index.ts)
export { welcomeRoutes };
