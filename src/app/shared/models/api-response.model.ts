export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp: string;
  page?: Page;
}

export interface Page {
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}
