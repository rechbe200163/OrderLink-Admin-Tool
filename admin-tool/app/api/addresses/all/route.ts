import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const addresses = await prisma.address.findMany();

    return NextResponse.json(addresses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' + error },
      { status: 500 }
    );
  }
}
