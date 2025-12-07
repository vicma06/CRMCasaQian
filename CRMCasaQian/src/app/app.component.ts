import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CRM Casa Qian';
  menuAbierto = false;

  constructor(public authService: AuthService) {}

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  logout() {
    this.authService.logout();
    this.menuAbierto = false;
  }
}
