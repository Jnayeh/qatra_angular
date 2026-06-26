export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'PENDING_VERIFICATION'
  | 'DELETED';

export type Role = 'SYSTEM_ADMIN' | 'CENTER_ADMIN' | 'CENTER_STAFF' | 'DONOR';

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
  displayName: string;
  status: UserStatus;
  roles: Role[];
  createdAt: string;
}

export interface UserDetail extends User {
  deletedAt: string | null;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  displayName: string;
  role: 'DONOR';
}

export interface RegisterResult {
  userId: number;
  email: string;
  emailVerificationSent: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}
