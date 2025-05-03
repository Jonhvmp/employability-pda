import { IUserRepository } from '../../../domain/interfaces/userRepository';
import { User } from '../../../domain/entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// DTOs (Data Transfer Objects)
export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResult {
  user: Omit<User, 'password'>;
  token: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtSecret: string
  ) {}

  async execute(data: LoginDTO): Promise<AuthResult> {
    // Buscar usuário pelo email
    const user = await this.userRepository.findByEmail(data.email);

    // Verificar se o usuário existe
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    // Retornar resultado (usuário sem senha e token)
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      } as any,
      token
    };
  }
}
