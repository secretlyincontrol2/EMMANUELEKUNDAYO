import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockDataService } from '../services/mock-data';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private mockData: MockDataService, private router: Router) { }

  selectRole(role: 'employee' | 'manager' | 'hr') {
    this.mockData.currentRole = role;
    if (role === 'employee') this.router.navigate(['/employee-dashboard']);
    else if (role === 'manager') this.router.navigate(['/manager-dashboard']);
    else this.router.navigate(['/hr-dashboard']);
  }
}
