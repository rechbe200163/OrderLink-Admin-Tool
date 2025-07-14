import { getCookie } from '@/lib/cookies/cookie-managment';
import { getSession } from '@/lib/utlis/getSession';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_EXTERNAL_API = process.env.NEXT_PUBLIC_EXTERNAL_API;

export async function fetchWithQueryParams<T>(
  url: string,
  queryParams: Record<string, string | number | boolean>
): Promise<T> {
  try {
    if (!NEXT_PUBLIC_EXTERNAL_API) {
      throw new Error('NEXT_PUBLIC_EXTERNAL_API is not defined');
    }
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null && value !== false) {
        params.append(key, String(value));
      }
    }

    let accessToken: string | null = null;

    accessToken = await getCookie('token');
    if (!accessToken) {
      const session = await getSession();
      const employee = session?.user;

      if (!employee) {
        throw new Error('Admin employee not found');
      }

      accessToken = await authenticateExternalAPI();
      // employee.email,
      // employee.password
      await setCookie('token', accessToken);
    }

    params.append('token', `${accessToken}`);

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// export async function getCustomerGrowth(
//   last_days: number = 7,
//   month: boolean = true,
//   year: boolean = false
// ): Promise<CustomerGrowthItem[]> {
//   const rawData = await fetchWithQueryParams<any>(
//     `${NEXT_PUBLIC_EXTERNAL_API}descriptive/customers-signup/`,
//     {
//       last_days,
//       month,
//       year,
//     }
//   );

//   const formattedData: CustomerGrowthItem[] = Object.keys(
//     rawData.cumulative_growth
//   )
//     .map((date) => ({
//       date,
//       growth: rawData.growth[date],
//       cumulative_growth: rawData.cumulative_growth[date],
//     }))
//     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//   return formattedData;
// }

export async function authenticateExternalAPI(
  email: string = 'test',
  password: string = 'test'
): Promise<string> {
  const response = await fetch(
    `${NEXT_PUBLIC_EXTERNAL_API}/authenticate/?email=${email}&password=${password}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.statusText}`);
  }

  setCookie('token', response.headers.get('token') || '');

  const data = await response.json();
  return data;
}

export async function setCookie(name: string, data: string) {
  // 30 Minutes validity
  const cookieStore = await cookies();
  const value = {
    data,
    createdAt: new Date().toISOString(),
  };
  cookieStore.set(name, JSON.stringify(value), {
    expires: new Date(Date.now() + 30 * 60), // 30 minutes
    httpOnly: true,
    secure: true,
  });
}
