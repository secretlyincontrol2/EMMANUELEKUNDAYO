import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MockDataService } from '../services/mock-data';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  constructor(public mockData: MockDataService, private router: Router) { }

  get navItems() {
    const role = this.mockData.currentRole;
    if (role === 'student') {
      return {
        main: [
          { page: '/feedback-form', label: 'Give Feedback', icon: '◫' },
        ],
        analysis: [] as any[],
        governance: [] as any[]
      };
    } else if (role === 'employee') {
      return {
        main: [
          { page: '/employee-dashboard', label: 'Dashboard', icon: '◉' },
          { page: '/kpi-tracking', label: 'My KPIs', icon: '◎' },
          { page: '/feedback-form', label: 'Give Feedback', icon: '◫' },
        ],
        analysis: [
          { page: '/xai-detail', label: 'Score Explanation', icon: '◈' },
        ],
        governance: [] as any[]
      };
    } else if (role === 'manager') {
      return {
        main: [
          { page: '/manager-dashboard', label: 'Team Overview', icon: '◉' },
          { page: '/employee-dashboard', label: 'My Dashboard', icon: '◎' },
          { page: '/feedback-form', label: 'Submit Review', icon: '◫' },
        ],
        analysis: [
          { page: '/kpi-tracking', label: 'Team KPIs', icon: '◎' },
          { page: '/xai-detail', label: 'Score Explanation', icon: '◈' },
        ],
        governance: [] as any[]
      };
    } else {
      return {
        main: [
          { page: '/hr-dashboard', label: 'HR Analytics', icon: '◉' },
          { page: '/manager-dashboard', label: 'Departments', icon: '◎' },
          { page: '/feedback-form', label: 'Feedback Forms', icon: '◫' },
        ],
        analysis: [
          { page: '/kpi-tracking', label: 'All KPIs', icon: '◎' },
          { page: '/xai-detail', label: 'XAI Audit', icon: '◈' },
        ],
        governance: [
          { page: '/reports', label: 'Compliance Reports', icon: '◧' },
        ]
      };
    }
  }

  get userName() {
    const emp = this.mockData.getCurrentEmployee();
    return emp?.name || 'User';
  }

  get userRole() {
    const emp = this.mockData.getCurrentEmployee();
    return emp?.role || this.mockData.currentRole || 'Employee';
  }

  get userInitials() {
    const emp = this.mockData.getCurrentEmployee();
    if (emp?.initials) return emp.initials;
    if (emp?.name) {
      const parts = emp.name.split(' ');
      return parts.map((p: string) => p[0]).join('').toUpperCase().substring(0, 2);
    }
    return 'U';
  }

  logout() {
    this.mockData.currentRole = null;
    this.router.navigate(['/login']);
  }

  isActive(page: string): boolean {
    return this.router.url === page;
  }
}
