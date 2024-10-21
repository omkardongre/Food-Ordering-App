import { Request, Response } from 'express';
import Stripe from 'stripe';
import Restaurant, { MenuItemType } from '../models/restaurant';
import Order from '../models/order';

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;

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

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body as CheckoutSessionRequest;
    const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId);
    if (!restaurant) {
      return res.status(404).send('Restaurant not found');
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
      return res.status(500).send('Error creating checkout session');
    }

    await newOrder.save();
    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error creating checkout session');
  }
};

function createLineItems(
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[],
) {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuItemId);
    if (!menuItem) {
      throw new Error('Menu item not found');
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

export default {
  createCheckoutSession,
};
