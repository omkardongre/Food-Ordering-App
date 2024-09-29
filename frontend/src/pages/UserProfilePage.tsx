import { useGetMyUser, useUpdateMyUser } from '@/api/MyUserApi';
import UserProfileForm from '@/forms/user-profile-form/UserProfileForm';

const UserProfilePage = () => {
  const { updateMyUser, isLoading: isUpdateLoading } = useUpdateMyUser();
  const { currentUser, isLoading: isGetLoading } = useGetMyUser();

  if (isGetLoading) {
    return <span>Loading...</span>;
  }

  if (!currentUser) {
    return <span>Unable to load user profile</span>;
  }

  return (
    <UserProfileForm
      isLoading={isUpdateLoading}
      onSave={updateMyUser}
      currentUser={currentUser}
    />
  );
};

export default UserProfilePage;
