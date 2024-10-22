import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import logger from '../utils/logger';

const createCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      logger.warn(`User creation failed: User with auth0Id ${auth0Id} already exists`);
      return res.status(400).send('User already exists');
    }

    const newUser = new User(req.body);
    await newUser.save();
    logger.info(`New user created with auth0Id ${auth0Id}`);
    res.status(201).send(newUser.toObject());
  } catch (error) {
    next(error);
  }
};

const updateCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      logger.warn(`Update failed: User not found with ID ${req.userId}`);
      return res.status(404).send('User not found');
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;

    await user.save();
    logger.info(`User updated with ID ${req.userId}`);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = await User.findById({ _id: req.userId });

    if (!currentUser) {
      logger.warn(`User fetch failed: User not found with ID ${req.userId}`);
      return res.status(404).send('User not found');
    }

    logger.info(`Fetched current user with ID ${req.userId}`);
    res.json(currentUser);
  } catch (error) {
    next(error);
  }
};

export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
};
