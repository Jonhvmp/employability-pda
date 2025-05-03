import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const userController = new UserController();

// Rotas públicas
router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  userController.register(req, res).catch(next);
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  userController.login(req, res).catch(next);
});

router.use(authMiddleware as any);

// Obter perfil do usuário autenticado
router.get('/profile', (req: Request, res: Response, next: NextFunction) => {
  userController.getProfile(req, res).catch(next);
});

// Rotas de administração (também protegidas)
// aqui teríamos um middleware adicional para verificar permissões de admin
router.get('/', (req: Request, res: Response) => {
  userController.findAll(req, res);
});

router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  userController.findById(req, res).catch(next);
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  userController.update(req, res).catch(next);
});

router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  userController.delete(req, res).catch(next);
});

export default router;
