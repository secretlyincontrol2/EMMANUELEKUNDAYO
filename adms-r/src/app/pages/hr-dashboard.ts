import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MockDataService } from '../services/mock-data';

declare var Chart: any;

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hr-dashboard.html',
  styleUrl: './hr-dashboard.css'
})
export class HrDashboard implements OnInit, AfterViewInit {
  totalEmployees = 0;
  orgAvgScore = 0;
  fairnessMetrics: any[] = [];
  modelMetrics: any;
  departments: any[] = [];

  constructor(public mockData: MockDataService, private router: Router) { }

  async ngOnInit() {
    await this.mockData.loadEmployees();
    const all = this.mockData.getAllEmployees();
    this.totalEmployees = all.length;
    this.orgAvgScore = Math.round(all.reduce((s, e) => s + e.overallScore, 0) / all.length);
    this.fairnessMetrics = this.mockData.fairnessMetrics;
    this.modelMetrics = this.mockData.modelMetrics;
    this.departments = this.mockData.departmentScores;
  }

  ngAfterViewInit() {
    this.renderDistribution();
    this.renderDeptChart();
  }

  renderDistribution() {
    const ctx = document.getElementById('orgDistChart') as any;
    if (!ctx) return;
    const scores = this.mockData.getAllEmployees().map(e => e.overallScore);
    const bins = [0, 0, 0, 0, 0];
    scores.forEach(s => {
      if (s >= 90) bins[4]++;
      else if (s >= 80) bins[3]++;
      else if (s >= 70) bins[2]++;
      else if (s >= 60) bins[1]++;
      else bins[0]++;
    });
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['<60', '60-69', '70-79', '80-89', '90+'],
        datasets: [{
          label: 'Employees',
          data: bins,
          backgroundColor: 'rgba(255,255,255,0.4)',
          borderRadius: 4,
          barThickness: 36,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#111', titleColor: '#fff', bodyColor: '#aaa', borderColor: '#333', borderWidth: 1, padding: 10, cornerRadius: 6 } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#777', font: { family: 'Inter', size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#777', font: { family: 'Inter', size: 10 }, stepSize: 1 }, beginAtZero: true }
        }
      }
    });
  }

  renderDeptChart() {
    const ctx = document.getElementById('deptBarChart') as any;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.departments.map(d => d.dept),
        datasets: [{
          label: 'Avg Score',
          data: this.departments.map(d => d.avgScore),
          backgroundColor: 'rgba(255,255,255,0.35)',
          borderRadius: 4,
          barThickness: 28,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, indexAxis: 'y' as const,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#111', titleColor: '#fff', bodyColor: '#aaa', borderColor: '#333', borderWidth: 1 } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#777', font: { family: 'Inter', size: 10 } }, min: 0, max: 100 },
          y: { grid: { display: false }, ticks: { color: '#999', font: { family: 'Inter', size: 11 } } }
        }
      }
    });
  }

  goTo(page: string) { this.router.navigate([page]); }
}
