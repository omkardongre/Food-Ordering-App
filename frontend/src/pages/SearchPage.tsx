import { useSearchRestaurants } from '@/api/RestaurantApi';
import { useParams } from 'react-router-dom';

const SearchPage = () => {
  const { city } = useParams();
  const { results } = useSearchRestaurants(city);
  console.log('result :', results);

  return (
    <span>
      Search Page {city}
      <span>
        {results?.data.map((restaurant) => (
          <span key={restaurant._id}>{restaurant.restaurantName}</span>
        ))}
      </span>
    </span>
  );
};

export default SearchPage;
