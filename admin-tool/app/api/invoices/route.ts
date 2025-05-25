import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
const { auth } = NextAuth(authConfig);
import prisma from '@/prisma/client';
import { Invoice } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get('q');
    const dop = req.nextUrl.searchParams.get('dop');
    const query = req.nextUrl.searchParams.get('query');

    if (query === 'AIVStats') {
      const now = new Date();
      const startOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      // Current month's invoices
      const currentMonthInvoices = await prisma.invoice.findMany({
        where: {
          deleted: false,
          paymentDate: {
            gte: startOfCurrentMonth,
          },
        },
      });

      // Last month's invoices
      const lastMonthInvoices = await prisma.invoice.findMany({
        where: {
          deleted: false,
          paymentDate: {
            gte: startOfLastMonth,
            lt: startOfCurrentMonth,
          },
        },
      });

      // Calculate AIV for the current month
      const currentMonthTotalValue = currentMonthInvoices.reduce(
        (acc: number, invoice: Invoice) => acc + invoice.invoiceAmount,
        0
      );
      const currentMonthTotalInvoices = currentMonthInvoices.length;
      const currentMonthAIV =
        currentMonthTotalInvoices > 0
          ? currentMonthTotalValue / currentMonthTotalInvoices
          : 0;

      // Calculate AIV for the last month
      const lastMonthTotalValue = lastMonthInvoices.reduce(
        (acc, invoice) => acc + invoice.invoiceAmount,
        0
      );
      const lastMonthTotalInvoices = lastMonthInvoices.length;
      const lastMonthAIV =
        lastMonthTotalInvoices > 0
          ? lastMonthTotalValue / lastMonthTotalInvoices
          : 0;

      // Calculate percentage change
      const percentageChange =
        lastMonthAIV > 0
          ? ((currentMonthAIV - lastMonthAIV) / lastMonthAIV) * 100
          : currentMonthAIV > 0
          ? 100
          : 0;

      return NextResponse.json(
        {
          currentMonthAIV: Math.round(currentMonthAIV * 100) / 100, // Rounded to 2 decimal places
          lastMonthAIV: Math.round(lastMonthAIV * 100) / 100,
          percentageChange: Math.round(percentageChange), // Rounded to nearest integer
        },
        { status: 200 }
      );
    }

    if (query === 'revenueStats') {
      const now = new Date();
      const startOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      // Current month's revenue
      const currentMonthRevenue = await prisma.invoice.aggregate({
        _sum: {
          invoiceAmount: true,
        },
        where: {
          deleted: false,
          paymentDate: {
            gte: startOfCurrentMonth,
          },
        },
      });

      // Last month's revenue
      const lastMonthRevenue = await prisma.invoice.aggregate({
        _sum: {
          invoiceAmount: true,
        },
        where: {
          deleted: false,
          paymentDate: {
            gte: startOfLastMonth,
            lt: startOfCurrentMonth,
          },
        },
      });

      // Handle null revenue values
      const currentRevenue = currentMonthRevenue._sum.invoiceAmount || 0;
      const lastRevenue = lastMonthRevenue._sum.invoiceAmount || 0;

      // Calculate percentage change
      let percentageChange;
      if (lastRevenue > 0) {
        percentageChange = ((currentRevenue - lastRevenue) / lastRevenue) * 100;
      } else if (currentRevenue > 0) {
        percentageChange = 100; // Full increase from zero revenue last month
      } else {
        percentageChange = 0; // No revenue in either month
      }

      return NextResponse.json(
        {
          currentMonthRevenue: currentRevenue,
          lastMonthRevenue: lastRevenue,
          percentageChange: Math.round(percentageChange),
        },
        { status: 200 }
      );
    }

    if (query === 'salesStats') {
      const now = new Date();
      const startOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      // Current month's sales count
      const currentMonthSales = await prisma.invoice.count({
        where: {
          deleted: false,
          paymentDate: {
            gte: startOfCurrentMonth,
          },
        },
      });

      // Last month's sales count
      const lastMonthSales = await prisma.invoice.count({
        where: {
          deleted: false,
          paymentDate: {
            gte: startOfLastMonth,
            lt: startOfCurrentMonth,
          },
        },
      });

      // Calculate percentage change
      let percentageChange;
      if (lastMonthSales > 0) {
        percentageChange =
          ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
      } else if (currentMonthSales > 0) {
        percentageChange = 100; // Full increase from zero sales last month
      } else {
        percentageChange = 0; // No sales in either month
      }

      return NextResponse.json(
        {
          currentMonthSales,
          lastMonthSales,
          percentageChange: Math.round(percentageChange),
        },
        { status: 200 }
      );
    }

    if (search === 'cu') {
      const customerInvoices = await prisma.invoice.findMany({
        include: {
          order: {
            include: {
              customer: true,
            },
          },
        },
        where: {
          deleted: false,
        },
      });
      return NextResponse.json(customerInvoices, {
        status: 200,
      });
    }

    if (search === 'paid') {
      const paidInvoices = await prisma.invoice.findMany({
        where: {
          paymentDate: {
            not: undefined,
          },
        },
      });
      return NextResponse.json(paidInvoices, {
        status: 200,
      });
    }

    if (search === 'unpaid') {
      const unpaidInvoices = await prisma.invoice.findMany({
        where: {
          paymentDate: null!,
        },
      });
      return NextResponse.json(unpaidInvoices, {
        status: 200,
      });
    }

    if (dop === 'asc' || dop === 'desc') {
      const invoices = await prisma.invoice.findMany({
        orderBy: {
          paymentDate: dop,
        },
      });
      return NextResponse.json(invoices, {
        status: 200,
      });
    }

    // General invoices query with optional date filter
    const invoices = await prisma.invoice.findMany({});

    return NextResponse.json(invoices, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' + error },
      { status: 500 }
    );
  }
}
