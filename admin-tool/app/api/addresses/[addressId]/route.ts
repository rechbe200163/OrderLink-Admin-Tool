import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ addressId: string }> }
) {
  const params = await props.params;

  const address = await prisma.address.findUnique({
    where: {
      addressId: params.addressId,
    },
  });
  return NextResponse.json(address);
}
