import { Router, Request, Response, NextFunction } from 'express';
import { ProductController } from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const productController = new ProductController();

// Rotas públicas
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  productController.findAll(req, res).catch(next);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  productController.findById(req, res).catch(next);
});

// Rotas protegidas (apenas admin)
router.use(authMiddleware as any); // fiz apenas para demostração de funcionalidade, necessário middleware 'isAdmin'

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  productController.create(req, res).catch(next);
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  productController.update(req, res).catch(next);
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  productController.delete(req, res).catch(next);
});

export default router;
