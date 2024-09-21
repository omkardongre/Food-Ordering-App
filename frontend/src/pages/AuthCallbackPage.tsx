import { useCreateMyUser } from '@/api/MyUserApi';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { createMyUser } = useCreateMyUser();
  const hasCreatedUser = useRef(false);

  useEffect(() => {
    if (user?.sub && user.email && !hasCreatedUser.current) {
      createMyUser({ auth0Id: user.sub, email: user.email })
        .then(() => {
          hasCreatedUser.current = true;
          navigate('/');
        })
        .catch((error) => {
          console.error('Failed to create user:', error);
        });
    } else if (hasCreatedUser.current) {
      navigate('/');
    } else {
      console.error('User information is incomplete');
    }
    navigate('/');
  }, [user, createMyUser, navigate]);

  return <>Loading...</>;
};

export default AuthCallbackPage;
