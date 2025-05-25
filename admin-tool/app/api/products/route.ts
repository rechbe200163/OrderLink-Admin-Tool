import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
const { auth } = NextAuth(authConfig);
import prisma from '@/prisma/client';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') || undefined;
  const page = Number(req.nextUrl.searchParams.get('page') || 1);
  const limit = Number(req.nextUrl.searchParams.get('limit') || 20);
  const category = req.nextUrl.searchParams.get('category') || undefined;

  const skip = (page - 1) * limit;

  if (isNaN(skip) || isNaN(limit) || page < 1 || limit < 1) {
    return NextResponse.json(
      { error: 'Invalid pagination values' },
      { status: 400 }
    );
  }

  const baseWhereClause: Prisma.ProductWhereInput = { deleted: false };

  if (query) {
    baseWhereClause.name = { contains: query, mode: 'insensitive' };
  }

  if (category) {
    baseWhereClause.categories = { some: { category: { name: category } } };
  }

  const products = await prisma.product.findMany({
    where: baseWhereClause,
    skip,
    take: limit,
  });

  const totalProducts = await prisma.product.count({
    where: baseWhereClause,
  });

  const totalPages = Math.ceil(totalProducts / limit);

  return NextResponse.json({
    products,
    totalProducts,
    totalPages,
  });
}
