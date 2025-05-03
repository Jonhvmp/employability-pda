import { IOrderRepository } from '../../../domain/interfaces/orderRepository';
import { IProductRepository } from '../../../domain/interfaces/productRepository';
import { OrderId } from '../../../domain/entities/OrderItem';
import { UserId } from '../../../domain/entities/User';
import { OrderStatus } from '../../../domain/entities/Order';

export class CancelOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(orderId: OrderId, userId: UserId, isAdmin: boolean = false): Promise<void> {
    // Buscar o pedido com seus itens
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    // Verificar permissão: apenas o dono do pedido ou um admin podem cancelá-lo
    if (!isAdmin && order.userId !== userId) {
      throw new Error('Você não tem permissão para cancelar este pedido');
    }

    // Verificar se o pedido já está entregue ou cancelado
    if (order.status === OrderStatus.DELIVERED) {
      throw new Error('Pedidos já entregues não podem ser cancelados');
    }

    if (order.status === OrderStatus.CANCELED) {
      throw new Error('Este pedido já foi cancelado');
    }

    // Cancelar o pedido e devolver items ao estoque
    try {
      // 1. Atualizar o status do pedido
      order.cancel();
      await this.orderRepository.update(order);

      // 2. Devolver os itens ao estoque
      for (const item of order.items) {
        const product = await this.productRepository.findById(item.productId);
        if (product) {
          product.increaseStock(item.quantity);
          await this.productRepository.update(product);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao cancelar o pedido');
    }
  }
}
