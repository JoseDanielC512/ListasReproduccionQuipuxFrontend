import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListaReproduccion } from '../models/ListaReproduccion';
import { AuthService } from './AuthService';

@Injectable({
    providedIn: 'root'
})
export class ListaReproduccionService {
    private apiUrl = 'http://localhost:8080/api/listas';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    getAllListas(): Observable<ListaReproduccion[]> {
        return this.http.get<ListaReproduccion[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    getListaById(id: number): Observable<ListaReproduccion> {
        return this.http.get<ListaReproduccion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createLista(lista: ListaReproduccion): Observable<ListaReproduccion> {
        return this.http.post<ListaReproduccion>(this.apiUrl, lista, { headers: this.getHeaders() });
    }

    updateLista(id: number, lista: ListaReproduccion): Observable<ListaReproduccion> {
        return this.http.put<ListaReproduccion>(`${this.apiUrl}/${id}`, lista, { headers: this.getHeaders() });
    }

    deleteLista(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
