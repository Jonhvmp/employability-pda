import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaProductRepository } from '../infrastructure/repositories/PrismaProductRepository';
import { ListProductsUseCase } from '../application/useCases/product/listProductsUseCase';
import { GetProductUseCase } from '../application/useCases/product/getProductUseCase';
import { CreateProductUseCase } from '../application/useCases/product/createProductUseCase';
import { UpdateProductUseCase } from '../application/useCases/product/updateProductUseCase';
import { DeleteProductUseCase } from '../application/useCases/product/deleteProductUseCase';

const prisma = new PrismaClient();
const productRepository = new PrismaProductRepository(prisma);

export class ProductController {
  // Listar todos os produtos
  async findAll(req: Request, res: Response) {
    try {
      const listProductsUseCase = new ListProductsUseCase(productRepository);
      const products = await listProductsUseCase.execute();

      return res.json(products.map(product => product.toJSON()));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  }

  // Obter produto por ID
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const getProductUseCase = new GetProductUseCase(productRepository);

      try {
        const product = await getProductUseCase.execute(Number(id));
        return res.json(product.toJSON());
      } catch (error) {
        if (error instanceof Error && error.message === 'Produto não encontrado') {
          return res.status(404).json({ error: error.message });
        }
        throw error;
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  }

  // Criar um novo produto
  async create(req: Request, res: Response) {
    try {
      const { name, description, price, stock } = req.body;

      // Validação básica
      if (!name || price === undefined || stock === undefined) {
        return res.status(400).json({
          error: 'Dados incompletos. Nome, preço e estoque são obrigatórios.'
        });
      }

      const createProductUseCase = new CreateProductUseCase(productRepository);

      try {
        const product = await createProductUseCase.execute({
          name,
          description,
          price: Number(price),
          stock: Number(stock)
        });

        return res.status(201).json(product.toJSON());
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
        }
        throw error;
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({ error: 'Erro ao criar produto' });
    }
  }

  // Atualizar um produto
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, stock } = req.body;

      const updateProductUseCase = new UpdateProductUseCase(productRepository);

      try {
        const product = await updateProductUseCase.execute(
          Number(id),
          {
            name,
            description,
            price: price !== undefined ? Number(price) : undefined,
            stock: stock !== undefined ? Number(stock) : undefined
          }
        );

        return res.json(product.toJSON());
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Produto não encontrado') {
            return res.status(404).json({ error: error.message });
          }
          return res.status(400).json({ error: error.message });
        }
        throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  }

  // Excluir um produto
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleteProductUseCase = new DeleteProductUseCase(productRepository);

      try {
        await deleteProductUseCase.execute(Number(id));
        return res.status(204).send();
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Produto não encontrado') {
            return res.status(404).json({ error: error.message });
          }
          return res.status(400).json({ error: error.message });
        }
        throw error;
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      return res.status(500).json({ error: 'Erro ao excluir produto' });
    }
  }
}
