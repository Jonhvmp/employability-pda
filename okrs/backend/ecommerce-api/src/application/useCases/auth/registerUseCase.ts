import { IUserRepository } from '../../../domain/interfaces/userRepository';
import { User } from '../../../domain/entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// DTOs (Data Transfer Objects)
export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  user: Omit<User, 'password'>;
  token: string;
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtSecret: string
  ) {}

  async execute(data: RegisterDTO): Promise<AuthResult> {
    // Verificar se o email já está em uso
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Criar novo usuário
    const user = new User(
      data.name,
      data.email,
      hashedPassword
    );

    // Salvar no repositório
    const createdUser = await this.userRepository.create(user);

    // Gerar token JWT
    const token = jwt.sign(
      { id: createdUser.id, email: createdUser.email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    // Retornar resultado (usuário sem senha e token)
    return {
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt
      } as any,
      token
    };
  }
}
