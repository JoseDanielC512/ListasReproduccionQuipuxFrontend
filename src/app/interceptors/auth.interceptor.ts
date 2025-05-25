import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/AuthService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    // Definir la URL del endpoint de login directamente aquí o como una constante
    private loginUrl = 'http://localhost:8080/api/auth/login';

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Si la petición es para el endpoint de login, no añadir el token
        if (req.url === this.loginUrl) {
            return next.handle(req);
        }

        const token = this.authService.getToken();
        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(cloned);
        }
        return next.handle(req);
    }
}
