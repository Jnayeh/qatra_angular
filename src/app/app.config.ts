import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { type ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { authInterceptor } from '@/app/core/auth/auth.interceptor';
import { errorHandlerInterceptor } from '@/app/core/http/error-handler.interceptor';

import { routes } from '@/app/app.routes';

const QatraAura = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fce4e4',
      100: '#f8baba',
      200: '#f28b8b',
      300: '#eb5c5c',
      400: '#e63939',
      500: '#cc0000',
      600: '#b30000',
      700: '#990000',
      800: '#7a0000',
      900: '#5c0000',
      950: '#3d0000',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorHandlerInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: QatraAura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ],
};
