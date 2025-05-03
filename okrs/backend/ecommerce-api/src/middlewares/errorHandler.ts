import { Request, Response, NextFunction } from 'express';
import { AppError } from '../infrastructure/errors/AppError';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  // Se for um AppError (erro conhecido da aplicação)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code,
    });
  }

  // Se for erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      code: 'VALIDATION_ERROR',
    });
  }

  // Para erros não tratados (erros internos)
  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : err.message || 'Erro interno do servidor',
    code: 'INTERNAL_SERVER_ERROR',
  });
}
