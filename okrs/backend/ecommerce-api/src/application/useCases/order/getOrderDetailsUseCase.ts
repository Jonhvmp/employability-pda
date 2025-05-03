import { IOrderRepository } from '../../../domain/interfaces/orderRepository';
import { Order } from '../../../domain/entities/Order';
import { OrderId } from '../../../domain/entities/OrderItem';
import { UserId } from '../../../domain/entities/User';

export class GetOrderDetailsUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: OrderId, userId: UserId, isAdmin: boolean = false): Promise<Order> {
    // Buscar o pedido
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    // Verificar permissão: apenas o dono do pedido ou um admin podem ver os detalhes
    if (!isAdmin && order.userId !== userId) {
      throw new Error('Você não tem permissão para ver este pedido');
    }

    return order;
  }
}
