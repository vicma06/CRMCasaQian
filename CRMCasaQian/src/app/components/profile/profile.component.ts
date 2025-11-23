import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  message: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      nombre: [''],
      apellidos: [''],
      email: ['', [Validators.email]],
      telefono: [''],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser && this.currentUser.cliente) {
      this.profileForm.patchValue({
        nombre: this.currentUser.cliente.nombre,
        apellidos: this.currentUser.cliente.apellidos,
        email: this.currentUser.cliente.email,
        telefono: this.currentUser.cliente.telefono
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid || !this.currentUser) return;

    const updateData = this.profileForm.value;
    // Remove empty password if not changed
    if (!updateData.password) {
      delete updateData.password;
    }

    this.authService.updateProfile(this.currentUser.id, updateData).subscribe({
      next: (user) => {
        this.message = 'Perfil actualizado correctamente';
        this.error = '';
        this.currentUser = user;
        this.profileForm.patchValue({ password: '' }); // Clear password field
      },
      error: (err) => {
        this.error = 'Error al actualizar perfil';
        this.message = '';
      }
    });
  }
}
