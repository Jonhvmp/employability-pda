import { ProductId } from './Product';

export type OrderItemId = number;
export type OrderId = number;

export class OrderItem {
  private _id?: OrderItemId;
  private _orderId?: OrderId;
  private _productId: ProductId;
  private _quantity: number;
  private _price: number;

  constructor(
    productId: ProductId,
    quantity: number,
    price: number,
    orderId?: OrderId,
    id?: OrderItemId
  ) {
    this.validateQuantity(quantity);
    this.validatePrice(price);

    this._id = id;
    this._orderId = orderId;
    this._productId = productId;
    this._quantity = quantity;
    this._price = price;
  }

  // Getters
  get id(): OrderItemId | undefined {
    return this._id;
  }

  get orderId(): OrderId | undefined {
    return this._orderId;
  }

  get productId(): ProductId {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._price;
  }

  // Métodos de validação
  private validateQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Quantidade deve ser um número inteiro maior que zero');
    }
  }

  private validatePrice(price: number): void {
    if (price < 0) {
      throw new Error('Preço não pode ser negativo');
    }
  }

  // Lógica de negócios
  getSubtotal(): number {
    return this._price * this._quantity;
  }

  // Serialização
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      orderId: this._orderId,
      productId: this._productId,
      quantity: this._quantity,
      price: this._price,
      subtotal: this.getSubtotal()
    };
  }
}
