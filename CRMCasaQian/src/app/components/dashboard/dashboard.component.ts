import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { ReservaService } from '../../services/reserva.service';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalClientes = 0;
  clientesVIP = 0;
  reservasHoy = 0;
  pedidosHoy = 0;
  ventasHoy = 0;
  ultimasReservas: any[] = [];
  ultimosPedidos: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private reservaService: ReservaService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    const clientes = this.clienteService.getClientes();
    this.totalClientes = clientes.length;
    this.clientesVIP = this.clienteService.getClientesVIP().length;

    const reservasHoy = this.reservaService.getReservasHoy();
    this.reservasHoy = reservasHoy.length;
    this.ultimasReservas = reservasHoy.slice(0, 5);

    const pedidosHoy = this.pedidoService.getPedidosHoy();
    this.pedidosHoy = pedidosHoy.length;
    this.ventasHoy = pedidosHoy.reduce((total, p) => total + p.total, 0);
    this.ultimosPedidos = pedidosHoy.slice(0, 5);
  }
}
