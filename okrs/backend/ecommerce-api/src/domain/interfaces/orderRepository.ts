import { Order, OrderStatus } from '../entities/Order';
import { OrderId } from '../entities/OrderItem';
import { UserId } from '../entities/User';

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: OrderId): Promise<Order | null>;
  findByUserId(userId: UserId): Promise<Order[]>;
  create(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  updateStatus(id: OrderId, status: OrderStatus): Promise<Order>;
  delete(id: OrderId): Promise<void>;
}
