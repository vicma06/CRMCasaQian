import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Reserva } from '../../models/reserva.model';
import { ReservaService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  todasReservas: Reserva[] = [];
  filtroEstado: string = 'todas';

  constructor(
    private reservaService: ReservaService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    if (this.authService.isAdmin()) {
      this.reservaService.getReservas().subscribe(reservas => {
        this.todasReservas = reservas;
        this.aplicarFiltro();
      });
    } else {
      const currentUser = this.authService.currentUserValue;
      if (currentUser && currentUser.cliente) {
        this.reservaService.getReservasPorCliente(currentUser.cliente.id).subscribe(reservas => {
          this.todasReservas = reservas;
          this.aplicarFiltro();
        });
      }
    }
  }

  aplicarFiltro() {
    if (this.filtroEstado === 'todas') {
      this.reservas = this.todasReservas;
    } else {
      this.reservas = this.todasReservas.filter(r => r.estado === this.filtroEstado);
    }
  }

  cambiarEstado(id: number, nuevoEstado: string) {
    this.reservaService.updateReserva(id, { estado: nuevoEstado as any }).subscribe(() => {
      this.cargarReservas();
    });
  }

  eliminarReserva(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      this.reservaService.deleteReserva(id).subscribe(() => {
        this.cargarReservas();
      });
    }
  }
}
