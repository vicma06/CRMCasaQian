import { Injectable } from '@angular/core';
import { Pedido, PedidoItem } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private pedidos: Pedido[] = [
    {
      id: 1,
      clienteId: 1,
      nombreCliente: 'María García López',
      fecha: new Date('2024-11-18'),
      items: [
        { productoId: 1, nombreProducto: 'Ternera en lonchas finas', cantidad: 2, precioUnitario: 12.80, subtotal: 25.60 },
        { productoId: 13, nombreProducto: 'Caldo de Sichuan picante', cantidad: 1, precioUnitario: 8.90, subtotal: 8.90 },
        { productoId: 5, nombreProducto: 'Gambas frescas', cantidad: 1, precioUnitario: 15.90, subtotal: 15.90 }
      ],
      total: 50.40,
      estado: 'servido',
      mesaId: 3,
      metodoPago: 'Tarjeta'
    },
    {
      id: 2,
      clienteId: 2,
      nombreCliente: 'Juan Martínez Ruiz',
      fecha: new Date('2024-11-18'),
      items: [
        { productoId: 4, nombreProducto: 'Pollo tierno', cantidad: 1, precioUnitario: 9.80, subtotal: 9.80 },
        { productoId: 14, nombreProducto: 'Caldo de pollo suave', cantidad: 1, precioUnitario: 7.50, subtotal: 7.50 },
        { productoId: 9, nombreProducto: 'Mix de setas', cantidad: 2, precioUnitario: 7.50, subtotal: 15.00 }
      ],
      total: 32.30,
      estado: 'preparando',
      mesaId: 7
    }
  ];

  private nextId = 3;

  constructor() { }

  getPedidos(): Pedido[] {
    return [...this.pedidos];
  }

  getPedidoById(id: number): Pedido | undefined {
    return this.pedidos.find(p => p.id === id);
  }

  getPedidosPorCliente(clienteId: number): Pedido[] {
    return this.pedidos.filter(p => p.clienteId === clienteId);
  }

  addPedido(pedido: Omit<Pedido, 'id'>): Pedido {
    const nuevoPedido: Pedido = {
      ...pedido,
      id: this.nextId++
    };
    this.pedidos.push(nuevoPedido);
    return nuevoPedido;
  }

  updatePedido(id: number, pedido: Partial<Pedido>): boolean {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.pedidos[index] = { ...this.pedidos[index], ...pedido };
      return true;
    }
    return false;
  }

  deletePedido(id: number): boolean {
    const index = this.pedidos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.pedidos.splice(index, 1);
      return true;
    }
    return false;
  }

  getPedidosHoy(): Pedido[] {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return this.pedidos.filter(p => {
      const fechaPedido = new Date(p.fecha);
      fechaPedido.setHours(0, 0, 0, 0);
      return fechaPedido.getTime() === hoy.getTime();
    });
  }

  calcularTotalPedido(items: PedidoItem[]): number {
    return items.reduce((total, item) => total + item.subtotal, 0);
  }
}
