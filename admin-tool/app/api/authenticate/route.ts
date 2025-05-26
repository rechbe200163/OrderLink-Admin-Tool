// app/api/authenticate/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const email = 'test'; // Consider making these dynamic based on request body for a real app
  const password = 'test'; // Consider making these dynamic based on request body for a real app

  // Step 1: Authenticate with the external API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERNAL_API}/authenticate?email=${email}&password=${password}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    console.error(
      'Authentication failed with external API:',
      response.status,
      response.statusText
    );
    return NextResponse.json(
      { message: 'Authentication failed with external service' },
      { status: 401 }
    );
  }

  // The external API is expected to return the token string directly
  const token = await response.json();

  if (!token) {
    console.error('No token received from external API response.');
    return NextResponse.json(
      { message: 'No token received from external API' },
      { status: 500 }
    );
  }

  console.log('Received token from external API:', token);

  // Step 2: Set the token as an httpOnly cookie in the response
  const cookieStore = await cookies();
  cookieStore.set(
    'token',
    JSON.stringify({
      data: token,
      createdAt: new Date().toISOString(),
    }),
    {
      path: '/', // Cookie is available across the entire application
      httpOnly: true, // Prevents client-side JavaScript access for security
      expires: new Date(Date.now() + 30 * 60 * 1000), // Cookie expires in 30 minutes
      // For production, consider adding:
      // secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
      // sameSite: 'lax', // Or 'strict' for CSRF protection
    }
  );

  console.log('Token successfully set in cookie.');

  // Step 3: Return the token in the response body for immediate use by the caller
  return NextResponse.json({ token: token });
}
