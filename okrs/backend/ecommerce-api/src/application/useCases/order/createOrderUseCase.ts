import { IOrderRepository } from '../../../domain/interfaces/orderRepository';
import { IProductRepository } from '../../../domain/interfaces/productRepository';
import { Order } from '../../../domain/entities/Order';
import { OrderItem } from '../../../domain/entities/OrderItem';
import { UserId } from '../../../domain/entities/User';
import { ProductId } from '../../../domain/entities/Product';

export interface OrderItemDTO {
  productId: ProductId;
  quantity: number;
}

export interface CreateOrderDTO {
  userId: UserId;
  items: OrderItemDTO[];
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(data: CreateOrderDTO): Promise<Order> {
    // Validar se há itens no pedido
    if (!data.items || data.items.length === 0) {
      throw new Error('O pedido deve conter pelo menos um item');
    }

    // Buscar todos os produtos do pedido para validar disponibilidade e preço
    const productIds = data.items.map(item => item.productId);
    const products = await Promise.all(
      productIds.map(id => this.productRepository.findById(id))
    );

    // Verificar se todos os produtos existem
    const missingProducts = products.filter(p => p === null);
    if (missingProducts.length > 0) {
      throw new Error('Um ou mais produtos não foram encontrados');
    }

    // Criar itens do pedido
    const orderItems: OrderItem[] = [];
    let hasOutOfStockItems = false;
    let outOfStockProductName = '';

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const product = products[i]!; // Non-null assertion porque já validamos acima

      // Verificar estoque
      if (product.stock < item.quantity) {
        hasOutOfStockItems = true;
        outOfStockProductName = product.name;
        break;
      }

      // Criar item do pedido
      const orderItem = new OrderItem(
        product.id!,
        item.quantity,
        product.price
      );

      orderItems.push(orderItem);
    }

    if (hasOutOfStockItems) {
      throw new Error(`Produto "${outOfStockProductName}" não possui estoque suficiente`);
    }

    // Criar o pedido
    const order = new Order(data.userId, orderItems);

    // Usar transação para garantir consistência
    const createdOrder = await this.orderRepository.create(order);

    // Atualizar o estoque dos produtos
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      const product = products[i]!;

      // Decrementar o estoque
      product.decreaseStock(item.quantity);
      await this.productRepository.update(product);
    }

    return createdOrder;
  }
}
