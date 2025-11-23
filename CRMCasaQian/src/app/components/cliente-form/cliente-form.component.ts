import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.css'
})
export class ClienteFormComponent implements OnInit {
  cliente: Partial<Cliente> = {
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    fechaRegistro: new Date(),
    visitasTotales: 0,
    gastoTotal: 0,
    preferencias: '',
    notas: '',
    vip: false
  };

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit() {}

  guardarCliente() {
    if (this.validarFormulario()) {
      this.clienteService.addCliente(this.cliente as Omit<Cliente, 'id'>).subscribe(() => {
        alert('Cliente registrado exitosamente');
        this.router.navigate(['/clientes']);
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.cliente.nombre || !this.cliente.apellidos) {
      alert('Por favor, ingresa el nombre y apellidos del cliente');
      return false;
    }
    if (!this.cliente.email) {
      alert('Por favor, ingresa el email del cliente');
      return false;
    }
    if (!this.cliente.telefono) {
      alert('Por favor, ingresa el teléfono del cliente');
      return false;
    }
    return true;
  }

  cancelar() {
    this.router.navigate(['/clientes']);
  }
}
