import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ListaCancionesComponent } from './canciones/lista-canciones/lista-canciones.component';
import { CancionFormComponent } from './canciones/cancion-form/cancion-form.component';
import { ListaListasComponent } from './listas-reproduccion/lista-listas/lista-listas.component';
import { ListaFormComponent } from './listas-reproduccion/lista-form/lista-form.component';
import { DetalleListaComponent } from './listas-reproduccion/detalle-lista/detalle-lista.component';
import { authGuard } from './guards/auth.guard'; // Importar el AuthGuard

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'canciones',
        component: ListaCancionesComponent,
        canActivate: [authGuard] // Proteger con AuthGuard
    },
    {
        path: 'canciones/nueva',
        component: CancionFormComponent,
        canActivate: [authGuard] // Proteger con AuthGuard
    },
    {
        path: 'canciones/editar/:id',
        component: CancionFormComponent,
        canActivate: [authGuard] // Proteger con AuthGuard
    },
    {
        path: 'listas',
        component: ListaListasComponent,
        canActivate: [authGuard] // Proteger con AuthGuard
    },
    {
        path: 'listas/nueva',
        component: ListaFormComponent,
        canActivate: [authGuard] // Proteger con AuthGuard
    },
    {
        path: 'listas/detalle/:id',
        component: DetalleListaComponent,
        canActivate: [authGuard] // Proteger con AuthGuard
    },
    // Redireccionar la ruta raíz. Redirigimos a /listas y el AuthGuard en /listas
    // se encargará de redirigir a /login si no está autenticado.
    { path: '', redirectTo: '/listas', pathMatch: 'full' },
    // Manejar rutas no encontradas (opcional)
    // { path: '**', component: NotFoundComponent } // Si tuvieras un componente NotFound
];
