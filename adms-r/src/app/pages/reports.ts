import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../services/mock-data';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  checklist: any[] = [];
  fairnessMetrics: any[] = [];
  modelMetrics: any;

  constructor(private mockData: MockDataService) { }

  ngOnInit() {
    this.checklist = this.mockData.complianceChecklist;
    this.fairnessMetrics = this.mockData.fairnessMetrics;
    this.modelMetrics = this.mockData.modelMetrics;
  }

  get doneCount(): number {
    return this.checklist.filter(c => c.status === 'done').length;
  }

  get totalCount(): number {
    return this.checklist.length;
  }

  get compliancePercent(): number {
    return Math.round((this.doneCount / this.totalCount) * 100);
  }
}
