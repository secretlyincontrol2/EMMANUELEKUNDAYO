import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../services/mock-data';

@Component({
  selector: 'app-xai-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './xai-detail.html',
  styleUrl: './xai-detail.css'
})
export class XaiDetail implements OnInit {
  shapFeatures: any[] = [];
  limeExplanation: any;
  emp: any;
  activeTab = 'shap';

  constructor(private mockData: MockDataService) { }

  ngOnInit() {
    this.emp = this.mockData.getCurrentEmployee();
    this.shapFeatures = [...this.mockData.shapFeatures].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    this.limeExplanation = this.mockData.limeExplanation;
  }

  getBarWidth(val: number): number {
    return Math.min(Math.abs(val) / 0.25 * 100, 100);
  }

  getWaterfallWidth(impact: number): string {
    return Math.abs(impact) * 10 + '%';
  }
}
