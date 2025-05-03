export type UserId = number;

export class User {
  private _id?: UserId;
  private _name: string;
  private _email: string;
  private _password: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    name: string,
    email: string,
    password: string,
    id?: UserId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  // Getters
  get id(): UserId | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Setters com validações
  set name(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome do usuário não pode ser vazio');
    }
    this._name = name;
    this.updateTimestamp();
  }

  set email(email: string) {
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Email inválido');
    }
    this._email = email;
    this.updateTimestamp();
  }

  set password(password: string) {
    if (!password || password.trim().length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }
    this._password = password;
    this.updateTimestamp();
  }

  // Atualizar timestamp
  private updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  // Método para autenticação
  isPasswordValid(password: string): boolean {
    return this._password === password;
  }

  // Método para criar uma representação sem a senha
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
