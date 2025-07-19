import type { CategoriesPagingDto } from '@/lib/types';

export async function fetchCategoriesPaging(
  page: number,
  limit: number
): Promise<CategoriesPagingDto> {
  const res = await fetch(`/api/categories/paging?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return (await res.json()) as CategoriesPagingDto;
}
