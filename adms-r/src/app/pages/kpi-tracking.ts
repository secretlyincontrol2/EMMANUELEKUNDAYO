import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../services/mock-data';

declare var Chart: any;

@Component({
  selector: 'app-kpi-tracking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-tracking.html',
  styleUrl: './kpi-tracking.css'
})
export class KpiTracking implements OnInit, AfterViewInit {
  kpis: any[] = [];
  categories: string[] = [];
  selectedCategory = 'All';
  avgProgress = 0;
  completedCount = 0;

  // Attendance heatmap data
  heatmapWeeks: number[][] = [];

  constructor(private mockData: MockDataService) { }

  ngOnInit() {
    this.kpis = this.mockData.kpis;
    this.categories = ['All', ...new Set(this.kpis.map(k => k.category))];
    this.avgProgress = Math.round(this.kpis.reduce((s, k) => s + k.progress, 0) / this.kpis.length);
    this.completedCount = this.kpis.filter(k => k.progress >= 100).length;

    // Generate mock heatmap
    for (let w = 0; w < 8; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        week.push(Math.floor(Math.random() * 5));
      }
      this.heatmapWeeks.push(week);
    }
  }

  ngAfterViewInit() {
    this.renderCategoryChart();
  }

  get filteredKpis() {
    if (this.selectedCategory === 'All') return this.kpis;
    return this.kpis.filter(k => k.category === this.selectedCategory);
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }

  renderCategoryChart() {
    const ctx = document.getElementById('kpiCategoryChart') as any;
    if (!ctx) return;
    const cats = [...new Set(this.kpis.map(k => k.category))];
    const avgs = cats.map(c => {
      const items = this.kpis.filter(k => k.category === c);
      return Math.round(items.reduce((s, k) => s + k.progress, 0) / items.length);
    });
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cats,
        datasets: [{
          label: 'Avg Progress',
          data: avgs,
          backgroundColor: 'rgba(255,255,255,0.35)',
          borderRadius: 4,
          barThickness: 36,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#111', titleColor: '#fff', bodyColor: '#aaa', borderColor: '#333', borderWidth: 1 } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#777', font: { family: 'Inter', size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#777', font: { family: 'Inter', size: 10 } }, min: 0, max: 100 }
        }
      }
    });
  }

  getHeatLevel(val: number): string {
    return 'level-' + val;
  }
}
