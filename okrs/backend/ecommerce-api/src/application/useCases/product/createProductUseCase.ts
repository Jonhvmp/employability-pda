import { IProductRepository } from '../../../domain/interfaces/productRepository';
import { Product } from '../../../domain/entities/Product';

export interface CreateProductDTO {
  name: string;
  description?: string | null;
  price: number;
  stock: number;
}

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    try {
      // Criar nova instância de produto com validações automáticas
      // implementadas no construtor da entidade
      const product = new Product(
        data.name,
        data.price,
        data.stock,
        data.description || null
      );

      // Persistir no repositório
      return await this.productRepository.create(product);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao criar produto');
    }
  }
}
