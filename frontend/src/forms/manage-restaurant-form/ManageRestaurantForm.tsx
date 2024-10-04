import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DetailSection from './DetailsSection';
import { Separator } from '@radix-ui/react-separator';
import CuisinesSection from './CuisinesSection';
import MenuSection from './MenuSection';
import ImageSection from './ImageSection';
import LoadingPageButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/types';
import { useEffect } from 'react';

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

  estimatedDeliveryTime: z.coerce.number({
    required_error: 'Estimated delivery time is required',
    invalid_type_error: 'Estimated delivery time must be a number',
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

type RestaurantFormData = z.infer<typeof formSchema>;

type Props = {
  restaurant?: Restaurant;
  onSave: (restaurantFormData: FormData) => Promise<Restaurant>;
  isLoading: boolean;
};

const ManageRestaurantForm = ({ restaurant, onSave, isLoading }: Props) => {
  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisines: [],
      menuItems: [{ name: '', price: 1 }],
    },
  });

  useEffect(() => {
    if (!restaurant) {
      return;
    }

    form.reset({
      restaurantName: restaurant.restaurantName,
      city: restaurant.city,
      country: restaurant.country,
      deliveryPrice: restaurant.deliveryPrice,
      estimatedDeliveryTime: restaurant.estimatedDeliveryTime,
      cuisines: restaurant.cuisines,
      menuItems: restaurant.menuItems,
    });
  }, [restaurant, form]);

  const onSubmit = (formDataJson: RestaurantFormData) => {
    const formData = new FormData();

    formData.append('restaurantName', formDataJson.restaurantName);
    formData.append('city', formDataJson.city);
    formData.append('country', formDataJson.country);
    formData.append('deliveryPrice', formDataJson.deliveryPrice.toString());
    formData.append(
      'estimatedDeliveryTime',
      formDataJson.estimatedDeliveryTime.toString()
    );
    formDataJson.cuisines.forEach((cuisine, index) => {
      formData.append(`cuisines[${index}]`, cuisine);
    });
    formDataJson.menuItems.forEach((menuItem, index) => {
      formData.append(`menuItems[${index}][name]`, menuItem.name);
      formData.append(`menuItems[${index}][price]`, menuItem.price.toString());
    });
    formData.append('imageFile', formDataJson.imageFile);

    onSave(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-gray-50 p-10 rounded-lg"
      >
        <DetailSection />
        <Separator />
        <CuisinesSection />
        <Separator />
        <MenuSection />
        <Separator />
        <ImageSection />
        {isLoading ? (
          <LoadingPageButton />
        ) : (
          <Button type="submit">Save</Button>
        )}
      </form>
    </Form>
  );
};

export default ManageRestaurantForm;
