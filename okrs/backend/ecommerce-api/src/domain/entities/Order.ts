import { UserId } from './User';
import { OrderItem, OrderId } from './OrderItem';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export class Order {
  private _id?: OrderId;
  private _userId: UserId;
  private _items: OrderItem[];
  private _total: number;
  private _status: OrderStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    userId: UserId,
    items: OrderItem[] = [],
    status: OrderStatus = OrderStatus.PENDING,
    id?: OrderId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateItems(items);

    this._id = id;
    this._userId = userId;
    this._items = items;
    this._total = this.calculateTotal();
    this._status = status;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  // Getters
  get id(): OrderId | undefined {
    return this._id;
  }

  get userId(): UserId {
    return this._userId;
  }

  get items(): OrderItem[] {
    return [...this._items]; // Retorna uma cópia para evitar modificações externas
  }

  get total(): number {
    return this._total;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Validações
  private validateItems(items: OrderItem[]): void {
    if (items.length === 0) {
      throw new Error('Um pedido deve conter pelo menos um item');
    }
  }

  // Lógica de negócios
  private calculateTotal(): number {
    return this._items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }

  addItem(item: OrderItem): void {
    // Verificar se o item já existe no pedido
    const existingItemIndex = this._items.findIndex(i => i.productId === item.productId);

    if (existingItemIndex >= 0) {
      // Se o item já existe, substitua-o (em um cenário real, você poderia somar as quantidades)
      this._items[existingItemIndex] = item;
    } else {
      // Se o item não existe, adicione-o
      this._items.push(item);
    }

    // Recalcular o total
    this._total = this.calculateTotal();
    this.updateTimestamp();
  }

  removeItem(productId: number): void {
    const initialLength = this._items.length;
    this._items = this._items.filter(item => item.productId !== productId);

    if (this._items.length === initialLength) {
      throw new Error('Item não encontrado no pedido');
    }

    if (this._items.length === 0) {
      throw new Error('Um pedido não pode ficar sem itens');
    }

    // Recalcular o total
    this._total = this.calculateTotal();
    this.updateTimestamp();
  }

  changeStatus(newStatus: OrderStatus): void {
    // Validar transições de status permitidas
    if (this._status === OrderStatus.CANCELED) {
      throw new Error('Um pedido cancelado não pode mudar de status');
    }

    if (this._status === OrderStatus.DELIVERED && newStatus !== OrderStatus.CANCELED) {
      throw new Error('Um pedido entregue só pode ser cancelado');
    }

    this._status = newStatus;
    this.updateTimestamp();
  }

  cancel(): void {
    if (this._status === OrderStatus.DELIVERED) {
      throw new Error('Um pedido já entregue não pode ser cancelado');
    }

    this._status = OrderStatus.CANCELED;
    this.updateTimestamp();
  }

  private updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  // Serialização
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      userId: this._userId,
      items: this._items.map(item => item.toJSON()),
      total: this._total,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
