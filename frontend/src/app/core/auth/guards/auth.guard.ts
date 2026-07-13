import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@/app/core/auth/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const isAuthenticated = authStore.isAuthenticated() || !!localStorage.getItem('accessToken');

  if (!isAuthenticated) {
    return router.parseUrl('');
  }

  return true;
};
