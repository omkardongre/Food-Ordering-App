import { Request, Response, NextFunction } from 'express';
import Restaurant from '../models/restaurant';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/errors'; // Import custom errors if needed

const createMyRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      throw new AppError('Restaurant already exists', 409);
    }

    const image = req.file as Express.Multer.File;
    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide an image for your restaurant.' });
    }

    const base64Image = image.buffer.toString('base64');
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.uploader.upload(dataURI);

    const restaurant = new Restaurant(req.body);
    restaurant.imageFile = uploadResponse.secure_url;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);

    await restaurant.save();
    res.status(201).send(restaurant);
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
};

const getMyRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      throw new AppError(`Restaurant not found for user ID: ${req.userId}`, 404);
    }
    res.status(200).json(restaurant);
  } catch (error) {
    next(error); // Pass error to the centralized handler
  }
};

export default {
  createMyRestaurant,
  getMyRestaurant,
};
