import jwt, { SignOptions } from 'jsonwebtoken';
import { ENV } from '../../config/env.js';
import { IJwtPayload } from '../interfaces/JwtPayload.js';

export const generateToken = (payload: IJwtPayload, expiresIn = ENV.JWT_EXPIRES_IN): string => {
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, ENV.JWT_SECRET, options);
};

export const verifyToken = (token: string): IJwtPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as IJwtPayload;
};
