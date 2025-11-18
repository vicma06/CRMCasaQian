import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Reserva } from '../../models/reserva.model';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  filtroEstado: string = 'todas';

  constructor(private reservaService: ReservaService) {}

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    this.reservas = this.reservaService.getReservas();
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    const todasReservas = this.reservaService.getReservas();
    if (this.filtroEstado === 'todas') {
      this.reservas = todasReservas;
    } else {
      this.reservas = todasReservas.filter(r => r.estado === this.filtroEstado);
    }
  }

  cambiarEstado(id: number, nuevoEstado: string) {
    this.reservaService.updateReserva(id, { estado: nuevoEstado as any });
    this.cargarReservas();
  }

  eliminarReserva(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      this.reservaService.deleteReserva(id);
      this.cargarReservas();
    }
  }
}
