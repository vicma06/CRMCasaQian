import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes: Cliente[] = [
    {
      id: 1,
      nombre: 'María',
      apellidos: 'García López',
      email: 'maria.garcia@email.com',
      telefono: '612345678',
      fechaRegistro: new Date('2024-01-15'),
      visitasTotales: 12,
      gastoTotal: 456.80,
      preferencias: 'Picante, sin cerdo',
      vip: true,
      notas: 'Cliente frecuente, le gusta el caldo de Sichuan'
    },
    {
      id: 2,
      nombre: 'Juan',
      apellidos: 'Martínez Ruiz',
      email: 'juan.martinez@email.com',
      telefono: '623456789',
      fechaRegistro: new Date('2024-03-20'),
      visitasTotales: 5,
      gastoTotal: 198.50,
      vip: false,
      notas: 'Alérgico a mariscos'
    },
    {
      id: 3,
      nombre: 'Ana',
      apellidos: 'Fernández Soto',
      email: 'ana.fernandez@email.com',
      telefono: '634567890',
      fechaRegistro: new Date('2024-06-10'),
      visitasTotales: 8,
      gastoTotal: 312.40,
      preferencias: 'Vegetariano',
      vip: false
    }
  ];

  private nextId = 4;

  constructor() { }

  getClientes(): Cliente[] {
    return [...this.clientes];
  }

  getClienteById(id: number): Cliente | undefined {
    return this.clientes.find(c => c.id === id);
  }

  addCliente(cliente: Omit<Cliente, 'id'>): Cliente {
    const nuevoCliente: Cliente = {
      ...cliente,
      id: this.nextId++
    };
    this.clientes.push(nuevoCliente);
    return nuevoCliente;
  }

  updateCliente(id: number, cliente: Partial<Cliente>): boolean {
    const index = this.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clientes[index] = { ...this.clientes[index], ...cliente };
      return true;
    }
    return false;
  }

  deleteCliente(id: number): boolean {
    const index = this.clientes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clientes.splice(index, 1);
      return true;
    }
    return false;
  }

  buscarClientes(termino: string): Cliente[] {
    const terminoLower = termino.toLowerCase();
    return this.clientes.filter(c => 
      c.nombre.toLowerCase().includes(terminoLower) ||
      c.apellidos.toLowerCase().includes(terminoLower) ||
      c.email.toLowerCase().includes(terminoLower) ||
      c.telefono.includes(termino)
    );
  }

  getClientesVIP(): Cliente[] {
    return this.clientes.filter(c => c.vip);
  }
}
