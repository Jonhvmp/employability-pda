import { Router, Request, Response, NextFunction } from 'express';
import { OrderController } from '../controllers/orderController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const orderController = new OrderController();

router.use(authMiddleware as any);

// Listar pedidos do usuário atual
router.get('/my-orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.findMyOrders(req, res);
  } catch (error) {
    next(error);
  }
});

// Listar todos os pedidos (rota administrativa)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.findAll(req, res);
  } catch (error) {
    next(error);
  }
});

// Obter pedido por ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.findById(req, res);
  } catch (error) {
    next(error);
  }
});

// Criar um novo pedido
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.create(req, res);
  } catch (error) {
    next(error);
  }
});

// Cancelar um pedido
router.put('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.cancel(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
