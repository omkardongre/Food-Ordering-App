import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from 'react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

type CreateUserResponse = {
  success: boolean;
  message: string;
};

export const useCreateMyUser = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createMyUserRequest = async (
    user: CreateUserRequest
  ): Promise<CreateUserResponse> => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/api/my/user`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      return { success: true, message: 'User created successfully' };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message || 'An unknown error occurred',
        };
      } else {
        return {
          success: false,
          message: 'An unknown error occurred',
        };
      }
    }
  };

  const {
    mutateAsync: createMyUser,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(createMyUserRequest);

  return {
    createMyUser,
    isLoading,
    isError,
    isSuccess,
  };
};
