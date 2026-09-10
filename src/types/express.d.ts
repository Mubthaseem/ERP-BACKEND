import { IJwtPayload } from '../common/interfaces/JwtPayload.js';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

export {};
