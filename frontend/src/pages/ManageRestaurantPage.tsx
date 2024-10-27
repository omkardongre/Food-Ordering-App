import {
  useCreateMyRestaurant,
  useGetMyRestaurant,
  useGetMyRestaurantOrders,
} from '@/api/MyRestaurantApi';
import { Tabs, TabsTrigger, TabsList, TabsContent } from '@/components/ui/tabs';
import ManageRestaurantForm from '@/forms/manage-restaurant-form/ManageRestaurantForm';
import OrderItemCard from '@/components/OrderItemCard';

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading } = useCreateMyRestaurant();
  const { restaurant } = useGetMyRestaurant();
  const { orders } = useGetMyRestaurantOrders();

  return (
    <Tabs defaultValue="orders">
      <TabsList>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="manage-restaurant">Manage Restaurant</TabsTrigger>
      </TabsList>
      <TabsContent
        value="orders"
        className="space-y-4 bg-gray-100 p-10 rounded-lg"
      >
        <h2 className="text-2xl font-bold">{orders?.length} active orders</h2>
        {orders?.map((order) => <OrderItemCard order={order} />)}
      </TabsContent>
      <TabsContent value="manage-restaurant">
        <ManageRestaurantForm
          restaurant={restaurant}
          onSave={createRestaurant}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ManageRestaurantPage;
