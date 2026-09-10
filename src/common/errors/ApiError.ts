export class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: any;

  constructor(statusCode: number, message: string, errors?: any, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', errors?: any) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden: Access Denied') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource Not Found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflict / Already Exists') {
    return new ApiError(409, message);
  }

  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message);
  }
}
