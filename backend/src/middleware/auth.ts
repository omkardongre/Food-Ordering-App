import dotenv from 'dotenv';
import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import logger from '../utils/logger';
import { AppError } from '../utils/errors';

dotenv.config();

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_IS_USER_BASE_URL,
  tokenSigningAlg: 'RS256',
});

export const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }
    const tokenMatch = authorization.match(/^Bearer\s+(\S+)$/);
    const token = tokenMatch ? tokenMatch[1] : null;
    if (!token) throw new AppError('Invalid token format', 401);

    const decoded = jwt.decode(token);
    if (!decoded) {
      throw new AppError('Invalid token', 401);
    }
    const auth0Id = decoded.sub;
    const user = await User.findOne({ auth0Id });
    if (!user) {
      throw new AppError('User not found', 401);
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    logger.error(
      `Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { stack: error instanceof Error ? error.stack : undefined },
    );
    next(error);
  }
};
