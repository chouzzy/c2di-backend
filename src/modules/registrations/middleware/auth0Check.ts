import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import CryptoJS from 'crypto-js';

const jwtCheck = auth({
    audience: 'https://auth.c2di.awer.co',
    issuerBaseURL: 'https://dev-pzivs8swerlhnydf.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

const checkJwtFromCookie = (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.accessToken; // Extrai o token do cookie

    const secretKey = process.env.AUTH0_SECRET; 

    if(!secretKey) {
        throw Error("Secret Key not found")
    }
    
    const encryptedToken = req.cookies.accessToken;
    const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, secretKey).toString(CryptoJS.enc.Utf8);

    if (token) {
      req.headers.authorization = `Bearer ${decryptedToken}`; // Adiciona o token ao header
    }
    next(); // Chama a próxima middleware (jwtCheck)
  };
  
  

  export { jwtCheck, checkJwtFromCookie };
