import { Button } from '@/components/ui/button';
import { FormDescription, FormField, FormItem } from '@/components/ui/form';
import { useFieldArray, useFormContext } from 'react-hook-form';
import MenuItemInput from './MenuItemInput';

const MenuSection = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'menu',
  });

  return (
    <div className="space-y-2">
      <div>
        <h2 className="text-2xl font-bold">Menu</h2>
        <FormDescription>
          Create your menu and give each time a name and price
        </FormDescription>
      </div>

      <FormField
        control={control}
        name="menuItems"
        render={() => (
          <FormItem className="flex flex-col gap-2">
            {fields.map((item, index) => (
              <MenuItemInput
                key={item.id}
                index={index}
                removeMenuItems={() => remove(index)}
              />
            ))}
          </FormItem>
        )}
      ></FormField>

      <Button type="button" onClick={() => append({ name: '', price: '' })}>
        Add Menu Item
      </Button>
    </div>
  );
};

export default MenuSection;
