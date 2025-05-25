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
    cancionesDisponibles: Cancion[] = [];
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
            this.cargarLista(listaId);
            this.cargarCancionesDisponibles();
        } else {
            // Manejar caso donde no hay ID de lista (ej. redirigir o mostrar error)
            console.error('No se proporcionó ID de lista.');
            this.router.navigate(['/listas']); // Redirigir a la lista de listas
        }
    }

    cargarLista(id: number): void {
        this.listaReproduccionService.getListaById(id).subscribe({
            next: (lista) => this.lista = lista,
            error: (err) => console.error('Error al cargar lista de reproducción:', err)
        });
    }

    cargarCancionesDisponibles(): void {
        this.cancionService.getAllCanciones().subscribe({
            next: (canciones) => this.cancionesDisponibles = canciones,
            error: (err) => console.error('Error al cargar canciones disponibles:', err)
        });
    }

    anadirCancionALista(): void {
        if (this.lista && this.cancionSeleccionadaId !== null) {
            // Enviar la lista actualizada al backend con la nueva canción
            // El backend necesita un DTO con el ID de la lista y la lista de IDs de canciones actualizada.
            // Esto requiere un método específico en ListaReproduccionService o adaptar updateLista.
            // Por ahora, simularé la adición en el frontend y mostraré un mensaje.
            // La implementación real requeriría una llamada PUT/POST al backend.

            const cancionAAgregar = this.cancionesDisponibles.find(c => c.id === this.cancionSeleccionadaId);

            if (cancionAAgregar && !this.lista.canciones.some(c => c.id === cancionAAgregar.id)) {
                 // Crear un DTO de actualización con todos los IDs de canciones actuales + el nuevo
                 const cancionIdsActualizados = new Set(this.lista.canciones.map(c => c.id));
                 cancionIdsActualizados.add(this.cancionSeleccionadaId);

                 const listaActualizadaDto = {
                     id: this.lista.id,
                     nombre: this.lista.nombre,
                     descripcion: this.lista.descripcion,
                     cancionIds: Array.from(cancionIdsActualizados) // Convertir Set a Array para el DTO
                 };

                 this.listaReproduccionService.updateLista(this.lista.id!, listaActualizadaDto as any).subscribe({ // Usar as any temporalmente si el DTO no coincide exactamente
                     next: (listaActualizada) => {
                         console.log('Canción añadida a la lista con éxito');
                         this.lista = listaActualizada; // Actualizar la lista en el frontend
                         this.cancionSeleccionadaId = null; // Resetear el select
                     },
                     error: (err) => console.error('Error al añadir canción a la lista:', err)
                 });

            } else if (cancionAAgregar && this.lista.canciones.some(c => c.id === cancionAAgregar.id)) {
                 console.warn('La canción ya está en la lista.');
                 // Mostrar un mensaje al usuario (ej. con MatSnackBar)
            } else {
                 console.error('Canción seleccionada no encontrada.');
            }

        } else {
            console.warn('Selecciona una canción para añadir.');
            // Mostrar un mensaje al usuario
        }
    }

    quitarCancionDeLista(cancionId: number): void {
        if (this.lista) {
            // Enviar la lista actualizada al backend sin la canción a quitar
            // Esto requiere un método específico en ListaReproduccionService o adaptar updateLista.

            const cancionIdsActualizados = new Set(this.lista.canciones.map(c => c.id));
            cancionIdsActualizados.delete(cancionId);

            const listaActualizadaDto = {
                id: this.lista.id,
                nombre: this.lista.nombre,
                descripcion: this.lista.descripcion,
                cancionIds: Array.from(cancionIdsActualizados) // Convertir Set a Array para el DTO
            };

            this.listaReproduccionService.updateLista(this.lista.id!, listaActualizadaDto as any).subscribe({ // Usar as any temporalmente si el DTO no coincide exactamente
                next: (listaActualizada) => {
                    console.log('Canción quitada de la lista con éxito');
                    this.lista = listaActualizada; // Actualizar la lista en el frontend
                },
                error: (err) => console.error('Error al quitar canción de la lista:', err)
            });
        }
    }
}
