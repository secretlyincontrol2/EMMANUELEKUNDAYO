import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockDataService, Employee } from '../services/mock-data';

declare var Chart: any;

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css'
})
export class ManagerDashboard implements OnInit, AfterViewInit {
  teamMembers: Employee[] = [];
  avgScore = 0;
  atRiskCount = 0;
  topPerformer: Employee | null = null;

  constructor(public mockData: MockDataService, private router: Router) { }

  async ngOnInit() {
    await this.mockData.loadEmployees();
    this.teamMembers = this.mockData.getTeamEmployees();
    this.avgScore = Math.round(this.teamMembers.reduce((s, e) => s + e.overallScore, 0) / this.teamMembers.length);
    this.atRiskCount = this.teamMembers.filter(e => e.riskLevel === 'high').length;
    this.topPerformer = this.teamMembers.reduce((best, e) => e.overallScore > best.overallScore ? e : best, this.teamMembers[0]);
  }

  ngAfterViewInit() {
    this.renderDistChart();
    this.renderRadarChart();
  }

  renderDistChart() {
    const ctx = document.getElementById('teamDistChart') as any;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.teamMembers.map(e => e.name.split('.')[1]?.trim() || e.name),
        datasets: [{
          label: 'Score',
          data: this.teamMembers.map(e => e.overallScore),
          backgroundColor: this.teamMembers.map(e => e.riskLevel === 'high' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)'),
          borderRadius: 4,
          barThickness: 28,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#111', titleColor: '#fff', bodyColor: '#aaa', borderColor: '#333', borderWidth: 1, padding: 10, cornerRadius: 6 } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#777', font: { family: 'Inter', size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#777', font: { family: 'Inter', size: 10 } }, min: 0, max: 100 }
        }
      }
    });
  }

  renderRadarChart() {
    const ctx = document.getElementById('teamRadarChart') as any;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['KPI', 'Sentiment', 'Attendance', 'Research', 'Teaching', 'Service'],
        datasets: [{
          label: 'Team Average',
          data: [78, 68, 90, 72, 85, 65],
          borderColor: '#ffffff',
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#000',
          pointBorderColor: '#fff',
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            angleLines: { color: 'rgba(255,255,255,0.06)' },
            pointLabels: { color: '#999', font: { family: 'Inter', size: 11 } },
            ticks: { color: '#555', backdropColor: 'transparent', font: { size: 9 } },
            suggestedMin: 0, suggestedMax: 100,
          }
        }
      }
    });
  }

  goTo(page: string) { this.router.navigate([page]); }

  getRiskClass(level: string): string {
    if (level === 'high') return 'risk-high';
    if (level === 'medium') return 'risk-med';
    return 'risk-low';
  }
}
