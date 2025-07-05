export interface PagingMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

export interface PagingDto<T> {
  data: T[];
  meta: PagingMeta;
}
