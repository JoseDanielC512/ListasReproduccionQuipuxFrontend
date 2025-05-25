import { CanActivateFn, Router } from '@angular/router'; // Importar Router
import { inject } from '@angular/core'; // Importar inject
import { AuthService } from '../services/AuthService'; // Importar AuthService

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyectar AuthService
  const router = inject(Router); // Inyectar Router

  if (authService.isLoggedIn()) {
    return true; // Permitir acceso si está logueado
  } else {
    router.navigate(['/login']); // Redirigir a login si no está logueado
    return false; // Denegar acceso
  }
};
