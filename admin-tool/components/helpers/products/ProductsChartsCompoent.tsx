import { ProductsBarChart } from '@/components/cards/charts/ProductAmountChartComponent';
import { productsAmountService } from '@/lib/api/external/concrete/ProductsAmount';
import { getCookie } from '@/lib/cookies/cookie-managment';

import React from 'react';
import { ProductsMostlyBought } from '@/components/cards/charts/ProductsMostlyBought';

export const ProductChartsComponent = async (props: {
  searchParams?: Promise<{
    limit?: string;
    well_stocked?: boolean;
    out_of_stock?: boolean;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;
  const well_stocked = searchParams?.well_stocked ?? false;
  const out_of_stock = searchParams?.out_of_stock ?? false;

  let token = await getCookie('token'); // Attempt to read the cookie from the current request

  if (!token) {
    console.log(
      'Token not found in cookie. Initiating authentication via API route...'
    );
    // If no token is found, call the internal API route to authenticate and set the cookie.
    // The `cache: 'no-store'` ensures a fresh request.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(
        'Failed to authenticate via internal API route:',
        res.status,
        res.statusText
      );
      // It's crucial to handle authentication failures gracefully here.
      // You might want to redirect to a login page or display an error message.
      throw new Error('Failed to authenticate and retrieve token.');
    }

    // Expect the API route to return an object like { token: "your_token_string" }
    const authData = await res.json();
    token = authData.token; // Extract the token from the response body

    if (!token) {
      console.error(
        'Authentication API route response did not contain a token.'
      );
      throw new Error('Authentication API route returned no token.');
    }

    console.log(
      'Token successfully received from authentication API route:',
      token
    );
    // At this point, the cookie has been sent to the browser by the /authenticate route's response.
    // For *this specific render*, we use the token obtained directly from the API response.
    // For *subsequent requests* from the browser, the getCookie function should now find the cookie.
  } else {
    console.log('Token found in cookie:', token);
  }

  // Final check to ensure a token is available before proceeding to fetch chart data.
  if (!token) {
    console.error('Authentication token is missing after all attempts.');
    // This should ideally not be reached if the above error handling is robust.
    throw new Error('Authentication token is missing.');
  }

  const products = await productsAmountService.getProductsGrowth(
    token!,
    limit,
    well_stocked,
    out_of_stock
  );

  const productsMostlyBought =
    await productsAmountService.getProductsMostlyBought(
      token!,
      limit,
      false,
      false
    );

  return (
    <>
      <ProductsBarChart products={products} />
      {/* <ProductsMostlyBought products={productsMostlyBought} /> */}
    </>
  );
};
