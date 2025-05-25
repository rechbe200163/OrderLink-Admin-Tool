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
  const filter = req.nextUrl.searchParams.get('filter') || undefined;
  const tag = req.nextUrl.searchParams.get('tag') || undefined;

  try {
    const skip = (page - 1) * limit;

    if (isNaN(skip) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid pagination values' },
        { status: 400 }
      );
    }

    const baseWhereClause: Prisma.AddressWhereInput = { deleted: false };

    if (tag) {
      baseWhereClause.postCode = {
        contains: tag,
        mode: 'default',
      };
    }

    // search for all fields in the address table that contains srtings that match the query
    if (query) {
      baseWhereClause.OR = [
        { city: { contains: query, mode: 'insensitive' } },
        { state: { contains: query, mode: 'insensitive' } },
        { country: { contains: query, mode: 'insensitive' } },
        { streetName: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (filter) {
      baseWhereClause.deleted = filter === 'active' ? false : true;
    }

    const addresses = await prisma.address.findMany({
      where: baseWhereClause,
      skip,
      take: limit,
    });

    const totalAddresses = await prisma.address.count({
      where: baseWhereClause,
    });

    const totalPages = Math.ceil(totalAddresses / limit);

    return NextResponse.json({ addresses, totalAddresses, totalPages });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' + error },
      { status: 500 }
    );
  }
}
