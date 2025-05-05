import { LoginUseCase } from './loginUseCase';
import { IUserRepository } from '../../../domain/interfaces/userRepository';
import { User } from '../../../domain/entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Mock do bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}));

// Mock do jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake-jwt-token')
}));

describe('LoginUseCase', () => {
  // Mock do repositório de usuários
  let mockUserRepository: jest.Mocked<IUserRepository>;
  const jwtSecret = 'test-secret';
  let loginUseCase: LoginUseCase;
  const testDate = new Date();

  beforeEach(() => {
    // Resetar todos os mocks antes de cada teste
    jest.clearAllMocks();

    // Criar mock do repositório
    mockUserRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    // Criar o caso de uso com o mock
    loginUseCase = new LoginUseCase(mockUserRepository, jwtSecret);
  });

  it('deve autenticar o usuário com credenciais corretas', async () => {
    // Arrange - Configurar o mock para retornar um usuário
    const mockUser = new User(
      'Usuário Teste',
      'teste@exemplo.com',
      'senha-hasheada',
      1,
      testDate,
      testDate
    );

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Act - Executar o caso de uso
    const result = await loginUseCase.execute({
      email: 'teste@exemplo.com',
      password: 'senha-correta'
    });

    // Assert - Verificar os resultados
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('teste@exemplo.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('senha-correta', 'senha-hasheada');
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, email: 'teste@exemplo.com' },
      jwtSecret,
      { expiresIn: '24h' }
    );

    expect(result).toEqual({
      user: {
        id: 1,
        name: 'Usuário Teste',
        email: 'teste@exemplo.com',
        createdAt: testDate,
        updatedAt: testDate
      },
      token: 'fake-jwt-token'
    });

    // Verificar que a resposta não contém a senha
    expect(result.user).not.toHaveProperty('password');
  });

  it('deve lançar erro quando o usuário não for encontrado', async () => {
    // Arrange - Configurar o mock para retornar null (usuário não encontrado)
    mockUserRepository.findByEmail.mockResolvedValue(null);

    // Act & Assert - Executar e verificar que lança exceção
    await expect(
      loginUseCase.execute({
        email: 'naoexiste@exemplo.com',
        password: 'qualquer-senha'
      })
    ).rejects.toThrow('Credenciais inválidas');

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('naoexiste@exemplo.com');
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando a senha estiver incorreta', async () => {
    // Arrange - Configurar mock para retornar usuário mas senha incorreta
    const mockUser = new User(
      'Usuário Teste',
      'teste@exemplo.com',
      'senha-hasheada',
      1,
      testDate,
      testDate
    );

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    // Act & Assert - Executar e verificar que lança exceção
    await expect(
      loginUseCase.execute({
        email: 'teste@exemplo.com',
        password: 'senha-incorreta'
      })
    ).rejects.toThrow('Credenciais inválidas');

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('teste@exemplo.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('senha-incorreta', 'senha-hasheada');
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
