// src/routes/stripe.routes.ts

import { Router } from 'express';
import express from 'express';

// --- Middlewares ---
import { checkJwt } from '../middlewares/auth';

// --- Controllers ---
import { HandleStripeWebhookController } from '../modules/stripe/useCases/handleStripeWebhook/HandleStripeWebhookController';
import { CreatePortalSessionController } from '../modules/stripe/useCases/createPortalSession/CreatePortalSessionController';
import { GetSubscriptionDetailsController } from '../modules/stripe/useCases/getSubscriptionDetails/GetSubscriptionDetailsController'; // 1. Importa o novo controller

// --- Inicialização ---
const stripeRoutes = Router();

const handleStripeWebhookController = new HandleStripeWebhookController();
const createPortalSessionController = new CreatePortalSessionController();
const getSubscriptionDetailsController = new GetSubscriptionDetailsController(); // 2. Cria uma instância do novo controller

// --- Definição das Rotas ---

// Rota de Webhook (pública, mas verificada pela assinatura do Stripe)
stripeRoutes.post(
    '/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    handleStripeWebhookController.handle
);

// Rota do Customer Portal (protegida, requer um JWT válido)
stripeRoutes.post(
    '/api/stripe/create-portal-session',
    checkJwt,
    createPortalSessionController.handle
);

// NOVA ROTA: Rota para buscar detalhes da assinatura (protegida)
stripeRoutes.get(
    '/api/subscription/details', // 3. Define a nova rota GET
    checkJwt,                    // 4. Protege a rota com o middleware
    getSubscriptionDetailsController.handle // 5. Conecta ao controller correspondente
);

export { stripeRoutes };
