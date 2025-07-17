import { NextRequest, NextResponse } from 'next/server';
import { categoryApiService } from '@/lib/api/concrete/categories';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const query = searchParams.get('query') || undefined;
  const filter = searchParams.get('filter') || undefined;

  try {
    const data = await categoryApiService.getCategoriesPaging(
      page,
      limit,
      query,
      filter
    );
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
