import { SearchState } from '@/pages/SearchPage';
import { RestaurantResponse } from '@/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from 'react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearchRestaurants = (
  searchState: SearchState,
  city: string
) => {
  const { getAccessTokenSilently } = useAuth0();

  const createSearchRestaurant = async (): Promise<RestaurantResponse> => {
    const accessToken = await getAccessTokenSilently();
    const params = new URLSearchParams();
    params.set('searchQuery', searchState.searchQuery);
    params.set('page', searchState.page.toString());
    params.set(
      'selectedCuisines',
      searchState.selectedCuisines
        .map((cuisine) => encodeURIComponent(cuisine))
        .join(',')
    );
    params.set('sortOption', searchState.sortOption);

    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${encodeURIComponent(city)}?${params.toString()}`,
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
    ['searchRestaurants', searchState],
    createSearchRestaurant,
    { enabled: !!city }
  );

  return { results, isLoading };
};
