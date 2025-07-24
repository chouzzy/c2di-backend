
import { Router } from "express";
import { welcomeRoutes } from "./welcome.routes";
import { userRoutes } from "./users.routes";
// REMOVA a importação da stripeRoutes daqui

const router = Router();

// O roteador principal agora só cuida das rotas que PODEM usar o express.json()
router.use('/', welcomeRoutes);
router.use(userRoutes); //User Routes
// Adicione outras rotas comuns aqui...

export { router };
