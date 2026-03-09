import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDataService } from '../services/mock-data';

declare var Chart: any;

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css'
})
export class EmployeeDashboard implements OnInit, AfterViewInit {
  emp: any = { name: '', overallScore: 0, kpiScore: 0, sentimentScore: 0, attendance: 0, initials: '', riskLevel: 'low', trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
  feedbacks: any[] = [];
  kpis: any[] = [];
  shapFeatures: any[] = [];
  circumference = 2 * Math.PI * 58;
  dashOffset = 0;
  showUpdateModal = false;
  updateForm = { kpi: 0, attendance: 0, research: 0 };

  constructor(public mockData: MockDataService, private router: Router) { }

  async ngOnInit() {
    await this.mockData.loadEmployees();
    this.emp = this.mockData.getCurrentEmployee();
    this.feedbacks = this.mockData.feedbacks;
    this.kpis = this.mockData.kpis;
    this.shapFeatures = this.mockData.shapFeatures;
    this.dashOffset = this.circumference - (this.emp.overallScore / 100) * this.circumference;

    this.updateForm = {
      kpi: this.emp.kpiScore,
      attendance: this.emp.attendance,
      research: 5
    };
  }

  ngAfterViewInit() {
    this.renderTrendChart();
  }

  renderTrendChart() {
    const ctx = document.getElementById('empTrendChart') as any;
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.mockData.months,
        datasets: [
          {
            label: 'Overall Score',
            data: this.emp.trend,
            borderColor: '#ffffff',
            backgroundColor: 'rgba(255,255,255,0.05)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#000',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
          {
            label: 'Sentiment',
            data: [60, 62, 65, 63, 67, 70, 71, 72, 73, 74, 75, 76],
            borderColor: '#888888',
            backgroundColor: 'rgba(136,136,136,0.05)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#000',
            pointBorderColor: '#888',
            pointBorderWidth: 2,
            borderDash: [5, 5],
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' as const, labels: { color: '#999', font: { family: 'Inter', size: 11 }, boxWidth: 12, padding: 16 } },
          tooltip: { backgroundColor: '#111', titleColor: '#fff', bodyColor: '#aaa', borderColor: '#333', borderWidth: 1, padding: 10, cornerRadius: 6 }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#777', font: { family: 'Inter', size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#777', font: { family: 'Inter', size: 10 } }, min: 50, max: 100 }
        }
      }
    });
  }

  goTo(page: string) { this.router.navigate([page]); }

  getBarWidth(value: number): number {
    return Math.abs(value) / 0.25 * 100;
  }

  async submitMetrics() {
    this.emp.kpiScore = this.updateForm.kpi;
    this.emp.attendance = this.updateForm.attendance;

    try {
      const token = localStorage.getItem('adms_token');
      const res = await fetch(`http://127.0.0.1:8081/api/ml/predict?kpi=${this.updateForm.kpi}&sentiment=${this.emp.sentimentScore}&attendance=${this.updateForm.attendance}&research=${this.updateForm.research}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();

        // Update UI with real prediction from backend
        this.emp.overallScore = Math.round(data.score);
        this.dashOffset = this.circumference - (this.emp.overallScore / 100) * this.circumference;

        // Parse and display SHAP features from backend if available
        if (data.shap_json) {
          try {
            this.shapFeatures = JSON.parse(data.shap_json);
          } catch (e) {
            console.error("Failed to parse SHAP", e);
          }
        }

        // Add point to trend
        this.emp.trend.shift();
        this.emp.trend.push(this.emp.overallScore);
        this.renderTrendChart(); // Re-render
      } else {
        alert("Failed to calculate prediction using AI model");
      }
    } catch (e) {
      console.error(e);
      alert("Network error reaching ML backend");
    }

    this.showUpdateModal = false;
  }
}
