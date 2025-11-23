import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { ReservaService } from '../../services/reserva.service';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';

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
    private pedidoService: PedidoService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.isAdmin()) {
      this.cargarEstadisticas();
    }
  }

  cargarEstadisticas() {
    this.clienteService.getClientes().subscribe(clientes => {
      this.totalClientes = clientes.length;
      this.clientesVIP = clientes.filter(c => c.vip).length;
    });

    this.reservaService.getReservasHoy().subscribe(reservas => {
      this.reservasHoy = reservas.length;
      this.ultimasReservas = reservas.slice(0, 5);
    });

    this.pedidoService.getPedidosHoy().subscribe(pedidos => {
      this.pedidosHoy = pedidos.length;
      this.ventasHoy = pedidos.reduce((total, p) => total + p.total, 0);
      this.ultimosPedidos = pedidos.slice(0, 5);
    });
  }
}
