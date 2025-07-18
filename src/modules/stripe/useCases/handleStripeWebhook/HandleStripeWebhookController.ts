// src/modules/stripe/useCases/handleStripeWebhook/HandleStripeWebhookController.ts

import { Request, Response } from 'express';
import Stripe from 'stripe';
import { HandleStripeWebhookUseCase } from './HandleStripeWebhookUseCase';

// Inicializa o cliente do Stripe apenas para a verificação do webhook
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-06-30.basil',
});

// Chave secreta do endpoint de webhook, que você obtém no painel do Stripe.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

/**
 * @class HandleStripeWebhookController
 * @description Lida com a requisição HTTP para os webhooks do Stripe.
 */
class HandleStripeWebhookController {
    /**
     * Recebe a requisição, verifica a assinatura e passa o evento para o UseCase.
     * @param {Request} request - O objeto de requisição do Express.
     * @param {Response} response - O objeto de resposta do Express.
     */
    async handle(request: Request, response: Response): Promise<Response> {
        console.log('🔔 Recebendo evento do Stripe Webhook');
        // Obtém a assinatura do webhook dos cabeçalhos da requisição
        const sig = request.headers['stripe-signature'] as string;

        let event: Stripe.Event;

        try {
            // 1. VERIFICAÇÃO DE SEGURANÇA
            // Constrói e verifica o evento para garantir que ele veio do Stripe.
            // Usa o corpo "cru" da requisição (request.body) que configuramos na rota.
            event = stripe.webhooks.constructEvent(request.body, sig, webhookSecret);
        } catch (err: any) {
            // Se a assinatura for inválida, retorna um erro e encerra.
            console.error(`❌ Erro na verificação da assinatura do webhook: ${err.message}`);
            return response.status(400).send(`Webhook Error: ${err.message}`);
        }

        // 2. EXECUÇÃO DA LÓGICA DE NEGÓCIO
        // Instancia o nosso UseCase
        const handleStripeWebhookUseCase = new HandleStripeWebhookUseCase();
        
        try {
            // Chama o método execute do UseCase, passando o evento verificado
            await handleStripeWebhookUseCase.execute(event);
        } catch (err: any) {
            // Captura qualquer erro que possa ocorrer durante a lógica de negócio
            console.error(`❌ Erro ao processar o evento do webhook: ${err.message}`);
            // Retorna um erro 500 para indicar um problema no servidor
            return response.status(500).json({ error: 'Internal server error' });
        }

        // 3. RESPOSTA DE SUCESSO
        // Retorna uma resposta 200 para o Stripe para confirmar o recebimento bem-sucedido do evento.
        // Se o Stripe não receber essa resposta, ele tentará enviar o webhook novamente.
        return response.status(200).json({ received: true });
    }
}

export { HandleStripeWebhookController };
