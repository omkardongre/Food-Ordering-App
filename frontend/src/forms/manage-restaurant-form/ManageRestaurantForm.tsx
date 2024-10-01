import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DetailSection from './DetailsSection';

const formSchema = z.object({
  restaurantName: z.string({
    required_error: 'Restaurant name is required',
  }),
  city: z.string({
    required_error: 'City is required',
  }),
  country: z.string({
    required_error: 'Country is required',
  }),
  deliveryPrice: z.coerce.number({
    required_error: 'Delivery price is required',
    invalid_type_error: 'Delivery price must be a number',
  }),
  cuisines: z.array(z.string()).nonempty({
    message: 'Cuisines are required',
  }),

  menuItems: z.array(
    z.object({
      name: z.string().min(1, {
        message: 'Name is required',
      }),
      price: z.coerce.number().min(1, {
        message: 'Price is required',
      }),
    })
  ),

  imageFile: z.instanceof(File, { message: 'Image is required' }),
});

type restaurantFormData = z.infer<typeof formSchema>;

type Props = {
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
};

const onSubmit = (formDataJson: restaurantFormData) => {};

const ManageRestaurantForm = ({ onSave, isLoading }: Props) => {
  const form = useForm<restaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: '', price: 1 }],
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailSection />
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
