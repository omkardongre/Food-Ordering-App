import { Request, Response, NextFunction } from 'express';
import Restaurant from '../models/restaurant';
import logger from '../utils/logger';

//http://localhost:3000/restaurants/search?searchQuery=pizza&selectedCuisines=Italian,Mexican&sortOption=restaurantName&page=2
const searchRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city = req.params.city;
    const searchQuery = (req.query.searchQuery as string) || '';
    const selectedCuisines = (req.query.selectedCuisines as string) || '';
    const sortOption = (req.query.sortOption as string) || 'lastUpdated';
    const page = parseInt(req.query.page as string) || 1;

    // eslint-disable-next-line
    const query: any = {};
    query['city'] = new RegExp(city, 'i');

    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      logger.info(`No restaurants found for city: ${city}`);
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines.split(',').map((cuisine) => new RegExp(cuisine, 'i'));
      query['cuisines'] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      query['$or'] = [{ restaurantName: searchRegex }, { cuisines: { $in: [searchRegex] } }];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    logger.info(`Found ${total} restaurants for city: ${city}, page: ${page}`);
    res.json(response);
  } catch (error) {
    logger.error(
      `Error searching restaurants: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { stack: error instanceof Error ? error.stack : undefined },
    );
    next(error);
  }
};

const getRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findById(restaurantId).lean();

    if (!restaurant) {
      logger.info(`Restaurant not found: ${restaurantId}`);
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    logger.info(`Fetched restaurant: ${restaurantId}`);
    res.json(restaurant);
  } catch (error) {
    logger.error(
      `Error fetching restaurant: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { stack: error instanceof Error ? error.stack : undefined },
    );
    next(error);
  }
};

export default {
  searchRestaurants,
  getRestaurant,
};
