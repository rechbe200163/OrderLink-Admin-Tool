import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
const { auth } = NextAuth(authConfig);
import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ productId: string }> }
) {
  const params = await props.params;

  const product = await prisma.product.findUnique({
    where: {
      deleted: false,
      productId: params.productId,
    },
    include: {
      categories: {
        select: {
          category: {
            select: {
              categoryId: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return NextResponse.json(product);
}
