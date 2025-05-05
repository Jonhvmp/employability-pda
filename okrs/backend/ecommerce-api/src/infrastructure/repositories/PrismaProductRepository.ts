import { PrismaClient } from '@prisma/client';
import { IProductRepository } from '../../domain/interfaces/productRepository';
import { Product, ProductId } from '../../domain/entities/Product';

export class PrismaProductRepository implements IProductRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map(product => this.mapToEntity(product));
  }

  async findById(id: ProductId): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id }
    });

    return product ? this.mapToEntity(product) : null;
  }

  async create(product: Product): Promise<Product> {
    const createdProduct = await this.prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      }
    });

    return this.mapToEntity(createdProduct);
  }

  async update(product: Product): Promise<Product> {
    if (!product.id) {
      throw new Error('Produto não possui ID');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      }
    });

    return this.mapToEntity(updatedProduct);
  }

  async delete(id: ProductId): Promise<void> {
    await this.prisma.product.delete({
      where: { id }
    });
  }

  async updateStock(id: ProductId, quantity: number): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        stock: {
          increment: quantity // Pode ser negativo para decrementar
        }
      }
    });

    return this.mapToEntity(product);
  }

  private mapToEntity(prismaProduct: any): Product {
    return new Product(
      prismaProduct.name,
      Number(prismaProduct.price), // Convertendo Decimal para Number
      prismaProduct.stock,
      prismaProduct.description,
      prismaProduct.id,
      prismaProduct.createdAt,
      prismaProduct.updatedAt
    );
  }
}
