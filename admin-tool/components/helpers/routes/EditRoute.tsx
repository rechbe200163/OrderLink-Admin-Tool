'use client';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { OrdersWithAddressOfCustomer, RoutesWithOrders } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import React, { useActionState, useId } from 'react';
import CustomeToast from '../toasts/CustomeErrorToast';
import OrderSelectComponent from '../OrderSelectComponent';
import { updateRoute } from '@/lib/actions/route.actions';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/kibo-ui/spinner';

interface CreateOrderProps {
  route: RoutesWithOrders;
  orders: OrdersWithAddressOfCustomer[];
}

const EditRoute = ({ orders, route }: CreateOrderProps) => {
  const [selectOrder, setSelectedOrders] = React.useState<string[]>(
    route.order.map((order) => order.orderId)
  );
  const [formState, action, isPending] = useActionState(
    updateRoute.bind(null, route.routeId, route),
    {
      success: false,
      errors: {
        title: [''],
      },
    }
  );

  const router = useRouter();

  React.useEffect(() => {
    if (formState.success) {
      toast.custom(() => (
        <CustomeToast variant='success' message='Route updated successfully!' />
      ));
      if (formState.data) {
        router.push(`/routes/${formState.data}/edit`);
      }
    } else if (formState.errors?.title[0]) {
      toast.custom(() => (
        <CustomeToast
          variant='error'
          message={`An error occurred: ${
            formState.errors?.title?.join(', ') ?? ''
          }`}
        />
      ));
    }
  }, [formState, router]);

  const id = useId();
  return (
    <Card className='shadow-md p-6 min-w-full'>
      <form action={action} className='space-y-6'>
        <h2 className='text-3xl font-bold tracking-tight mb-6'>Update Route</h2>
        <div className=''>
          <Label htmlFor={id}>Route Name</Label>
          <Input id={id} name='name' defaultValue={route.name} />
        </div>
        <div className='space-y-2'>
          <OrderSelectComponent
            orders={orders}
            onOrderSelect={setSelectedOrders}
            defaultValues={selectOrder}
          />
          <input
            id='orderIds'
            name='orderIds'
            type='hidden'
            value={selectOrder}
          />
        </div>
        <Button type='submit' disabled={isPending} className='mt-6'>
          {isPending ? (
            <>
              <Spinner />
              Updating Route
            </>
          ) : (
            <>
              <PlusCircle /> Update Route
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default EditRoute;
