import { Request, Response } from 'express';
import { PrismaClient } from '../generated/client';
import { LoginUseCase } from '../application/useCases/auth/loginUseCase';
import { RegisterUseCase } from '../application/useCases/auth/registerUseCase';
import { PrismaUserRepository } from '../infrastructure/repositories/PrismaUserRepository';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || '';
const userRepository = new PrismaUserRepository(prisma);

export class UserController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // Registrar novo usuário
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      }

      const registerUseCase = new RegisterUseCase(userRepository, JWT_SECRET);
      const result = await registerUseCase.execute({ name, email, password });

      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Email já está em uso') {
          return res.status(400).json({ error: error.message });
        }
      }
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  // Login de usuário
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const loginUseCase = new LoginUseCase(userRepository, JWT_SECRET);
      const result = await loginUseCase.execute({ email, password });

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Credenciais inválidas') {
          return res.status(401).json({ error: error.message });
        }
      }
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  // Obter perfil do usuário
  async getProfile(req: Request, res: Response) {
    try {
      // O ID do usuário será obtido do middleware de autenticação
      const userId = (req as any).user.id;

      const user = await userRepository.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(user.toJSON());
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
  }

  // Listar todos os usuários (apenas para admin)
  async findAll(_req: Request, res: Response) {
    try {
      const users = await userRepository.findAll();
      // Mapear para remover senhas
      const usersWithoutPassword = users.map(user => user.toJSON());
      return res.json(usersWithoutPassword);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }

  // Obter usuário por ID
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userRepository.findById(Number(id));

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(user.toJSON());
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  // Atualizar um usuário
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      // Verificar se o usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) }
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Preparar dados para atualização
      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      // Se senha fornecida, hash antes de salvar
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      // Atualizar usuário
      const user = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          password: false // Excluir senha
        }
      });

      return res.json(user);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }

  // Excluir um usuário
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se o usuário existe
      const existingUser = await prisma.user.findUnique({
        where: { id: Number(id) }
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Excluir usuário
      await prisma.user.delete({
        where: { id: Number(id) }
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
  }
}
