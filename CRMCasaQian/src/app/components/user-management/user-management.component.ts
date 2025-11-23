import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      }
    });
  }

  toggleRole(user: User) {
    const newRole = user.role === 'ADMIN' ? 'CLIENTE' : 'ADMIN';
    if (confirm(`¿Estás seguro de cambiar el rol de ${user.username} a ${newRole}?`)) {
      this.authService.updateRole(user.id, newRole).subscribe({
        next: () => {
          user.role = newRole;
        },
        error: () => {
          alert('Error al actualizar el rol');
        }
      });
    }
  }
}
