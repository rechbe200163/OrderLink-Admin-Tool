import { GET } from './route'; // Adjust this import based on the actual path to your route file
import { NextRequest } from 'next/server';
import { matchers } from 'jest-json-schema';
import prisma from '@/prisma/client'; // Import the Prisma client

expect.extend(matchers);

// Mocking Prisma client methods
jest.mock('@/prisma/client', () => ({
  invoice: {
    findMany: jest.fn(),
  },
}));

describe('GET /invoices', () => {
  it('should return customer invoices when search parameter is "cu"', async () => {
    const mockInvoices = [
      {
        id: 'invoice1',
        amount: 100,
        paymentDate: null,
        order: {
          customer: { id: 'customer1', name: 'Customer 1' },
        },
      },
      {
        id: 'invoice2',
        amount: 200,
        paymentDate: null,
        order: {
          customer: { id: 'customer2', name: 'Customer 2' },
        },
      },
    ];

    // Mock the findMany method to return the mock invoices
    (prisma.invoice.findMany as jest.Mock).mockResolvedValue(mockInvoices);

    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams({ q: 'cu' }),
      },
    } as unknown as NextRequest;

    const response = await GET(mockRequest);
    const responseData = await response.json();

    expect(responseData).toMatchSchema({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          amount: { type: 'number' },
          paymentDate: { type: ['string', 'null'] },
          order: {
            type: 'object',
            properties: {
              customer: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
                required: ['id', 'name'],
              },
            },
            required: ['customer'],
          },
        },
        required: ['id', 'amount', 'paymentDate', 'order'],
      },
    });
    expect(response.status).toBe(200);
  });

  it('should return paid invoices when search parameter is "paid"', async () => {
    const mockPaidInvoices = [
      {
        id: 'invoice3',
        amount: 150,
        paymentDate: '2024-01-01',
      },
      {
        id: 'invoice4',
        amount: 250,
        paymentDate: '2024-02-01',
      },
    ];

    (prisma.invoice.findMany as jest.Mock).mockResolvedValue(mockPaidInvoices);

    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams({ q: 'paid' }),
      },
    } as unknown as NextRequest;

    const response = await GET(mockRequest);
    const responseData = await response.json();

    expect(responseData).toMatchSchema({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          amount: { type: 'number' },
          paymentDate: { type: 'string' },
        },
        required: ['id', 'amount', 'paymentDate'],
      },
    });
    expect(response.status).toBe(200);
  });

  it('should return unpaid invoices when search parameter is "unpaid"', async () => {
    const mockUnpaidInvoices = [
      {
        id: 'invoice5',
        amount: 300,
        paymentDate: null,
      },
      {
        id: 'invoice6',
        amount: 400,
        paymentDate: null,
      },
    ];

    (prisma.invoice.findMany as jest.Mock).mockResolvedValue(
      mockUnpaidInvoices
    );

    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams({ q: 'unpaid' }),
      },
    } as unknown as NextRequest;

    const response = await GET(mockRequest);
    const responseData = await response.json();

    expect(responseData).toMatchSchema({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          amount: { type: 'number' },
          paymentDate: { type: ['string', 'null'] },
        },
        required: ['id', 'amount', 'paymentDate'],
      },
    });
    expect(response.status).toBe(200);
  });

  it('should return invoices ordered by paymentDate when dop is "asc"', async () => {
    const mockInvoices = [
      { id: 'invoice7', amount: 50, paymentDate: '2024-01-01' },
      { id: 'invoice8', amount: 75, paymentDate: '2024-02-01' },
    ];

    (prisma.invoice.findMany as jest.Mock).mockResolvedValue(mockInvoices);

    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams({ dop: 'asc' }),
      },
    } as unknown as NextRequest;

    const response = await GET(mockRequest);
    const responseData = await response.json();

    expect(responseData).toMatchSchema({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          amount: { type: 'number' },
          paymentDate: { type: 'string' },
        },
        required: ['id', 'amount', 'paymentDate'],
      },
    });
    expect(response.status).toBe(200);
  });

  it('should return invoices ordered by paymentDate when dop is "desc"', async () => {
    const mockInvoices = [
      { id: 'invoice9', amount: 90, paymentDate: '2024-03-01' },
      { id: 'invoice10', amount: 120, paymentDate: '2024-02-15' },
    ];

    (prisma.invoice.findMany as jest.Mock).mockResolvedValue(mockInvoices);

    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams({ dop: 'desc' }),
      },
    } as unknown as NextRequest;

    const response = await GET(mockRequest);
    const responseData = await response.json();

    expect(responseData).toMatchSchema({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          amount: { type: 'number' },
          paymentDate: { type: 'string' },
        },
        required: ['id', 'amount', 'paymentDate'],
      },
    });
    expect(response.status).toBe(200);
  });

  it('should return all invoices when no specific search or dop parameters are provided', async () => {
    const mockInvoices = [
      { id: 'invoice11', amount: 60, paymentDate: null },
      { id: 'invoice12', amount: 80, paymentDate: '2024-04-01' },
    ];

    (prisma.invoice.findMany as jest.Mock).mockResolvedValue(mockInvoices);

    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams({}),
      },
    } as unknown as NextRequest;

    const response = await GET(mockRequest);
    const responseData = await response.json();

    expect(responseData).toMatchSchema({
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          amount: { type: 'number' },
          paymentDate: { type: ['string', 'null'] },
        },
        required: ['id', 'amount', 'paymentDate'],
      },
    });
    expect(response.status).toBe(200);
  });
  it('should handle errors from the Prisma client', async () => {
    // Mock the findMany method to throw an error
    (prisma.invoice.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const mockRequest = {} as NextRequest; // Create a mock request object

    const response = await GET(mockRequest);
    const responseData = await response.json();

    // Expecting the response to return an error status
    expect(response.status).toBe(500);
    expect(responseData).toEqual({ error: 'Internal Server Error' });
  });
});
