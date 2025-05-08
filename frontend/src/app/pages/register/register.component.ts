import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User, RegisterResponse } from '../../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userData: Partial<User> = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.apiService.register(userData).subscribe({
      next: (response: RegisterResponse) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert('Registration failed: ' + error.message);
      }
    });
  }
}
