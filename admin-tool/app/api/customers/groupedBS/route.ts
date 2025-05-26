import { NextRequest, NextResponse } from 'next/server';
import { BusinessSector, Prisma } from '@prisma/client';
import prisma from '@/prisma/client';

export async function GET(req: NextRequest) {
  try {
    // Fetch customers with their business sector
    const customers = await prisma.customer.findMany({
      select: {
        businessSector: true,
      },
    });

    // Group by business sector
    const sectorCounts: Record<string, number> = {};
    customers.forEach((customer) => {
      const sector = customer.businessSector || 'Unknown';
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });

    const totalCustomers = customers.length;

    return NextResponse.json({
      totalCustomers,
      sectors: sectorCounts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to group customers' },
      { status: 500 }
    );
  }
}
