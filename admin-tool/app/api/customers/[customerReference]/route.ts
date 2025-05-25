import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
const { auth } = NextAuth(authConfig);
import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ customerReference: number }> }
) {
  const params = await props.params;

  const customer = await prisma.customer.findUnique({
    where: {
      customerReference: Number(params.customerReference),
      deleted: false,
    },
    include: {
      address: {
        select: {
          addressId: true,
        },
      },
    },
  });
  return NextResponse.json(customer);
}
