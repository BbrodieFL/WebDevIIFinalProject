import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, RegisterData } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule]
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

    const registerData: RegisterData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.apiService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed: ' + error.message);
      }
    });
  }
}