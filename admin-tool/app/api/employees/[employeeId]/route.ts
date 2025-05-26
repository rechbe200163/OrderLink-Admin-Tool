import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ employeeId: string }> }
) {
  const params = await props.params;

  const employee = await prisma.employees.findUnique({
    where: {
      deleted: false,
      employeeId: params.employeeId,
    },
  });
  return NextResponse.json(employee);
}
