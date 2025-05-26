import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const order = await prisma.order.findMany({
    where: {
      deleted: false,
    },
    include: {
      customer: {
        include: {
          address: true,
        },
      },
    },
  });
  return NextResponse.json(order);
}
