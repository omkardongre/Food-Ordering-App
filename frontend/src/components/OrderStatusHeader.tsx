import { ORDER_STATUS, OrderStatusInfo } from '@/config/order-status-config';
import { Order } from '@/types';
import { Progress } from './ui/progress';

type Props = {
  order: Order;
};

const OrderStatusHeader = ({ order }: Props) => {
  const getExpectedDelivery = () => {
    const created = new Date(order.createdAt);
    created.setMinutes(
      created.getMinutes() + order.restaurant.estimatedDeliveryTime
    );

    const hours = created.getHours();
    const minutes = created.getMinutes();

    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${paddedMinutes}`;
  };

  const getOrderStatusInfo = (): OrderStatusInfo => {
    return (
      ORDER_STATUS.find((status) => status.value === order.status) ||
      ORDER_STATUS[0]
    );
  };

  return (
    <>
      <h1 className="text-4xl font-bold tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between">
        <span>Order Status: {getOrderStatusInfo().label}</span>
        <span>Expected by: {getExpectedDelivery()}</span>
        <span>Total: ${ (order.totalAmount / 100).toFixed(2) }</span>
      </h1>

      <Progress value={getOrderStatusInfo().progressValue} />
    </>
  );
};

export default OrderStatusHeader;
