import { Request, Response } from 'express';
import logger from '../utils/logger';
import { AppError } from '../utils/errors';

const errorHandler = (err: AppError | Error, req: Request, res: Response) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  if (err instanceof AppError) {
    logger.error(`AppError: ${err.message}`, { stack: err.stack, statusCode, path: req.path });
  } else if (err instanceof Error) {
    logger.error(`Error: ${err.message}`, { stack: err.stack, path: req.path });
  } else {
    logger.error('Unknown error occurred', { path: req.path });
  }

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    status: statusCode,
  });
};

export default errorHandler;
