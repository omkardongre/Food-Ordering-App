import { useGetRestaurant } from '@/api/RestaurantApi';
import CheckoutButton from '@/components/CheckoutButton';
import FoodItemMenu from '@/components/FoodItemMenu';
import OrderSummary from '@/components/OrderSummary';
import RestaurantInfo from '@/components/RestaurantInfo';
import { Card, CardFooter } from '@/components/ui/card';
import { MenuItem } from '@/types';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { restaurant, isLoading } = useGetRestaurant(restaurantId as string);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const cartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    if (cartItems) {
      return JSON.parse(cartItems);
    }
    return [];
  });

  const addToCart = (menuItem: MenuItem) => {
    setCartItems((prevCartItems) => {
      //if cart is not present add to cartItem
      // if cart is present update quantity

      const existingItem = prevCartItems.find(
        (item) => item._id === menuItem._id
      );

      let newCartItems = [];
      if (existingItem) {
        newCartItems = prevCartItems.map((item) => {
          if (item._id === menuItem._id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        });
      } else {
        newCartItems = [
          ...prevCartItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(newCartItems)
      );

      return newCartItems;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prevCartItems) => {
      const updatedCartItem = prevCartItems.filter(
        (item) => item._id !== cartItemId
      );

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItem)
      );

      return updatedCartItem;
    });
  };

  if (isLoading || !restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.imageFile}
          alt={restaurant.restaurantName}
          className="rounded-md object-cover w-full h-full"
        />
      </AspectRatio>
      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantInfo restaurant={restaurant} />
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurant.menuItems.map((menuItem) => (
            <FoodItemMenu
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}
        </div>
        <div>
          <Card>
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
            <CardFooter>
              <CheckoutButton />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
