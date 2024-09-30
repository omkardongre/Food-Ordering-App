import { Request, Response } from 'express';
import Restaurant from '../models/restaurant';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant) {
      return res.status(409).json({ message: 'Restaurant already exists' });
    }

    const image = req.file as Express.Multer.File;
    const base64Image = image.buffer.toString('base64');
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.uploader.upload(dataURI);

    const restaurant = new Restaurant(req.body);
    restaurant.imageFile = uploadResponse.secure_url;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);

    await restaurant.save();
    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating restaurant' });
  }
};

export default {
  createMyRestaurant,
};
