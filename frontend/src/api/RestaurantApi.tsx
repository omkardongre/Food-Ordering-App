import { RestaurantResponse } from '@/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from 'react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearchRestaurants = (city?: string) => {
  const { getAccessTokenSilently } = useAuth0();

  const createSearchRestaurant = async (): Promise<RestaurantResponse> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${city}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search restaurants');
    }

    return response.json();
  };

  const { data: results, isLoading } = useQuery(
    ['searchRestaurants'],
    createSearchRestaurant,
    { enabled: !!city }
  );

  return { results, isLoading };
};
