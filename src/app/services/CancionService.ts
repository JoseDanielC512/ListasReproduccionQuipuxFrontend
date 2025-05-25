import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cancion } from '../models/Cancion';
import { AuthService } from './AuthService';

@Injectable({
    providedIn: 'root'
})
export class CancionService {
    private apiUrl = 'http://localhost:8080/api/canciones';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    getAllCanciones(): Observable<Cancion[]> {
        return this.http.get<Cancion[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    getCancionById(id: number): Observable<Cancion> {
        return this.http.get<Cancion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createCancion(cancion: Cancion): Observable<Cancion> {
        return this.http.post<Cancion>(this.apiUrl, cancion, { headers: this.getHeaders() });
    }

    updateCancion(id: number, cancion: Cancion): Observable<Cancion> {
        return this.http.put<Cancion>(`${this.apiUrl}/${id}`, cancion, { headers: this.getHeaders() });
    }

    deleteCancion(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
