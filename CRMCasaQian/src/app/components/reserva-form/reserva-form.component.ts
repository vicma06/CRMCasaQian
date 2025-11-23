import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Reserva } from '../../models/reserva.model';
import { Cliente } from '../../models/cliente.model';
import { ReservaService } from '../../services/reserva.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-form.component.html',
  styleUrl: './reserva-form.component.css'
})
export class ReservaFormComponent implements OnInit {
  reserva: Partial<Reserva> = {
    clienteId: 0,
    fecha: new Date(),
    hora: '',
    numeroPersonas: 2,
    estado: 'pendiente',
    notas: ''
  };

  clientes: Cliente[] = [];

  constructor(
    private reservaService: ReservaService,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clienteService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  guardarReserva() {
    if (this.validarFormulario()) {
      const cliente = this.clientes.find(c => c.id === Number(this.reserva.clienteId));
      const reservaCompleta = {
        ...this.reserva,
        clienteId: Number(this.reserva.clienteId),
        nombreCliente: cliente ? `${cliente.nombre} ${cliente.apellidos}` : ''
      };
      
      this.reservaService.addReserva(reservaCompleta as Omit<Reserva, 'id'>).subscribe(() => {
        alert('Reserva creada exitosamente');
        this.router.navigate(['/reservas']);
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.reserva.clienteId || this.reserva.clienteId === 0) {
      alert('Por favor, selecciona un cliente');
      return false;
    }
    if (!this.reserva.fecha) {
      alert('Por favor, selecciona una fecha');
      return false;
    }
    if (!this.reserva.hora) {
      alert('Por favor, selecciona una hora');
      return false;
    }
    if (!this.reserva.numeroPersonas || this.reserva.numeroPersonas < 1) {
      alert('Por favor, ingresa el número de personas');
      return false;
    }
    return true;
  }

  cancelar() {
    this.router.navigate(['/reservas']);
  }
}
