import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
const { auth } = NextAuth(authConfig);
import prisma from '@/prisma/client';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all') || Boolean(false);
  const query = req.nextUrl.searchParams.get('query') || undefined;
  const page = Number(req.nextUrl.searchParams.get('page') || 1);
  const limit = Number(req.nextUrl.searchParams.get('limit') || 20);
  const filter = req.nextUrl.searchParams.get('filter') || undefined;

  if (all) {
    const categories = await prisma.category.findMany({
      where: { deleted: false },
    });

    return NextResponse.json(categories);
  }

  const skip = (page - 1) * limit;
  const baseWhereClause: Prisma.CategoryWhereInput = { deleted: false };

  if (isNaN(skip) || isNaN(limit) || page < 1 || limit < 1) {
    return NextResponse.json(
      { error: 'Invalid pagination values' },
      { status: 400 }
    );
  }

  if (query) {
    baseWhereClause.name = { contains: query, mode: 'insensitive' };
  }

  if (filter) {
    baseWhereClause.deleted = filter === 'active' ? false : true;
  }

  const categories = await prisma.category.findMany({
    where: baseWhereClause,
    skip,
    take: limit,
  });

  const totalCategories = await prisma.category.count({
    where: baseWhereClause,
  });

  const totalPages = Math.ceil(totalCategories / limit);

  return NextResponse.json({
    categories,
    totalCategories,
    totalPages,
  });
}
