import express from 'express';
import 'express-async-errors'; // Ótima prática para lidar com erros
import cors from 'cors';

// Importe AMBOS os roteadores
import { router } from './routes'; // Roteador principal para rotas comuns
import { stripeRoutes } from './routes/stripe.routes'; // Roteador específico do Stripe

const app = express();

app.use(cors());

// 1. ROTA VIP PARA O STRIPE
// Colocamos a rota do webhook do Stripe ANTES de qualquer parser de JSON.
// O express.raw() que está dentro de stripe.routes.ts vai funcionar perfeitamente aqui.
app.use(stripeRoutes);

// 2. "MORDOMO" GLOBAL PARA AS OUTRAS ROTAS
// Agora, depois da rota do Stripe já ter passado, aplicamos o parser de JSON
// para todas as outras rotas da sua aplicação.
app.use(express.json());

// 3. REGISTRO DAS ROTAS COMUNS
// O roteador principal é registrado por último.
app.use(router);


// --- Inicialização do Servidor ---
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});