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

  const skip = (page - 1) * limit;

  const baseWhereClause: Prisma.RouteWhereInput = {};

  if (isNaN(skip) || isNaN(limit) || page < 1 || limit < 1) {
    return NextResponse.json(
      { error: 'Invalid pagination values' },
      { status: 400 }
    );
  }

  // if qeury query by customer first and lastname
  if (query) {
    baseWhereClause.name = { contains: query, mode: 'insensitive' };
  }

  const routes = await prisma.route.findMany({
    skip,
    take: limit,
    where: baseWhereClause,
    include: {
      _count: {
        select: {
          order: true,
        },
      },
    },
  });

  const totalRoutes = await prisma.route.count({
    where: baseWhereClause,
  });
  const totalPages = Math.ceil(totalRoutes / 10);

  return NextResponse.json({ routes, totalRoutes, totalPages });
}
