import { Product, ProductId } from '../entities/Product';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: ProductId): Promise<Product | null>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: ProductId): Promise<void>;
  updateStock(id: ProductId, quantity: number): Promise<Product>;
}
