import { Component } from '@angular/core';
import { AuthService } from '../../services/AuthService';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { MatInputModule } from '@angular/material/input'; // Importar MatInputModule
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule
import { MatCardModule } from '@angular/material/card'; // Importar MatCardModule
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'], // Usar scss
    standalone: true, // Marcar como standalone
    imports: [FormsModule, MatInputModule, MatButtonModule, MatCardModule, CommonModule] // Importar módulos necesarios
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
