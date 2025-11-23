import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) { }

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  getReservaById(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  getReservasPorCliente(clienteId: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  getReservasPorFecha(fecha: Date): Observable<Reserva[]> {
    const fechaStr = fecha.toISOString().split('T')[0];
    return this.http.get<Reserva[]>(`${this.apiUrl}/fecha/${fechaStr}`);
  }

  addReserva(reserva: Omit<Reserva, 'id'>): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  updateReserva(id: number, reserva: Partial<Reserva>): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}`, reserva);
  }

  deleteReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getReservasHoy(): Observable<Reserva[]> {
    const hoy = new Date();
    const fechaStr = hoy.toISOString().split('T')[0];
    return this.http.get<Reserva[]>(`${this.apiUrl}/fecha/${fechaStr}`);
  }
}
