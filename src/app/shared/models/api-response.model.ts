export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
  timestamp: string;
  page?: Paginated;
}

export interface Paginated {
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export type Page = Paginated;
