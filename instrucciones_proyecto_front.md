# instrucciones_proyecto_front.md

**Guía Detallada para Implementación del Frontend en Angular 17**

Este documento describe los pasos específicos para implementar una aplicación frontend en Angular versión 17 que interactúe con la API RESTful de gestión de listas de reproducción y canciones desarrollada en Java con Spring Boot. La aplicación permitirá autenticación de usuarios, gestión de listas de reproducción y canciones, y visualización de datos, cumpliendo con el requerimiento del paso 2 del proyecto.

---

## 1. Requisitos Previos

- **Node.js**: Versión 18.x o superior instalada.
- **npm**: Incluido con Node.js.
- **Backend**: La aplicación backend en Java debe estar ejecutándose en `http://localhost:8080`.

Verifica las versiones instaladas:
```bash
node -v
npm -v
```

---

## 2. Instalación y Configuración Inicial

### 2.1. Instalar Angular CLI
Ejecuta el siguiente comando para instalar Angular CLI globalmente:
```bash
npm install -g @angular/cli@17
```

### 2.2. Crear el Proyecto Angular
Crea un nuevo proyecto con enrutamiento y sin pruebas unitarias:
```bash
ng new playlist-frontend --style=css --routing=true --skip-tests
```
- Responde "No" a cualquier pregunta adicional (como SSR).
- Navega al directorio del proyecto:
```bash
cd playlist-frontend
```

---

## 3. Estructura de Carpetas

Organiza el proyecto dentro de `src/app/` con la siguiente estructura:
```
src/app/
├── auth/                    # Componentes y servicios de autenticación
├── canciones/               # Componentes y servicios para canciones
├── listas-reproduccion/     # Componentes y servicios para listas de reproducción
├── shared/                  # Componentes y utilidades compartidas
├── models/                  # Modelos de datos
├── services/                # Servicios comunes
├── interceptors/            # Interceptores HTTP
├── app.component.*          # Componente raíz
├── app.module.ts            # Módulo principal
└── app-routing.module.ts    # Módulo de enrutamiento
```

---

## 4. Configuración del Proyecto

### 4.1. Instalar Dependencias
Instala las dependencias necesarias:
```bash
npm install @angular/material @angular/cdk @angular/animations rxjs
```

### 4.2. Configurar Angular Material (Opcional)
Si deseas usar Angular Material, ejecuta:
```bash
ng add @angular/material
```
- Elige el tema "Indigo/Pink".
- Habilita las animaciones y el soporte para gestos.

---

## 5. Crear Modelos de Datos

Crea la carpeta `src/app/models/` y añade los siguientes archivos:

### 5.1. `src/app/models/Cancion.ts`
```typescript
export interface Cancion {
    id?: number;
    titulo: string;
    artista: string;
    album: string;
    anno: string;
    genero: string;
}
```

### 5.2. `src/app/models/ListaReproduccion.ts`
```typescript
import { Cancion } from './Cancion';

export interface ListaReproduccion {
    id?: number;
    nombre: string;
    descripcion?: string;
    canciones: Cancion[];
}
```

### 5.3. `src/app/models/Auth.ts`
```typescript
export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}
```

---

## 6. Implementar Servicios

Crea la carpeta `src/app/services/` y añade los siguientes servicios:

### 6.1. `src/app/services/AuthService.ts`
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthRequest, AuthResponse } from '../models/Auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth/login';
    private tokenKey = 'auth_token';

    constructor(private http: HttpClient) { }

    login(authRequest: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.apiUrl, authRequest).pipe(
            tap(response => this.setToken(response.token))
        );
    }

    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
```

### 6.2. `src/app/services/CancionService.ts`
```typescript
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
```

### 6.3. `src/app/services/ListaReproduccionService.ts`
```typescript
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
```

---

## 7. Configurar Interceptor de Autenticación

Crea la carpeta `src/app/interceptors/` y añade el siguiente archivo:

### 7.1. `src/app/interceptors/auth.interceptor.ts`
```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/AuthService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
```

### 7.2. Registrar el Interceptor
Edita `src/app/app.module.ts` para registrar el interceptor:
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

---

## 8. Crear Componentes

### 8.1. Componente de Login
Genera el componente:
```bash
ng generate component auth/login
```

#### `src/app/auth/login/login.component.ts`
```typescript
import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    error: string = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit(): void {
        const authRequest = { username: this.username, password: this.password };
        this.authService.login(authRequest).subscribe({
            next: () => this.router.navigate(['/canciones']),
            error: () => this.error = 'Credenciales inválidas'
        });
    }
}
```

#### `src/app/auth/login/login.component.html`
```html
<div>
    <h2>Iniciar Sesión</h2>
    <form (ngSubmit)="onSubmit()">
        <div>
            <label>Usuario:</label>
            <input type="text" [(ngModel)]="username" name="username" required>
        </div>
        <div>
            <label>Contraseña:</label>
            <input type="password" [(ngModel)]="password" name="password" required>
        </div>
        <button type="submit">Iniciar Sesión</button>
        <p *ngIf="error">{{ error }}</p>
    </form>
</div>
```

#### `src/app/auth/login/login.component.css`
```css
div { padding: 20px; }
form { display: flex; flex-direction: column; gap: 10px; }
button { width: 100px; }
```

### 8.2. Componente para Listar Canciones
Genera el componente:
```bash
ng generate component canciones/lista-canciones
```

#### `src/app/canciones/lista-canciones/lista-canciones.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { CancionService } from '../../services/CancionService';
import { Cancion } from '../../models/Cancion';

@Component({
    selector: 'app-lista-canciones',
    templateUrl: './lista-canciones.component.html',
    styleUrls: ['./lista-canciones.component.css']
})
export class ListaCancionesComponent implements OnInit {
    canciones: Cancion[] = [];

    constructor(private cancionService: CancionService) { }

    ngOnInit(): void {
        this.cancionService.getAllCanciones().subscribe({
            next: (data) => this.canciones = data,
            error: (err) => console.error('Error al cargar canciones:', err)
        });
    }
}
```

#### `src/app/canciones/lista-canciones/lista-canciones.component.html`
```html
<div>
    <h2>Lista de Canciones</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Artista</th>
                <th>Álbum</th>
                <th>Año</th>
                <th>Género</th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let cancion of canciones">
                <td>{{ cancion.id }}</td>
                <td>{{ cancion.titulo }}</td>
                <td>{{ cancion.artista }}</td>
                <td>{{ cancion.album }}</td>
                <td>{{ cancion.anno }}</td>
                <td>{{ cancion.genero }}</td>
            </tr>
        </tbody>
    </table>
</div>
```

#### `src/app/canciones/lista-canciones/lista-canciones.component.css`
```css
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #f2f2f2; }
```

---

## 9. Configurar Enrutamiento

Edita `src/app/app-routing.module.ts`:
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ListaCancionesComponent } from './canciones/lista-canciones/lista-canciones.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'canciones', component: ListaCancionesComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

---

## 10. Actualizar Módulo Principal

Asegúrate de que `src/app/app.module.ts` incluya `FormsModule` para formularios:
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ListaCancionesComponent } from './canciones/lista-canciones/lista-canciones.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ListaCancionesComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

---

## 11. Probar la Aplicación

1. Inicia el servidor de desarrollo:
```bash
ng serve
```
2. Abre el navegador en `http://localhost:4200`.
3. Verifica que:
   - La página de login aparece en la raíz (`/`).
   - Al iniciar sesión con credenciales válidas, redirige a `/canciones`.
   - La lista de canciones se carga correctamente desde el backend.

---

## 12. Notas Finales

- Asegúrate de que el backend esté corriendo en `http://localhost:8080`.
- Este archivo cubre la base para interactuar con los endpoints de autenticación y canciones. Para completar el frontend, repite el proceso de creación de componentes y rutas para listas de reproducción.
- Maneja errores mostrando mensajes al usuario y usa estilos para mejorar la experiencia.