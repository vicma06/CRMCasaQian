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
  todasReservas: Reserva[] = [];
  filtroEstado: string = 'todas';

  constructor(private reservaService: ReservaService) {}

  ngOnInit() {
    this.cargarReservas();
  }

  cargarReservas() {
    this.reservaService.getReservas().subscribe(reservas => {
      this.todasReservas = reservas;
      this.aplicarFiltro();
    });
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
