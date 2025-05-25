import prisma from '@/prisma/client';
import { BusinessSector, Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
const { auth } = NextAuth(authConfig);

export async function GET(req: NextRequest) {
  try {
    const stats = req.nextUrl.searchParams.get('stats');
    const query = req.nextUrl.searchParams.get('query') || undefined;
    const filter = req.nextUrl.searchParams.get('filter') || undefined;
    const businessSector =
      req.nextUrl.searchParams.get('businessSector') || undefined;
    const page = Number(req.nextUrl.searchParams.get('page') || 1);
    const limit = Number(req.nextUrl.searchParams.get('limit') || 20);

    const skip = (page - 1) * limit;

    // Check for invalid business sector values
    if (businessSector) {
      const sectors = businessSector.split(',');
      const invalidSectors = sectors.filter(
        (sector) =>
          sector !== 'private' &&
          !Object.values(BusinessSector).includes(sector as BusinessSector)
      );
      if (invalidSectors.length > 0) {
        return NextResponse.json(
          {
            error: `Invalid business sector value(s): ${invalidSectors.join(
              ', '
            )}`,
          },
          { status: 400 }
        );
      }
    }

    // Pagination validation
    if (isNaN(skip) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid pagination values' },
        { status: 400 }
      );
    }

    if (stats === 'customerStats') {
      // sigups sincd last month
      const startOfMonth = new Date();
      startOfMonth.setDate(1); // Erster Tag des Monats
      startOfMonth.setHours(0, 0, 0, 0); // Setzt die Zeit auf Mitternacht

      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1); // Nächster Monat
      endOfMonth.setDate(0); // Letzter Tag des aktuellen Monats
      endOfMonth.setHours(23, 59, 59, 999); // Setzt die Zeit auf den letzten Moment des Tages

      const currentMonthSignUps = await prisma.customer.count({
        where: {
          signedUp: {
            gte: startOfMonth, // Start des Monats
            lte: endOfMonth, // Ende des Monats
          },
        },
      });

      const lastMonthSignUps = await prisma.customer.count({
        where: {
          signedUp: {
            gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 1,
              1
            ),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      });

      const percentageChange = Math.round(
        ((currentMonthSignUps - lastMonthSignUps) / lastMonthSignUps) * 100
      );

      return NextResponse.json(
        { currentMonthSignUps, percentageChange, lastMonthSignUps },
        { status: 200 }
      );
    }

    // Process business sector logic
    const baseWhereClause: Prisma.CustomerWhereInput = { deleted: false };

    if (businessSector) {
      const sectors = businessSector
        .split(',')
        .map((sector) => (sector === 'private' ? null : sector)); // Replace 'private' with null

      const whereClauses: Prisma.CustomerWhereInput[] = [];

      if (sectors.includes(null)) {
        whereClauses.push({ businessSector: null }); // For 'private' customers
      }

      if (sectors.filter((sector) => sector !== null).length > 0) {
        whereClauses.push({
          businessSector: {
            in: sectors.filter((sector) => sector !== null) as BusinessSector[],
          },
        });
      }

      if (whereClauses.length > 0) {
        baseWhereClause.OR = whereClauses;
      }
    }

    // Handle the 'query' parameter for customer search
    if (query) {
      baseWhereClause.OR = [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Handle filtering logic
    if (filter) {
      const filters = new Set(filter.split(','));
      switch (true) {
        case filters.has('active') && filters.has('inactive'):
          break; // No filtering required, include all
        case filters.has('active'):
          baseWhereClause.deleted = false;
          break;
        case filters.has('inactive'):
          baseWhereClause.deleted = true;
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid filter value' },
            { status: 400 }
          );
      }
    }

    // Fetch customers from the database
    const customers = await prisma.customer.findMany({
      skip,
      take: limit,
      where: baseWhereClause,
      orderBy: {
        businessSector: 'asc',
      },
    });

    const totalCustomers = await prisma.customer.count({
      where: baseWhereClause,
    });

    const totalPages = Math.ceil(totalCustomers / limit);

    return NextResponse.json(
      { customers, totalCustomers, totalPages },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' + error },
      { status: 500 }
    );
  }
}
