import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, withFetch } from '@angular/common/http'; // Importar HttpClient, configuración de interceptores y withFetch
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importar módulo de animaciones para Angular Material
import { FormsModule } from '@angular/forms'; // Importar FormsModule

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // Importar el interceptor de autenticación

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi(), withFetch()), // Configurar HttpClient con soporte para interceptores y fetch
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Registrar el interceptor de autenticación
    importProvidersFrom(BrowserAnimationsModule, FormsModule) // Importar módulos necesarios globalmente
  ]
};
