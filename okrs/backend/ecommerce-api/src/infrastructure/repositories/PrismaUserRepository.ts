import { PrismaClient } from '../../generated/client';
import { IUserRepository } from '../../domain/interfaces/userRepository';
import { User, UserId } from '../../domain/entities/User';

export class PrismaUserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => this.mapToEntity(user));
  }

  async findById(id: UserId): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    return user ? this.mapToEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    return user ? this.mapToEntity(user) : null;
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password
      }
    });

    return this.mapToEntity(createdUser);
  }

  async update(user: User): Promise<User> {
    if (!user.id) {
      throw new Error('Usuário não possui ID');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        password: user.password
      }
    });

    return this.mapToEntity(updatedUser);
  }

  async delete(id: UserId): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }

  private mapToEntity(prismaUser: any): User {
    return new User(
      prismaUser.name,
      prismaUser.email,
      prismaUser.password,
      prismaUser.id,
      prismaUser.createdAt,
      prismaUser.updatedAt
    );
  }
}
