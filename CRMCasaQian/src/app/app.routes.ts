import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClienteFormComponent } from './components/cliente-form/cliente-form.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { ReservaFormComponent } from './components/reserva-form/reserva-form.component';
import { ProductosComponent } from './components/productos/productos.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: '', 
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      
      // Admin only routes
      { path: 'users', component: UserManagementComponent, canActivate: [adminGuard] },
      { path: 'clientes', component: ClientesComponent, canActivate: [adminGuard] },
      { path: 'clientes/nuevo', component: ClienteFormComponent, canActivate: [adminGuard] },
      
      // Shared routes (but maybe with different permissions inside)
      { path: 'reservas', component: ReservasComponent },
      { path: 'reservas/nueva', component: ReservaFormComponent },
      { path: 'productos', component: ProductosComponent },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
