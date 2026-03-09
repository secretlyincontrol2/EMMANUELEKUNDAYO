import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDataService } from '../services/mock-data';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  isSignup = false;

  formData = {
    email: '',
    password: '',
    fullName: '',
    role: 'employee',
    age: null,
    gender: '',
    ethnicity: ''
  };

  constructor(private mockData: MockDataService, private router: Router) { }

  toggleMode() {
    this.isSignup = !this.isSignup;
  }

  async submit() {
    const isStudent = this.formData.role === 'student';
    const isEmp = this.formData.role === 'employee' || this.formData.role === 'Employee / Lecturer';
    const isMan = this.formData.role === 'manager' || this.formData.role.toLowerCase().includes('manager');
    const apiRole = isStudent ? 'student' : (isEmp ? 'employee' : (isMan ? 'manager' : 'hr'));

    try {
      if (this.isSignup) {
        const res = await fetch('http://127.0.0.1:8081/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.formData.email,
            password: this.formData.password,
            full_name: this.formData.fullName,
            role: apiRole,
            department: 'Computer Science',
            age: this.formData.age || 30,
            gender: this.formData.gender || 'Unknown',
            ethnicity: this.formData.ethnicity || 'Unknown'
          })
        });
        if (!res.ok) {
          const err = await res.json();
          alert('Signup failed: ' + err.detail);
          return;
        }
      }

      const body = new URLSearchParams();
      body.append('username', this.formData.email);
      body.append('password', this.formData.password);

      const loginRes = await fetch('http://127.0.0.1:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });

      if (!loginRes.ok) {
        alert('Login failed. Check your credentials.');
        return;
      }

      const data = await loginRes.json();
      localStorage.setItem('adms_token', data.access_token);
      localStorage.setItem('adms_email', data.user.email);

      const userRole = data.user.role;
      this.mockData.currentRole = userRole;

      await this.mockData.loadEmployees();

      if (userRole === 'student') this.router.navigate(['/feedback-form']);
      else if (userRole === 'employee') this.router.navigate(['/employee-dashboard']);
      else if (userRole === 'manager') this.router.navigate(['/manager-dashboard']);
      else this.router.navigate(['/hr-dashboard']);

    } catch (e) {
      console.error(e);
      alert('Network error communicating with backend.');
    }
  }
}
