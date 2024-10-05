import express from 'express';
import { param } from 'express-validator';
import RestaurantController from '../controllers/RestaurantController';
import { jwtCheck, jwtParse } from '../middleware/auth';

const router = express.Router();

router.get(
  '/search/:city',
  param('city').isString().trim().notEmpty().withMessage('City is required'),
  jwtCheck,
  jwtParse,
  RestaurantController.searchRestaurants,
);

export default router;
