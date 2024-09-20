import { useCreateMyUser } from '@/api/MyUserApi';
import { AppState, Auth0Provider, User } from '@auth0/auth0-react';

type Props = {
  children: React.ReactNode;
};

const Auth0ProviderNavigate = ({ children }: Props) => {
  const { createMyUser } = useCreateMyUser();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI;

  if (!domain || !clientId || !redirectUri) {
    throw new Error('Missing Auth0 environment variables');
  }
  const onRedirectCallback = (appState?: AppState, user?: User) => {
    if (user?.sub && user.email) {
      createMyUser({ auth0Id: user.sub, email: user.email });
    }
  };
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderNavigate;
