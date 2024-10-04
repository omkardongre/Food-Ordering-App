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

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const restaurant = new Restaurant(req.body);
    restaurant.imageFile = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);

    await restaurant.save();
    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating restaurant' });
  }
};

const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting restaurant' });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = image.buffer.toString('base64');
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.uploader.upload(dataURI);
  return uploadResponse.secure_url;
};

export default {
  createMyRestaurant,
  getMyRestaurant,
};
