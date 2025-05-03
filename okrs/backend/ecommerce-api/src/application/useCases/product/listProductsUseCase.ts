import { IProductRepository } from '../../../domain/interfaces/productRepository';
import { Product } from '../../../domain/entities/Product';

export class ListProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
