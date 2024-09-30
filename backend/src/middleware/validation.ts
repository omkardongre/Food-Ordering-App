import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateMyRequest = [
  body('name').isString().notEmpty().withMessage('Name must be a string'),
  body('addressLine1').isString().notEmpty().withMessage('Address Line 1 must be a string'),
  body('city').isString().notEmpty().withMessage('City must be a string'),
  body('country').isString().notEmpty().withMessage('Country must be a string'),
  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  body('restaurantName').isString().notEmpty().withMessage('Restaurant name is required'),
  body('city').isString().notEmpty().withMessage('City is required'),
  body('country').isString().notEmpty().withMessage('Country is required'),
  body('deliveryPrice')
    .isFloat({ min: 0 })
    .notEmpty()
    .withMessage('Delivery price must be a positive number'),
  body('estimatedDeliveryTime')
    .isInt({ min: 0 })
    .notEmpty()
    .withMessage('Estimated delivery time must be a positive number'),
  body('cuisines')
    .isArray()
    .withMessage('Cuisines must be an array')
    .notEmpty()
    .withMessage('Cuisines is required'),
  body('menuItems').isArray().withMessage('Menu items must be an array'),
  body('menuItems.*.name').isString().notEmpty().withMessage('Menu item name is required'),
  body('menuItems.*.price')
    .isFloat({ min: 0 })
    .notEmpty()
    .withMessage('Menu item price must be a positive number'),
];
