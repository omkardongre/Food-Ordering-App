import express from 'express';
import multer from 'multer';
import MyRestaurantController from '../controllers/MyRestaurantController';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateMyRestaurantRequest } from '../middleware/validation';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  '/',
  jwtCheck,
  jwtParse,
  upload.single('imageFile'),
  validateMyRestaurantRequest,
  MyRestaurantController.createMyRestaurant,
);

export default router;
