import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Importar Inject y PLATFORM_ID
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthRequest, AuthResponse } from '../models/Auth';
import { isPlatformBrowser } from '@angular/common'; // Importar isPlatformBrowser

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth/login';
    private tokenKey = 'auth_token';

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { } // Inyectar PLATFORM_ID

    login(authRequest: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.apiUrl, authRequest).pipe(
            tap(response => this.setToken(response.token))
        );
    }

    setToken(token: string): void {
        if (isPlatformBrowser(this.platformId)) { // Comprobar si está en el navegador
            localStorage.setItem(this.tokenKey, token);
        }
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) { // Comprobar si está en el navegador
            return localStorage.getItem(this.tokenKey);
        }
        return null; // Devolver null si no está en el navegador
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) { // Comprobar si está en el navegador
            localStorage.removeItem(this.tokenKey);
        }
    }

    isLoggedIn(): boolean {
        if (isPlatformBrowser(this.platformId)) { // Comprobar si está en el navegador
            return !!this.getToken();
        }
        return false; // Devolver false si no está en el navegador
    }
}
