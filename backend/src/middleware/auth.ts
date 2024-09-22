import dotenv from 'dotenv';
import { auth } from 'express-oauth2-jwt-bearer';
dotenv.config();

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_IS_USER_BASE_URL,
  tokenSigningAlg: 'RS256',
});
