import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { ApiError } from '../errors/ApiError.js';
import { SystemRole } from '../constants/index.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Authentication token missing or malformed'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error: any) {
    next(ApiError.unauthorized(`Invalid or expired authentication token: ${error.message}`));
  }
};

export const authorizeRoles = (...roles: SystemRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User not authenticated'));
    }

    if (!roles.includes(req.user.role as SystemRole)) {
      return next(
        ApiError.forbidden(
          `User role [${req.user.role}] is not authorized to access this resource`
        )
      );
    }

    next();
  };
};
