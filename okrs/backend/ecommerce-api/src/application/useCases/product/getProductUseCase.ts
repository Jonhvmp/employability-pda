import { IProductRepository } from '../../../domain/interfaces/productRepository';
import { Product, ProductId } from '../../../domain/entities/Product';

export class GetProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: ProductId): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    return product;
  }
}
