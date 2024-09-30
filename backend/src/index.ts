import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import myUserRoute from './routes/MyUserRoutes';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/my/user', myUserRoute);

app.get('/health', (req, res) => {
  res.send({ message: 'health OK!' });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(7000, () => {
  console.log('Server is running on port 7000');
});
