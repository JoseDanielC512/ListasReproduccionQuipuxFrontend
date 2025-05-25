import { Component, OnInit } from '@angular/core';
import { CancionService } from '../../services/CancionService';
import { Cancion } from '../../models/Cancion';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { MatTableModule } from '@angular/material/table'; // Importar MatTableModule
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule
import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule
import { MatCardModule } from '@angular/material/card'; // Importar MatCardModule
import { RouterLink } from '@angular/router'; // Importar RouterLink

@Component({
    selector: 'app-lista-canciones',
    templateUrl: './lista-canciones.component.html',
    styleUrls: ['./lista-canciones.component.scss'], // Usar scss
    standalone: true, // Marcar como standalone
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, RouterLink] // Importar módulos necesarios
})
export class ListaCancionesComponent implements OnInit {
    canciones: Cancion[] = [];
    displayedColumns: string[] = ['id', 'titulo', 'artista', 'album', 'anno', 'genero', 'acciones']; // Columnas para la tabla

    constructor(private cancionService: CancionService) { }

    ngOnInit(): void {
        this.cargarCanciones();
    }

    cargarCanciones(): void {
        this.cancionService.getAllCanciones().subscribe({
            next: (data) => this.canciones = data,
            error: (err) => console.error('Error al cargar canciones:', err)
        });
    }

    eliminarCancion(id: number): void {
        if (confirm('¿Estás seguro de que deseas eliminar esta canción?')) {
            this.cancionService.deleteCancion(id).subscribe({
                next: () => {
                    console.log('Canción eliminada con éxito');
                    this.cargarCanciones(); // Recargar la lista después de eliminar
                },
                error: (err) => console.error('Error al eliminar canción:', err)
            });
        }
    }
}
