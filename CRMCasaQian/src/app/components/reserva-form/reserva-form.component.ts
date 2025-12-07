import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Reserva } from '../../models/reserva.model';
import { Cliente } from '../../models/cliente.model';
import { ReservaService } from '../../services/reserva.service';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';

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
    fecha: new Date().toISOString().split('T')[0], // Inicializar como string YYYY-MM-DD
    hora: '',
    numeroPersonas: 2,
    estado: 'pendiente',
    notas: ''
  };

  clientes: Cliente[] = [];
  isEditMode = false;
  reservaId: number | null = null;
  isAdmin = false;

  constructor(
    private reservaService: ReservaService,
    private clienteService: ClienteService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    
    // Cargar clientes solo si es admin, o para tener la lista disponible
    this.clienteService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });

    // Si no es admin, asignar cliente automáticamente
    if (!this.isAdmin) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser && currentUser.cliente) {
        this.reserva.clienteId = currentUser.cliente.id;
      }
    }

    // Comprobar si es edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.reservaId = +params['id'];
        this.cargarReserva(this.reservaId);
      }
    });
  }

  cargarReserva(id: number) {
    this.reservaService.getReservaById(id).subscribe(reserva => {
      this.reserva = { ...reserva };
      // Asegurar que la fecha sea objeto Date para el input date si es necesario, 
      // aunque HTML input date espera string YYYY-MM-DD.
      // Si reserva.fecha viene como string ISO, puede necesitar ajuste.
    });
  }

  guardarReserva() {
    if (this.validarFormulario()) {
      const cliente = this.clientes.find(c => c.id === Number(this.reserva.clienteId));
      // Si no encontramos cliente en la lista (ej. usuario normal), usamos el del usuario actual si coincide
      let nombreCliente = '';
      
      if (cliente) {
        nombreCliente = `${cliente.nombre} ${cliente.apellidos}`;
      } else if (!this.isAdmin && this.authService.currentUserValue?.cliente) {
         const c = this.authService.currentUserValue.cliente;
         nombreCliente = `${c.nombre} ${c.apellidos}`;
      }

      const reservaCompleta = {
        ...this.reserva,
        clienteId: Number(this.reserva.clienteId),
        nombreCliente: nombreCliente || 'Cliente'
      };
      
      if (this.isEditMode && this.reservaId) {
        this.reservaService.updateReserva(this.reservaId, reservaCompleta).subscribe(() => {
          alert('Reserva actualizada exitosamente');
          this.router.navigate(['/reservas']);
        });
      } else {
        this.reservaService.addReserva(reservaCompleta as Omit<Reserva, 'id'>).subscribe(() => {
          alert('Reserva creada exitosamente');
          this.router.navigate(['/reservas']);
        });
      }
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
