import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const order = await prisma.order.findMany();
  return NextResponse.json(order);
}
