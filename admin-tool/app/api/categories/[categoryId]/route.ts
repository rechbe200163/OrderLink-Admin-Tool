import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ categoryId: string }> }
) {
  const params = await props.params;

  const category = await prisma.category.findUnique({
    where: { categoryId: params.categoryId, deleted: false },
  });
  return NextResponse.json(category);
}
