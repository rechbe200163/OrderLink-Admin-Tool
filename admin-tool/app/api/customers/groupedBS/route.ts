import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET() {
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
    console.error('Error grouping customers by business sector:', error);
    return NextResponse.json(
      { error: 'Failed to group customers' },
      { status: 500 }
    );
  }
}
