import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const ordersByState = await prisma.order.groupBy({
      by: ['orderState'],
      _count: true,
    });

    return NextResponse.json(ordersByState);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to group orders by state.' },
      { status: 500 }
    );
  }
}
