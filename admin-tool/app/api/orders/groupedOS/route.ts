import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const ordersByState = await prisma.order.groupBy({
      by: ['orderState'],
      _count: true,
    });

    return NextResponse.json(ordersByState);
  } catch (error) {
    console.error('Error grouping orders by state:', error);
    return NextResponse.json(
      { error: 'Failed to group orders by state.' },
      { status: 500 }
    );
  }
}
