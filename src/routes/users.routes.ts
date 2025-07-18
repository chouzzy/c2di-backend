// src/routes/user.routes.ts

import { Router } from 'express';
import { CreateUserController } from '../modules/users/useCases/createUser/CreateUserController';

// --- Inicialização ---
const userRoutes = Router();

// Cria uma instância do nosso controller de criação de usuário
const createUserController = new CreateUserController();

/**
 * @route   POST /api/users
 * @desc    Cria um novo usuário no banco de dados.
 * Esta rota é projetada para ser chamada por uma "Ação" do Auth0.
 * @access  Privado (Protegido por uma chave secreta no header)
 */
userRoutes.post(
    '/api/users',
    createUserController.handle
);

export { userRoutes };
