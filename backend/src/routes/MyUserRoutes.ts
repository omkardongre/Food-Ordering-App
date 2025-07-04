import express from 'express';
import MyUserController from '../controllers/MyUserController';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateMyRequest } from '../middleware/validation';

const router = express.Router();

router.post('/', jwtCheck, MyUserController.createCurrentUser);
router.patch('/', jwtCheck, jwtParse, validateMyRequest, MyUserController.updateCurrentUser);
router.get('/', jwtCheck, jwtParse, MyUserController.getCurrentUser);

export default router;
