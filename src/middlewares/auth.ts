// src/middleware/auth.ts
import { auth } from 'express-oauth2-jwt-bearer';

// Configura o middleware para verificar o JWT
const checkJwt = auth({
  audience: 'https://auth.awer.co', // O "Identificador" da sua API no Auth0
  issuerBaseURL: `https://dev-pzivs8swerlhnydf.us.auth0.com/`,
  tokenSigningAlg: 'RS256'
});

export { checkJwt };