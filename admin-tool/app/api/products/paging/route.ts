import { NextRequest, NextResponse } from 'next/server';
import { productApiService } from '@/lib/api/concrete/products';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const query = searchParams.get('query') || undefined;
  const filter = searchParams.get('filter') || undefined;
  const category = searchParams.get('category') || undefined;

  try {
    const data = await productApiService.getProductsPaging(
      page,
      limit,
      query,
      filter,
      category as any
    );
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
