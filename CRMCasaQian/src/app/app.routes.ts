import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClienteFormComponent } from './components/cliente-form/cliente-form.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { ReservaFormComponent } from './components/reserva-form/reserva-form.component';
import { ProductosComponent } from './components/productos/productos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/nuevo', component: ClienteFormComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'reservas/nueva', component: ReservaFormComponent },
  { path: 'productos', component: ProductosComponent },
  { path: '**', redirectTo: '/dashboard' }
];
