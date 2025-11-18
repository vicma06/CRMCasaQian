import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private reservas: Reserva[] = [
    {
      id: 1,
      clienteId: 1,
      nombreCliente: 'María García López',
      fecha: new Date('2024-11-20'),
      hora: '20:00',
      numeroPersonas: 4,
      mesaId: 5,
      estado: 'confirmada',
      notas: 'Mesa junto a la ventana si es posible'
    },
    {
      id: 2,
      clienteId: 2,
      nombreCliente: 'Juan Martínez Ruiz',
      fecha: new Date('2024-11-19'),
      hora: '21:30',
      numeroPersonas: 2,
      mesaId: 2,
      estado: 'pendiente'
    },
    {
      id: 3,
      clienteId: 3,
      nombreCliente: 'Ana Fernández Soto',
      fecha: new Date('2024-11-21'),
      hora: '19:00',
      numeroPersonas: 6,
      estado: 'confirmada',
      notas: 'Celebración de cumpleaños'
    }
  ];

  private nextId = 4;

  constructor() { }

  getReservas(): Reserva[] {
    return [...this.reservas];
  }

  getReservaById(id: number): Reserva | undefined {
    return this.reservas.find(r => r.id === id);
  }

  getReservasPorCliente(clienteId: number): Reserva[] {
    return this.reservas.filter(r => r.clienteId === clienteId);
  }

  getReservasPorFecha(fecha: Date): Reserva[] {
    return this.reservas.filter(r => 
      r.fecha.toDateString() === fecha.toDateString()
    );
  }

  addReserva(reserva: Omit<Reserva, 'id'>): Reserva {
    const nuevaReserva: Reserva = {
      ...reserva,
      id: this.nextId++
    };
    this.reservas.push(nuevaReserva);
    return nuevaReserva;
  }

  updateReserva(id: number, reserva: Partial<Reserva>): boolean {
    const index = this.reservas.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reservas[index] = { ...this.reservas[index], ...reserva };
      return true;
    }
    return false;
  }

  deleteReserva(id: number): boolean {
    const index = this.reservas.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reservas.splice(index, 1);
      return true;
    }
    return false;
  }

  getReservasHoy(): Reserva[] {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return this.reservas.filter(r => {
      const fechaReserva = new Date(r.fecha);
      fechaReserva.setHours(0, 0, 0, 0);
      return fechaReserva.getTime() === hoy.getTime();
    });
  }
}
