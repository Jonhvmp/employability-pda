import { IProductRepository } from '../../../domain/interfaces/productRepository';
import { Product, ProductId } from '../../../domain/entities/Product';

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
}

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: ProductId, data: UpdateProductDTO): Promise<Product> {
    // Buscar o produto existente
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new Error('Produto não encontrado');
    }

    try {
      // Atualizar apenas os campos fornecidos
      if (data.name !== undefined) {
        existingProduct.name = data.name;
      }

      if (data.description !== undefined) {
        existingProduct.description = data.description;
      }

      if (data.price !== undefined) {
        existingProduct.price = data.price;
      }

      if (data.stock !== undefined) {
        existingProduct.stock = data.stock;
      }

      // Persistir as alterações
      return await this.productRepository.update(existingProduct);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao atualizar produto');
    }
  }
}
