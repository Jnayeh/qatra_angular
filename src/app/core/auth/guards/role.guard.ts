import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@/app/core/auth/auth.store';

export function roleGuard(...allowedRoles: string[]): CanActivateFn {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    const userRoles = authStore.userRoles();
    const hasRole = allowedRoles.some((r) => userRoles.includes(r as any));

    if (!hasRole) {
      return router.parseUrl('/');
    }

    return true;
  };
}
