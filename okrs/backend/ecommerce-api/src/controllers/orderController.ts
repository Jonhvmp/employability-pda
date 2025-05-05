import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaOrderRepository } from '../infrastructure/repositories/PrismaOrderRepository';
import { PrismaProductRepository } from '../infrastructure/repositories/PrismaProductRepository';
import { GetUserOrdersUseCase } from '../application/useCases/order/getUserOrdersUseCase';
import { GetOrderDetailsUseCase } from '../application/useCases/order/getOrderDetailsUseCase';
import { CreateOrderUseCase } from '../application/useCases/order/createOrderUseCase';
import { CancelOrderUseCase } from '../application/useCases/order/cancelOrderUseCase';

const prisma = new PrismaClient();
const orderRepository = new PrismaOrderRepository(prisma);
const productRepository = new PrismaProductRepository(prisma);

export class OrderController {
  // Listar todos os pedidos (admin)
  async findAll(req: Request, res: Response) {
    try {
      // Aqui implementaríamos checagem de papel de admin
      const isAdmin = true; // podemos fazer isso usando o middleware - porém passei aqui para simplificar o desenvolvimento.

      if (!isAdmin) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const orders = await orderRepository.findAll();

      return res.json(orders.map(order => order.toJSON()));
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  }

  // Listar pedidos do usuário logado
  async findMyOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const getUserOrdersUseCase = new GetUserOrdersUseCase(orderRepository);
      const orders = await getUserOrdersUseCase.execute(userId);

      return res.json(orders.map(order => order.toJSON()));
    } catch (error) {
      console.error('Erro ao buscar meus pedidos:', error);
      return res.status(500).json({ error: 'Erro ao buscar meus pedidos' });
    }
  }

  // Obter pedido por ID
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const isAdmin = false;

      const getOrderDetailsUseCase = new GetOrderDetailsUseCase(orderRepository);

      try {
        const order = await getOrderDetailsUseCase.execute(Number(id), userId, isAdmin);
        return res.json(order.toJSON());
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Pedido não encontrado') {
            return res.status(404).json({ error: error.message });
          }
          if (error.message === 'Você não tem permissão para ver este pedido') {
            return res.status(403).json({ error: error.message });
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      return res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  }

  // Criar um novo pedido
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { items } = req.body;

      // Validação básica
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          error: 'O pedido deve conter pelo menos um item'
        });
      }

      const createOrderUseCase = new CreateOrderUseCase(orderRepository, productRepository);

      try {
        const order = await createOrderUseCase.execute({
          userId,
          items: items.map(item => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity)
          }))
        });

        return res.status(201).json(order.toJSON());
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
        }
        throw error;
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  }

  // Cancelar um pedido
  async cancel(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const isAdmin = false;

      const cancelOrderUseCase = new CancelOrderUseCase(orderRepository, productRepository);

      try {
        await cancelOrderUseCase.execute(Number(id), userId, isAdmin);
        return res.json({ message: 'Pedido cancelado com sucesso' });
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'Pedido não encontrado') {
            return res.status(404).json({ error: error.message });
          }
          if (error.message.includes('permissão')) {
            return res.status(403).json({ error: error.message });
          }
          return res.status(400).json({ error: error.message });
        }
        throw error;
      }
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      return res.status(500).json({ error: 'Erro ao cancelar pedido' });
    }
  }
}
