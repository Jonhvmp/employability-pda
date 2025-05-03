import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

interface JwtPayload {
  id: number;
  email: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Obter o token do cabeçalho
  const authHeader = req.headers.authorization;

  // Verificar se o token foi fornecido
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token com formato inválido' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token com formato inválido' });
  }

  // Verificar se o token é válido
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Adicionar informações do usuário à requisição para uso posterior
    (req as any).user = {
      id: decoded.id,
      email: decoded.email
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
