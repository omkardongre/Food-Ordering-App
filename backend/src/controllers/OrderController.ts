import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import Restaurant, { MenuItemType } from '../models/restaurant';
import Order from '../models/order';
import logger from '../utils/logger';
import { AppError } from '../utils/errors';

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: number;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body as CheckoutSessionRequest;
    const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);

    if (!restaurant) {
      throw new AppError('Restaurant not found', 404);
    }

    const newOrder = new Order({
      restaurant: restaurant._id,
      user: req.userId,
      status: 'placed',
      cartItems: checkoutSessionRequest.cartItems,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      createdAt: new Date(),
    });

    const lineItems = await createLineItems(checkoutSessionRequest, restaurant.menuItems);
    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString(),
    );

    if (!session.url) {
      throw new AppError('Error creating checkout session', 500);
    }

    await newOrder.save();
    logger.info(`Checkout session created for order ${newOrder._id}`);
    return res.status(200).json({ url: session.url });
  } catch (error) {
    logger.error(
      `Error creating checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { stack: error instanceof Error ? error.stack : undefined },
    );
    next(error);
  }
};

function createLineItems(
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[],
) {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuItemId);
    if (!menuItem) {
      throw new AppError('Menu item not found', 404);
    }

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: 'usd',
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: cartItem.quantity,
    };

    return lineItem;
  });

  return lineItems;
}

async function createSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string,
) {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'Delivery',
          type: 'fixed_amount',
          fixed_amount: {
            amount: deliveryPrice,
            currency: 'usd',
          },
        },
      },
    ],
    metadata: {
      orderId: orderId,
      restaurantId: restaurantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
  });

  return sessionData;
}

const stripeWebhookHandler = async (req: Request, res: Response, next: NextFunction) => {
  let event;
  try {
    const sig = req.headers['stripe-signature'] as string;
    event = STRIPE.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const order = await Order.findById(event.data.object.metadata?.orderId);
      if (!order) {
        throw new AppError('Order not found', 404);
      }
      order.totalAmount = event.data.object.amount_total;
      order.status = 'paid';
      await order.save();
      logger.info(`Order ${order._id} marked as paid`);
    }

    return res.status(200).send('Webhook received');
  } catch (error) {
    logger.error(
      `Stripe webhook error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { stack: error instanceof Error ? error.stack : undefined },
    );
    next(error);
  }
};

const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate('restaurant').populate('user');
    return res.status(200).json(orders);
  } catch (error) {
    logger.error(
      `Error fetching my orders: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { stack: error instanceof Error ? error.stack : undefined },
    );
    next(error);
  }
};

export default {
  createCheckoutSession,
  stripeWebhookHandler,
  getMyOrders,
};
