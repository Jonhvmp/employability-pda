import { IProductRepository } from '../../../domain/interfaces/productRepository';
import { ProductId } from '../../../domain/entities/Product';

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: ProductId): Promise<void> {
    // Verificar se o produto existe
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new Error('Produto não encontrado');
    }

    // Em um sistema real, aqui poderia haver validações adicionais
    // como verificar se o produto está em algum pedido antes de excluí-lo

    // Excluir o produto
    await this.productRepository.delete(id);
  }
}
