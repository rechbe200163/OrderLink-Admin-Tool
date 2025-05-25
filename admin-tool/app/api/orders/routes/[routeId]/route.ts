import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
const { auth } = NextAuth(authConfig);
import prisma from '@/prisma/client';
import { Select } from '@radix-ui/react-select';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ routeId: string }> }
) {
  const params = await props.params;

  const ordersByRouteId = await prisma.order.findMany({
    where: {
      route: {
        some: {
          routeId: params.routeId,
        },
      },
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
      customer: {
        select: {
          customerReference: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  return NextResponse.json(ordersByRouteId);
}
