import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule y clases relacionadas
import { CancionService } from '../../services/CancionService';
import { Cancion } from '../../models/Cancion';
import { ActivatedRoute, Router } from '@angular/router'; // Importar ActivatedRoute y Router
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { MatInputModule } from '@angular/material/input'; // Importar MatInputModule
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule
import { MatCardModule } from '@angular/material/card'; // Importar MatCardModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Importar MatFormFieldModule

@Component({
    selector: 'app-cancion-form',
    templateUrl: './cancion-form.component.html',
    styleUrls: ['./cancion-form.component.scss'], // Usar scss
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
export class CancionFormComponent implements OnInit {
    cancionForm: FormGroup;
    cancionId: number | null = null;
    isEditMode: boolean = false;
    title: string = 'Agregar Nueva Canción';

    constructor(
        private fb: FormBuilder,
        private cancionService: CancionService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.cancionForm = this.fb.group({
            titulo: ['', Validators.required],
            artista: ['', Validators.required],
            album: ['', Validators.required],
            anno: ['', Validators.required],
            genero: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.cancionId = this.route.snapshot.params['id'];
        if (this.cancionId) {
            this.isEditMode = true;
            this.title = 'Editar Canción';
            this.cancionService.getCancionById(this.cancionId).subscribe({
                next: (cancion) => this.cancionForm.patchValue(cancion),
                error: (err) => console.error('Error al cargar canción para editar:', err)
            });
        }
    }

    onSubmit(): void {
        if (this.cancionForm.valid) {
            const cancion: Cancion = this.cancionForm.value;
            if (this.isEditMode && this.cancionId !== null) {
                this.cancionService.updateCancion(this.cancionId, cancion).subscribe({
                    next: () => {
                        console.log('Canción actualizada con éxito');
                        this.router.navigate(['/canciones']); // Redirigir a la lista
                    },
                    error: (err) => console.error('Error al actualizar canción:', err)
                });
            } else {
                this.cancionService.createCancion(cancion).subscribe({
                    next: () => {
                        console.log('Canción creada con éxito');
                        this.router.navigate(['/canciones']); // Redirigir a la lista
                    },
                    error: (err) => console.error('Error al crear canción:', err)
                });
            }
        }
    }
}
