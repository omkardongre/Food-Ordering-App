import { Order } from '@/types';
import { Separator } from '@radix-ui/react-separator';

type Props = {
  order: Order;
};

const OrderStatusDetails = ({ order }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <span className="font-bold">Delivery to:</span>
        <span>{order.deliveryDetails.name}</span>
        <span>
          {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
        <ul>
          {order.cartItems.map((item) => (
            <li key={item.menuItemId}>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="font-bold">Total</span>
        <span>${(order.totalPrice / 100).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderStatusDetails;
