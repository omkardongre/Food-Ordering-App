import { useUpdateMyUser } from '@/api/MyUserApi';
import UserProfileForm from '@/forms/user-profile-form/UserProfileForm';

const UserProfilePage = () => {
  const { updateMyUser, isLoading } = useUpdateMyUser();

  return <UserProfileForm isLoading={isLoading} onSave={updateMyUser} />;
};

export default UserProfilePage;
