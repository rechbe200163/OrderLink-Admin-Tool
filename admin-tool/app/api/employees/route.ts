import prisma from '@/prisma/client';
import { Prisma, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('query') || undefined;
    const filter = req.nextUrl.searchParams.get('filter') || undefined;
    const role = req.nextUrl.searchParams.get('role') || undefined;
    const page = Number(req.nextUrl.searchParams.get('page') || 1);
    const limit = Number(req.nextUrl.searchParams.get('limit') || 20);
    const exludeEmployeeId =
      req.nextUrl.searchParams.get('excludeEmployeeId') || undefined;

    const skip = (page - 1) * limit;
    // Check for invalid role sector values
    if (role) {
      const roles = role.split(',');
      const invalidRoles = roles.filter(
        (role) => !Object.values(Role).includes(role as Role)
      );
      if (invalidRoles.length > 0) {
        return NextResponse.json(
          {
            error: `Invalid role value(s): ${invalidRoles.join(', ')}`,
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

    // Process business sector logic
    const baseWhereClause: Prisma.EmployeesWhereInput = {
      deleted: false,
      employeeId: {
        not: exludeEmployeeId,
      },
    };

    if (role) {
      const roles = role.split(',').map((role) => role as Role);

      const whereClauses: Prisma.EmployeesWhereInput[] = [];

      if (roles.filter((role) => role !== null).length > 0) {
        whereClauses.push({
          role: {
            in: roles.filter((role) => role !== null) as Role[],
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
    const employees = await prisma.employees.findMany({
      skip,
      take: limit,
      where: baseWhereClause,
      orderBy: {
        lastName: 'asc',
      },
    });

    const totalEmployees = await prisma.employees.count({
      where: baseWhereClause,
    });

    const totalPages = Math.ceil(totalEmployees / limit);

    return NextResponse.json(
      { employees, totalEmployees, totalPages },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' + error },
      { status: 500 }
    );
  }
}
