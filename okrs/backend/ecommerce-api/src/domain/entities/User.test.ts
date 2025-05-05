import { User } from './User';

describe('Entidade Usuário', () => {
  it('deve criar um usuário com parâmetros válidos', () => {
    const user = new User('João Silva', 'joao@exemplo.com', 'senha123');

    expect(user.name).toBe('João Silva');
    expect(user.email).toBe('joao@exemplo.com');
    expect(user.password).toBe('senha123');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('deve lançar erro ao atualizar com nome inválido', () => {
    const user = new User('João Silva', 'joao@exemplo.com', 'senha123');

    expect(() => {
      user.name = '';
    }).toThrow('Nome do usuário não pode ser vazio');
  });

  it('deve lançar erro ao atualizar com email inválido', () => {
    const user = new User('João Silva', 'joao@exemplo.com', 'senha123');

    expect(() => {
      user.email = 'email-invalido';
    }).toThrow('Email inválido');
  });

  it('deve lançar erro ao atualizar com senha curta', () => {
    const user = new User('João Silva', 'joao@exemplo.com', 'senha123');

    expect(() => {
      user.password = '12345';
    }).toThrow('Senha deve ter pelo menos 6 caracteres');
  });

  it('deve validar a senha corretamente', () => {
    const user = new User('João Silva', 'joao@exemplo.com', 'senha123');

    expect(user.isPasswordValid('senha123')).toBe(true);
    expect(user.isPasswordValid('senhaerrada')).toBe(false);
  });

  it('deve retornar a representação JSON correta sem a senha', () => {
    const user = new User('João Silva', 'joao@exemplo.com', 'senha123');
    const json = user.toJSON();

    expect(json).toHaveProperty('name', 'João Silva');
    expect(json).toHaveProperty('email', 'joao@exemplo.com');
    expect(json).not.toHaveProperty('password');
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
  });

  it('deve atualizar o timestamp quando as propriedades são alteradas', () => {
    const user = new User('João Silva', 'joao@exemplo.com', 'senha123');
    const originalUpdatedAt = user.updatedAt;

    // Esperar um pouco para garantir que o timestamp seja diferente
    setTimeout(() => {
      user.name = 'Maria Silva';
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    }, 10);
  });
});
