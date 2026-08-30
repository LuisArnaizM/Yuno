export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export function normalizePagination({ page, pageSize }: PaginationInput = {}): {
  page: number;
  pageSize: number;
  offset: number;
} {
  const safePage =
    Number.isFinite(page) && Number(page) > 0 ? Math.floor(Number(page)) : 1;
  const safePageSize =
    Number.isFinite(pageSize) && Number(pageSize) > 0
      ? Math.min(Math.floor(Number(pageSize)), 100)
      : 10;

  return {
    page: safePage,
    pageSize: safePageSize,
    offset: (safePage - 1) * safePageSize,
  };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    pageSize,
  };
}
