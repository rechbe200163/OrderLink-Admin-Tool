import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';

export async function GET(props: { params: Promise<{ routeId: string }> }) {
  const params = await props.params;

  if (!params.routeId) {
    return NextResponse.json(
      { error: 'Route ID is required' },
      { status: 400 }
    );
  }

  const route = await prisma.route.findUnique({
    where: {
      routeId: params.routeId,
    },
    include: {
      order: true,
    },
  });

  if (!route) {
    return NextResponse.json({ error: 'Route not found' }, { status: 404 });
  }
  return NextResponse.json(route);
}
