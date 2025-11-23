import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  addCliente(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  updateCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarClientes(termino: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/search?term=${termino}`);
  }

  getClientesVIP(): Observable<Cliente[]> {
    // This endpoint might need to be implemented in backend or filtered here
    // For now, let's filter in frontend or assume backend has an endpoint
    // Let's just get all and filter for now to match previous behavior if backend doesn't support it directly
    // But better to use query param if possible. I'll stick to getAll for now and filter in component if needed, 
    // or add a specific endpoint.
    // Let's assume we filter in the component for simplicity or add a query param.
    return this.http.get<Cliente[]>(this.apiUrl); 
  }
}
