import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './services/AuthService';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        CommonModule
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'ListasReproduccionQuipuxFrontend';

    constructor(public authService: AuthService, private router: Router) { } // Inyectar AuthService y Router

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']); // Redirigir a la página de login después de logout
    }
}
