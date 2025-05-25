import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
const { auth } = NextAuth(authConfig);
import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
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
