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
  const startDate = req.nextUrl.searchParams.get('startDate') || undefined;
  const endDate = req.nextUrl.searchParams.get('endDate') || undefined;

  const skip = (page - 1) * limit;

  const baseWhereClause: Prisma.OrderWhereInput = {
    deleted: false,
  };

  if (isNaN(skip) || isNaN(limit) || page < 1 || limit < 1) {
    return NextResponse.json(
      { error: 'Invalid pagination values' },
      { status: 400 }
    );
  }

  // check if startDate and endDate are valid dates
  if (startDate && !Date.parse(startDate)) {
    return NextResponse.json(
      { error: 'Invalid start date format' },
      { status: 400 }
    );
  }

  if (endDate && !Date.parse(endDate)) {
    return NextResponse.json(
      { error: 'Invalid end date format' },
      { status: 400 }
    );
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set end date to the end of the day

    baseWhereClause.orderDate = {
      gte: start,
      lte: end,
    };
  }

  // if qeury query by customer first and lastname
  if (query) {
    baseWhereClause.OR = [
      {
        customer: {
          firstName: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
      {
        customer: {
          lastName: {
            contains: query,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  const orders = await prisma.order.findMany({
    skip,
    take: limit,
    where: baseWhereClause,
    include: {
      products: {
        include: {
          product: true,
        },
      },
      customer: {
        select: {
          customerReference: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const totalOrders = await prisma.order.count({
    where: baseWhereClause,
  });
  const totalPages = Math.ceil(totalOrders / 10);

  return NextResponse.json({ orders, totalOrders, totalPages });
}
