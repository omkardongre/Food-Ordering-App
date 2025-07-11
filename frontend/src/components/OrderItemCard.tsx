import { Order, OrderStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ORDER_STATUS } from '@/config/order-status-config';
import { useUpdateMyRestaurantOrder } from '@/api/MyRestaurantApi';

const OrderItemCard = ({ order }: { order: Order }) => {
  const { updateRestaurantStatus } = useUpdateMyRestaurantOrder();

  const handleUpdateStatus = (status: OrderStatus) => {
    updateRestaurantStatus({ orderId: order._id, status });
  };

  const getTime = () => {
    const orderDateTime = new Date(order.createdAt);
    const hours = orderDateTime.getHours();
    const minutes = orderDateTime.getMinutes();
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${paddedMinutes}`;
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="grid md:grid-cols-4 justify-between mb-3">
          <div>
            Customer Name:
            <span className="ml-2 font-normal">
              {order.deliveryDetails.name}
            </span>
          </div>
          <div>
            Delivery address:
            <span className="ml-2 font-normal">
              {order.deliveryDetails.addressLine1} {order.deliveryDetails.city}
            </span>
          </div>
          <div>
            Time:
            <span className="ml-2 font-normal">{getTime()}</span>
          </div>
          <div>
            Total Cost:
            <span className="ml-2 font-normal">
              {`$${(order.totalAmount / 100).toFixed(2)}`}
            </span>
          </div>
        </CardTitle>
        <Separator />
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {order.cartItems.map((cartItem) => (
            <span key={cartItem.menuItemId}>
              <Badge className="variant-outline mr-2">
                {cartItem.quantity}
              </Badge>
              {cartItem.name}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2 space-y-1.5">
          <Label>What is status of this order?</Label>
          <Select
            onValueChange={(value) => handleUpdateStatus(value as OrderStatus)}
            defaultValue={order.status}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent position="popper">
              {ORDER_STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemCard;
