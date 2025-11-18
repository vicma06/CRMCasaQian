import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  terminoBusqueda = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clientes = this.clienteService.getClientes();
    this.clientesFiltrados = this.clientes;
  }

  buscarClientes(event: Event) {
    const termino = (event.target as HTMLInputElement).value;
    this.terminoBusqueda = termino;
    
    if (termino.trim() === '') {
      this.clientesFiltrados = this.clientes;
    } else {
      this.clientesFiltrados = this.clienteService.buscarClientes(termino);
    }
  }

  eliminarCliente(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      this.clienteService.deleteCliente(id);
      this.cargarClientes();
    }
  }
}
