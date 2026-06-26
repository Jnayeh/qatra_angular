import { signal } from '@angular/core';

export interface PaginationState {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export function createPaginationState(initialSize = 20) {
  const page = signal(0);
  const size = signal(initialSize);
  const totalElements = signal(0);
  const totalPages = signal(0);

  return {
    page: page.asReadonly(),
    size: size.asReadonly(),
    totalElements: totalElements.asReadonly(),
    totalPages: totalPages.asReadonly(),
    setPage: (p: number) => page.set(p),
    setSize: (s: number) => size.set(s),
    setTotalElements: (t: number) => totalElements.set(t),
    setTotalPages: (t: number) => totalPages.set(t),
    nextPage: () => page.update((p) => Math.min(p + 1, totalPages() - 1)),
    prevPage: () => page.update((p) => Math.max(p - 1, 0)),
    firstPage: () => page.set(0),
    lastPage: () => page.set(Math.max(0, totalPages() - 1)),
  };
}
