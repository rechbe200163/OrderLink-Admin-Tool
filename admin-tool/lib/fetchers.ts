export async function fetchCategoriesPaging(page: number, limit: number) {
  const res = await fetch(`/api/categories/paging?page=${page}&limit=${limit}`);
  return res.json();
}
