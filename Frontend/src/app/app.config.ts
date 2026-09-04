import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { GlobalToastService } from './core/services/global-toast.service';
import { customPreset } from './custom.preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]),),
    providePrimeNG({
      theme: {
        preset: customPreset,
        options: {
          darkModeSelector: '.dark',
          prefix: 'p'
        }
      }
    }),
    MessageService,
    GlobalToastService,
  ]
};
