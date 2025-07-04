import { Order, OrderStatus, Restaurant } from '@/types';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCreateMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: restaurantFormData,
    });

    if (!response.ok) {
      if (response.status === 409) {
        // Try to parse JSON error message, fallback to default if not possible
        let data = {};
        try {
          data = await response.json();
        } catch (error) {
          console.error('Failed to parse JSON error message:', error);
        }
        throw new Error(
          (data as { message?: string }).message || 'Restaurant already exists'
        );
      }
      throw new Error('Failed to create restaurant');
    }

    return response.json();
  };

  const {
    mutateAsync: createRestaurant,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useMutation(createMyRestaurantRequest);

  if (isError) {
    if ((error as Error)?.message === 'Restaurant already exists') {
      toast.error('Restaurant already exists');
    } else {
      toast.error('Failed to create restaurant');
    }
  }

  if (isSuccess) {
    toast.success('Restaurant created');
  }
  return { createRestaurant, isLoading };
};

export const useGetMyRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyRestaurantRequest = async (): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get restaurant');
    }

    return response.json();
  };

  const {
    data: restaurant,
    isLoading,
    isError,
  } = useQuery('fetchMyRestaurant', getMyRestaurantRequest);

  if (isError) {
    toast.error('Failed to get restaurant');
  }

  return { restaurant, isLoading };
};

export const useGetMyRestaurantOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getMyRestaurantOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get orders');
    }

    return response.json();
  };

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery('fetchMyRestaurantOrders', getMyRestaurantOrdersRequest);

  if (isError) {
    toast.error('Failed to get orders');
  }

  return { orders, isLoading };
};

export type UpdateStatusOrderRequest = {
  orderId: string;
  status: OrderStatus;
};

export const useUpdateMyRestaurantOrder = () => {
  const { getAccessTokenSilently } = useAuth0();

  const updateMyRestaurantOrderRequest = async (
    updateStatusOrderRequest: UpdateStatusOrderRequest
  ): Promise<Order> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(
      `${API_BASE_URL}/api/my/restaurant/order/${updateStatusOrderRequest.orderId}/status`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: updateStatusOrderRequest.status }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update order');
    }

    return response.json();
  };

  const {
    mutateAsync: updateRestaurantStatus,
    isLoading,
    isError,
    isSuccess,
    reset,
  } = useMutation(updateMyRestaurantOrderRequest);

  if (isError) {
    toast.error('Failed to update order');
    reset();
  }

  if (isSuccess) {
    toast.success('Order updated');
  }

  return { updateRestaurantStatus, isLoading };
};
