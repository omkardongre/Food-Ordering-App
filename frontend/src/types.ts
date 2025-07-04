export type User = {
  _id: string;
  name: string;
  email: string;
  addressLine1: string;
  city: string;
  country: string;
};

export type MenuItem = {
  _id: string;
  name: string;
  price: number;
};

export type Restaurant = {
  _id: string;
  restaurantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: MenuItem[];
  imageFile: string;
  lastUpdated: string;
};

export type RestaurantResponse = {
  data: Restaurant[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type OrderStatus =
  | 'placed'
  | 'paid'
  | 'inProgress'
  | 'outForDelivery'
  | 'delivered';

export type Order = {
  _id: string;
  restaurant: Restaurant;
  user: User;
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: number;
  }[];
  deliveryDetails: {
    addressLine1: string;
    city: string;
    name: string;
    email: string;
  };
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  restaurantId: string;
};
