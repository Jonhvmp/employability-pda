export type ProductId = number;

export class Product {
  private _id?: ProductId;
  private _name: string;
  private _description: string | null;
  private _price: number;
  private _stock: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    name: string,
    price: number,
    stock: number,
    description: string | null = null,
    id?: ProductId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateName(name);
    this.validatePrice(price);
    this.validateStock(stock);

    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._stock = stock;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
  }

  // Getters
  get id(): ProductId | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Setters com validações
  set name(name: string) {
    this.validateName(name);
    this._name = name;
    this.updateTimestamp();
  }

  set description(description: string | null) {
    this._description = description;
    this.updateTimestamp();
  }

  set price(price: number) {
    this.validatePrice(price);
    this._price = price;
    this.updateTimestamp();
  }

  set stock(stock: number) {
    this.validateStock(stock);
    this._stock = stock;
    this.updateTimestamp();
  }

  // Métodos de validação
  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome do produto não pode ser vazio');
    }
    if (name.length > 255) {
      throw new Error('Nome do produto não pode ter mais de 255 caracteres');
    }
  }

  private validatePrice(price: number): void {
    if (price < 0) {
      throw new Error('Preço não pode ser negativo');
    }
  }

  private validateStock(stock: number): void {
    if (stock < 0) {
      throw new Error('Estoque não pode ser negativo');
    }
  }

  // Atualizar timestamp
  private updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  // Lógica de negócios
  isAvailable(): boolean {
    return this._stock > 0;
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    if (this._stock < quantity) {
      throw new Error(`Estoque insuficiente para o produto ${this._name}`);
    }

    this._stock -= quantity;
    this.updateTimestamp();
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    this._stock += quantity;
    this.updateTimestamp();
  }

  // Serialização
  toJSON(): Record<string, any> {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      price: this._price,
      stock: this._stock,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
