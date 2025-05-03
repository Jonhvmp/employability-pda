import { IOrderRepository } from '../../../domain/interfaces/orderRepository';
import { Order } from '../../../domain/entities/Order';
import { UserId } from '../../../domain/entities/User';

export class GetUserOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(userId: UserId): Promise<Order[]> {
    return this.orderRepository.findByUserId(userId);
  }
}
