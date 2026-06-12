export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'PENDING_VERIFICATION'
  | 'PENDING_DELETION'
  | 'DELETED';

export type Role = 'SUPER_ADMIN' | 'CENTER_ADMIN' | 'CENTER_STAFF' | 'DONOR';

export interface User {
  id: number;
  email: string;
  phone: string;
  displayName: string;
  status: UserStatus;
  emailVerified: boolean;
  roles: Role[];
  createdAt: string;
  lastActiveAt: string | null;
}

export interface UserSummary {
  id: number;
  email: string;
  phone: string;
  displayName: string;
  status: UserStatus;
  emailVerified: boolean;
  roles: Role[];
  createdAt: string;
}

export interface UserDetail extends User {
  deletionRequestedAt: string | null;
  deletedAt: string | null;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  familyName: string;
  displayName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPair {
  token: string;
  tokenType: string;
  refreshToken: string;
  userId: number;
  email: string;
  displayName: string;
  roles: Role[];
}

export interface TokenRefreshRequest {
  refreshToken: string;
}
