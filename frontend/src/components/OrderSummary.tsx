import { CartItem } from '@/pages/DetailPage';
import { Restaurant } from '@/types';
import { CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Trash } from 'lucide-react';

type Props = {
  restaurant: Restaurant;
  cartItems: CartItem[];
  removeFromCart: (cartItemId: string) => void;
};

const OrderSummary = ({ restaurant, cartItems, removeFromCart }: Props) => {
  function getTotalCost(): number {
    if (cartItems.length === 0) {
      return 0;
    }
    const totalCost = cartItems.reduce((totalCost, item) => {
      return totalCost + item.price * item.quantity;
    }, 0);

    const totalWithDelivery = restaurant.deliveryPrice + totalCost;
    return totalWithDelivery;
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
          <span>Your Order</span>
          <span>${getTotalCost()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {cartItems.map((item) => (
          <div className="flex justify-between">
            <span>
              <Badge variant="outline" className="mr-1">
                {item.quantity}
              </Badge>
              {item.name}
            </span>
            <span className="flex items-center gap-1">
              <Trash
                size={20}
                color="red"
                className="cursor-pointer"
                onClick={() => removeFromCart(item._id)}
              />
              ${item.price * item.quantity}
            </span>
          </div>
        ))}

        <Separator />
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>${cartItems.length > 0 ? restaurant.deliveryPrice : 0}</span>
        </div>
        <Separator />
      </CardContent>
    </>
  );
};

export default OrderSummary;
