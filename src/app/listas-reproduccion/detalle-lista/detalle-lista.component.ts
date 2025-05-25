import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importar ActivatedRoute y Router
import { ListaReproduccionService } from '../../services/ListaReproduccionService';
import { CancionService } from '../../services/CancionService'; // Importar CancionService
import { ListaReproduccion } from '../../models/ListaReproduccion';
import { Cancion } from '../../models/Cancion'; // Importar Cancion
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { MatCardModule } from '@angular/material/card'; // Importar MatCardModule
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule
import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule
import { MatTableModule } from '@angular/material/table'; // Importar MatTableModule
import { MatSelectModule } from '@angular/material/select'; // Importar MatSelectModule
import { FormsModule } from '@angular/forms'; // Importar FormsModule para el select

@Component({
    selector: 'app-detalle-lista',
    templateUrl: './detalle-lista.component.html',
    styleUrls: ['./detalle-lista.component.scss'], // Usar scss
    standalone: true, // Marcar como standalone
    imports: [
        CommonModule,
        FormsModule, // Necesario para ngModel en el select
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSelectModule
    ]
})
export class DetalleListaComponent implements OnInit {
    lista: ListaReproduccion | null = null;
    todasLasCanciones: Cancion[] = []; // Almacenará todas las canciones
    cancionesParaDropdown: Cancion[] = []; // Canciones filtradas para el dropdown
    cancionSeleccionadaId: number | null = null;
    displayedColumns: string[] = ['id', 'titulo', 'artista', 'album', 'anno', 'genero', 'acciones']; // Columnas para la tabla de canciones de la lista

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private listaReproduccionService: ListaReproduccionService,
        private cancionService: CancionService
    ) { }

    ngOnInit(): void {
        const listaId = this.route.snapshot.params['id'];
        if (listaId) {
            this.cargarTodasLasCanciones(); // Cargar todas las canciones primero
            this.cargarLista(listaId);
        } else {
            console.error('No se proporcionó ID de lista.');
            this.router.navigate(['/listas']);
        }
    }

    cargarLista(id: number): void {
        this.listaReproduccionService.getListaById(id).subscribe({
            next: (lista) => {
                this.lista = lista;
                this.actualizarCancionesParaDropdown(); // Actualizar dropdown después de cargar la lista
            },
            error: (err) => console.error('Error al cargar lista de reproducción:', err)
        });
    }

    cargarTodasLasCanciones(): void {
        this.cancionService.getAllCanciones().subscribe({
            next: (canciones) => {
                this.todasLasCanciones = canciones;
                this.actualizarCancionesParaDropdown(); // Actualizar dropdown después de cargar todas las canciones
            },
            error: (err) => console.error('Error al cargar canciones disponibles:', err)
        });
    }

    actualizarCancionesParaDropdown(): void {
        if (this.todasLasCanciones.length > 0 && this.lista) {
            const idsEnLista = new Set(this.lista.canciones.map(c => c.id));
            this.cancionesParaDropdown = this.todasLasCanciones.filter(c => !idsEnLista.has(c.id));
        } else {
            this.cancionesParaDropdown = [];
        }
    }

    anadirCancionALista(): void {
        if (this.lista && this.cancionSeleccionadaId !== null) {
            const cancionAAgregar = this.todasLasCanciones.find(c => c.id === this.cancionSeleccionadaId);

            if (cancionAAgregar && !this.lista.canciones.some(c => c.id === cancionAAgregar.id)) {
                 const cancionIdsActualizados = new Set(this.lista.canciones.map(c => c.id));
                 cancionIdsActualizados.add(this.cancionSeleccionadaId);

                 const listaActualizadaDto = {
                     id: this.lista.id,
                     nombre: this.lista.nombre,
                     descripcion: this.lista.descripcion,
                     cancionIds: Array.from(cancionIdsActualizados)
                 };

                 this.listaReproduccionService.updateLista(this.lista.id!, listaActualizadaDto as any).subscribe({
                     next: (listaActualizada) => {
                         console.log('Canción añadida a la lista con éxito');
                         this.lista = listaActualizada;
                         this.cancionSeleccionadaId = null;
                         this.actualizarCancionesParaDropdown(); // Refrescar dropdown
                     },
                     error: (err) => console.error('Error al añadir canción a la lista:', err)
                 });

            } else if (cancionAAgregar && this.lista.canciones.some(c => c.id === cancionAAgregar.id)) {
                 console.warn('La canción ya está en la lista.');
            } else {
                 console.error('Canción seleccionada no encontrada.');
            }

        } else {
            console.warn('Selecciona una canción para añadir.');
        }
    }

    quitarCancionDeLista(cancionId: number): void {
        if (this.lista) {
            const cancionIdsActualizados = new Set(this.lista.canciones.map(c => c.id));
            cancionIdsActualizados.delete(cancionId);

            const listaActualizadaDto = {
                id: this.lista.id,
                nombre: this.lista.nombre,
                descripcion: this.lista.descripcion,
                cancionIds: Array.from(cancionIdsActualizados)
            };

            this.listaReproduccionService.updateLista(this.lista.id!, listaActualizadaDto as any).subscribe({
                next: (listaActualizada) => {
                    console.log('Canción quitada de la lista con éxito');
                    this.lista = listaActualizada;
                    this.actualizarCancionesParaDropdown(); // Refrescar dropdown
                },
                error: (err) => console.error('Error al quitar canción de la lista:', err)
            });
        }
    }

    volverAListas(): void {
        this.router.navigate(['/listas']);
    }
}
