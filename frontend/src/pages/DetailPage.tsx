import { useGetRestaurant } from '@/api/RestaurantApi';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { useParams } from 'react-router-dom';

const DetailPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { restaurant, isLoading } = useGetRestaurant(restaurantId as string);

  if (isLoading || !restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.imageFile}
          alt={restaurant.restaurantName}
          className="rounded-md object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  );
};

export default DetailPage;
