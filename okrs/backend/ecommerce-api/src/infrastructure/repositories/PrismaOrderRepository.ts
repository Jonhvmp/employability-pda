import { PrismaClient } from '../../generated/client';
import { IOrderRepository } from '../../domain/interfaces/orderRepository';
import { Order, OrderStatus } from '../../domain/entities/Order';
import { OrderItem, OrderId } from '../../domain/entities/OrderItem';
import { UserId } from '../../domain/entities/User';

export class PrismaOrderRepository implements IOrderRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return orders.map(order => this.mapToEntity(order));
  }

  async findById(id: OrderId): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return order ? this.mapToEntity(order) : null;
  }

  async findByUserId(userId: UserId): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return orders.map(order => this.mapToEntity(order));
  }

  async create(order: Order): Promise<Order> {
    // Em uma implementação completa, isso seria feito em uma transação
    const createdOrder = await this.prisma.order.create({
      data: {
        userId: order.userId,
        total: order.total,
        status: order.status,
        items: {
          create: order.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    });
    return this.mapToEntity(createdOrder);
  }

  async update(order: Order): Promise<Order> {
    if (!order.id) {
      throw new Error('Pedido não possui ID');
    }

    // Atualizar o pedido
    const updatedOrder = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        total: order.total,
        status: order.status
      },
      include: {
        items: true
      }
    });

    return this.mapToEntity(updatedOrder);
  }

  async updateStatus(id: OrderId, status: OrderStatus): Promise<Order> {
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true
      }
    });

    return this.mapToEntity(updatedOrder);
  }

  async delete(id: OrderId): Promise<void> {
    // Em uma implementação completa, isso seria feito em uma transação
    // Primeiro excluímos os itens do pedido
    await this.prisma.orderItem.deleteMany({
      where: { orderId: id }
    });

    // Depois excluímos o pedido
    await this.prisma.order.delete({
      where: { id }
    });
  }

  private mapToEntity(prismaOrder: any): Order {
    // Mapear os itens do pedido
    const orderItems: OrderItem[] = prismaOrder.items.map((item: any) =>
      new OrderItem(
        item.productId,
        item.quantity,
        Number(item.price),
        item.orderId,
        item.id
      )
    );

    // Criar a entidade Order
    return new Order(
      prismaOrder.userId,
      orderItems,
      prismaOrder.status as OrderStatus,
      prismaOrder.id,
      prismaOrder.createdAt,
      prismaOrder.updatedAt
    );
  }
}
