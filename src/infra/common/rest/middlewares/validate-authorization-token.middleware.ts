import { auth } from 'express-oauth2-jwt-bearer';

export const validateAuthorizationToken = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_TOKEN_ISSUER,
  tokenSigningAlg: process.env.AUTH0_TOKEN_ALGORITHM,
});
