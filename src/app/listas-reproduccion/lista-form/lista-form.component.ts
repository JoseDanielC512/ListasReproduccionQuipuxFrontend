import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule y clases relacionadas
import { ListaReproduccionService } from '../../services/ListaReproduccionService';
import { ListaReproduccion } from '../../models/ListaReproduccion';
import { ActivatedRoute, Router } from '@angular/router'; // Importar ActivatedRoute y Router
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { MatInputModule } from '@angular/material/input'; // Importar MatInputModule
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule
import { MatCardModule } from '@angular/material/card'; // Importar MatCardModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Importar MatFormFieldModule

@Component({
    selector: 'app-lista-form',
    templateUrl: './lista-form.component.html',
    styleUrls: ['./lista-form.component.scss'], // Usar scss
    standalone: true, // Marcar como standalone
    imports: [
        CommonModule,
        ReactiveFormsModule, // Importar ReactiveFormsModule
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule
    ]
})
export class ListaFormComponent implements OnInit {
    listaForm: FormGroup;
    listaId: number | null = null;
    isEditMode: boolean = false;
    title: string = 'Crear Nueva Lista de Reproducción';

    constructor(
        private fb: FormBuilder,
        private listaReproduccionService: ListaReproduccionService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.listaForm = this.fb.group({
            nombre: ['', Validators.required],
            descripcion: [''] // Descripción no es requerida
        });
    }

    ngOnInit(): void {
        this.listaId = this.route.snapshot.params['id'];
        if (this.listaId) {
            this.isEditMode = true;
            this.title = 'Editar Lista de Reproducción';
            this.listaReproduccionService.getListaById(this.listaId).subscribe({
                next: (lista) => this.listaForm.patchValue(lista),
                error: (err) => console.error('Error al cargar lista para editar:', err)
            });
        }
    }

    onSubmit(): void {
        if (this.listaForm.valid) {
            const lista: ListaReproduccion = this.listaForm.value;
            if (this.isEditMode && this.listaId !== null) {
                this.listaReproduccionService.updateLista(this.listaId, lista).subscribe({
                    next: () => {
                        console.log('Lista de reproducción actualizada con éxito');
                        this.router.navigate(['/listas']); // Redirigir a la lista
                    },
                    error: (err) => console.error('Error al actualizar lista de reproducción:', err)
                });
            } else {
                // Para la creación, el backend espera un DTO con cancionIds opcional.
                // Este formulario solo maneja nombre y descripción, por lo que cancionIds será null/undefined.
                this.listaReproduccionService.createLista(lista).subscribe({
                    next: () => {
                        console.log('Lista de reproducción creada con éxito');
                        this.router.navigate(['/listas']); // Redirigir a la lista
                    },
                    error: (err) => console.error('Error al crear lista de reproducción:', err)
                });
            }
        }
    }

    onCancel(): void {
        this.router.navigate(['/listas']); // Navegar de vuelta a la lista de listas
    }
}
