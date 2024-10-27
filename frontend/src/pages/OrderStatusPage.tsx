import { useGetMyOrders } from '@/api/OrderApi';
import OrderStatusDetails from '@/components/OrderStatusDetails';
import OrderStatusHeader from '@/components/OrderStatusHeader';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const OrderStatusPage = () => {
  const { orders, isLoading } = useGetMyOrders();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orders || orders.length === 0) {
    return <div>No orders found</div>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="space-y-10 bg-gray-100 p-4 rounded-lg">
          <OrderStatusHeader order={order} />
          <div className="grid md:grid-cols-2 gap-4">
            <OrderStatusDetails order={order} />
            <AspectRatio ratio={16 / 9}>
              <img
                src={order.restaurant.imageFile}
                alt={order.restaurant.restaurantName}
                className="object-cover rounded-md h-full w-full"
              />
            </AspectRatio>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusPage;
