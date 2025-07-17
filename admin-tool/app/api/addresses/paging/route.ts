import { NextRequest, NextResponse } from 'next/server';
import { addressApiService } from '@/lib/api/concrete/address';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const query = searchParams.get('query') || undefined;
  const filter = searchParams.get('filter') || undefined;
  const tag = searchParams.get('tag') || undefined;

  try {
    const data = await addressApiService.getAddressesPaging(
      page,
      limit,
      query,
      filter,
      tag
    );
    console.log('Fetched addresses:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
