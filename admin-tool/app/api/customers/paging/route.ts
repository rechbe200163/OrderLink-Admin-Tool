import { NextRequest, NextResponse } from 'next/server';
import { customerApiService } from '@/lib/api/concrete/customers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const query = searchParams.get('query') || undefined;
  const filter = searchParams.get('filter') || undefined;
  const businessSector = searchParams.get('businessSector') || undefined;

  try {
    const data = await customerApiService.getCustomersPaging(
      page,
      limit,
      undefined,
      undefined,
      query,
      filter,
      businessSector as any,
    );
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
