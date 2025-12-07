import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-brand-light">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-brand-gold">
        <div class="text-center mb-6">
          <img src="/images/CasaQianLogo.png" alt="Casa Qian Logo" class="h-24 w-24 mx-auto rounded-full border-2 border-brand-gold shadow-sm object-cover mb-4">
          <h2 class="text-2xl font-bold text-brand-blue mb-2">Iniciar Sesión</h2>
          <p class="text-gray-600">CRM Casa Qian</p>
        </div>
        
        <form (ngSubmit)="onSubmit()">
          <div class="mb-6">
            <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Usuario</label>
            <input 
              type="text" 
              id="username" 
              [(ngModel)]="credentials.username" 
              name="username" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold"
              placeholder="Ingresa tu usuario">
          </div>
          
          <div class="mb-6">
            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="credentials.password" 
              name="password" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold"
              placeholder="Ingresa tu contraseña">
          </div>

          <div *ngIf="error" class="text-brand-red text-center mb-4 text-sm font-semibold">
            {{ error }}
          </div>

          <button type="submit" [disabled]="loading" class="w-full bg-brand-red text-white font-bold py-2 px-4 rounded hover:bg-red-900 transition duration-300 disabled:bg-gray-400 shadow-md">
            {{ loading ? 'Cargando...' : 'Entrar' }}
          </button>

          <div class="mt-4 text-center text-sm text-gray-600">
            <p>¿No tienes cuenta? <a routerLink="/register" class="text-brand-blue hover:text-brand-gold font-semibold transition-colors">Crear una cuenta</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    console.log('Intentando login con:', this.credentials);
    
    this.authService.login(this.credentials).subscribe({
      next: (user) => {
        console.log('Login exitoso:', user);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.error = 'Usuario o contraseña incorrectos. Revisa la consola para más detalles.';
        this.loading = false;
      }
    });
  }
}
