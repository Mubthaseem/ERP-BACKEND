import { Response } from 'express';
import { IApiResponse } from '../interfaces/ApiResponse.js';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: {
    success?: boolean;
    message?: string;
    data?: T;
    meta?: IApiResponse['meta'];
    errors?: any;
  }
) => {
  const response: IApiResponse<T> = {
    success: payload.success ?? (statusCode >= 200 && statusCode < 300),
    message: payload.message,
    data: payload.data,
    meta: payload.meta,
    errors: payload.errors,
  };

  return res.status(statusCode).json(response);
};
