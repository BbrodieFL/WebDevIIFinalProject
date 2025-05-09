import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatCard, MatFormFieldModule, MatInputModule, MatButtonModule, MatError],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router, private api: ApiService) {}

  onSubmit() {
    console.log('Attempting login for:', this.email);
    
    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        
        if (!response.token || !response.user?._id) {
          console.error('Invalid login response:', response);
          this.error = 'Invalid server response';
          return;
        }
        
        // Store auth data
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user._id);
        
        console.log('Auth data stored. Token:', response.token.substring(0, 20) + '...');
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login failed:', error);
        this.error = error.error?.message || 'Invalid email or password';
      }
    });
  }
}
