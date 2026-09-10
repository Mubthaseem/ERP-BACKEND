import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError.js';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};
