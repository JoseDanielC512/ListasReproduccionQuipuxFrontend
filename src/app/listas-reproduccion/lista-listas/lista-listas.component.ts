import { Component, OnInit } from '@angular/core';
import { ListaReproduccionService } from '../../services/ListaReproduccionService';
import { ListaReproduccion } from '../../models/ListaReproduccion';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { MatCardModule } from '@angular/material/card'; // Importar MatCardModule
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule
import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule
import { RouterLink } from '@angular/router'; // Importar RouterLink

@Component({
    selector: 'app-lista-listas',
    templateUrl: './lista-listas.component.html',
    styleUrls: ['./lista-listas.component.scss'], // Usar scss
    standalone: true, // Marcar como standalone
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink] // Importar módulos necesarios
})
export class ListaListasComponent implements OnInit {
    listas: ListaReproduccion[] = [];

    constructor(private listaReproduccionService: ListaReproduccionService) { }

    ngOnInit(): void {
        this.cargarListas();
    }

    cargarListas(): void {
        this.listaReproduccionService.getAllListas().subscribe({
            next: (data) => this.listas = data,
            error: (err) => console.error('Error al cargar listas de reproducción:', err)
        });
    }

    eliminarLista(id: number): void {
        if (confirm('¿Estás seguro de que deseas eliminar esta lista de reproducción?')) {
            this.listaReproduccionService.deleteLista(id).subscribe({
                next: () => {
                    console.log('Lista de reproducción eliminada con éxito');
                    this.cargarListas(); // Recargar la lista después de eliminar
                },
                error: (err) => console.error('Error al eliminar lista de reproducción:', err)
            });
        }
    }
}
