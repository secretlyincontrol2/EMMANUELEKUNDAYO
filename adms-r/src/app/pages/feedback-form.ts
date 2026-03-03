import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../services/mock-data';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-form.html',
  styleUrl: './feedback-form.css'
})
export class FeedbackForm {
  selectedEmployee = '';
  feedbackType = 'peer';
  qualitativeFeedback = '';
  submitted = false;

  // Competency sliders
  leadership = 3;
  collaboration = 4;
  communication = 3;
  initiative = 3;
  integrity = 4;

  // Likert
  sdaAlignment = 0;

  // Simulated NLP
  sentimentPreview = 'neutral';
  sentimentScore = 0.5;
  sentimentEmoji = '―';

  employees: any[] = [];

  constructor(private mockData: MockDataService) {
    this.employees = this.mockData.getTeamEmployees();
  }

  onTextChange() {
    const text = this.qualitativeFeedback.toLowerCase();
    if (!text || text.length < 10) {
      this.sentimentPreview = 'neutral';
      this.sentimentScore = 0.5;
      this.sentimentEmoji = '―';
      return;
    }
    const posWords = ['excellent', 'great', 'outstanding', 'dedicated', 'reliable', 'strong', 'impressive', 'effective', 'collaborative', 'exceptional', 'wonderful', 'positive', 'good'];
    const negWords = ['poor', 'weak', 'lacking', 'inadequate', 'disappointing', 'insufficient', 'slow', 'inconsistent', 'negligent', 'unprofessional', 'bad', 'terrible'];
    let posCount = 0, negCount = 0;
    posWords.forEach(w => { if (text.includes(w)) posCount++; });
    negWords.forEach(w => { if (text.includes(w)) negCount++; });
    const total = posCount + negCount || 1;
    const score = (posCount - negCount) / total;
    if (score > 0.2) {
      this.sentimentPreview = 'positive';
      this.sentimentScore = 0.6 + (score * 0.35);
      this.sentimentEmoji = '▲';
    } else if (score < -0.2) {
      this.sentimentPreview = 'negative';
      this.sentimentScore = 0.2 + ((1 + score) * 0.2);
      this.sentimentEmoji = '▼';
    } else {
      this.sentimentPreview = 'neutral';
      this.sentimentScore = 0.45 + (score * 0.1);
      this.sentimentEmoji = '―';
    }
    this.sentimentScore = Math.max(0, Math.min(1, this.sentimentScore));
  }

  submitFeedback() {
    this.submitted = true;
    setTimeout(() => { this.submitted = false; }, 3000);
  }
}
