import { Component, OnInit } from '@angular/core';
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
export class FeedbackForm implements OnInit {
  selectedEmployee = '';
  feedbackType = '';
  qualitativeFeedback = '';
  submitted = false;
  isAnalyzing = false;
  isSubmitting = false;

  // Competency sliders
  leadership = 3;
  collaboration = 4;
  communication = 3;
  initiative = 3;
  integrity = 4;

  // Likert
  sdaAlignment = 0;

  // NLP
  sentimentPreview = 'neutral';
  sentimentScore = 0.5;
  sentimentEmoji = '―';
  sentimentAnalyzed = false;

  employees: any[] = [];
  allowedTypes: { value: string; label: string }[] = [];

  constructor(private mockData: MockDataService) { }

  async ngOnInit() {
    await this.mockData.loadEmployees();
    this.employees = this.mockData.getAllEmployees();

    // Filter feedback types by role
    const role = this.mockData.currentRole;
    if (role === 'student') {
      this.allowedTypes = [{ value: 'student', label: 'Student Feedback' }];
      this.feedbackType = 'student';
    } else if (role === 'employee') {
      this.allowedTypes = [
        { value: 'peer', label: 'Peer Review' },
        { value: 'subordinate', label: 'Subordinate Review' },
      ];
      this.feedbackType = 'peer';
    } else if (role === 'manager') {
      this.allowedTypes = [
        { value: 'supervisor', label: 'Supervisor Review' },
      ];
      this.feedbackType = 'supervisor';
    } else {
      // HR can do all
      this.allowedTypes = [
        { value: 'peer', label: 'Peer Review' },
        { value: 'supervisor', label: 'Supervisor Review' },
        { value: 'subordinate', label: 'Subordinate Review' },
        { value: 'student', label: 'Student Feedback' },
      ];
      this.feedbackType = 'peer';
    }
  }

  onTextChange() {
    this.sentimentAnalyzed = false;
    const text = this.qualitativeFeedback.trim();
    if (!text || text.length < 10) {
      this.sentimentPreview = 'neutral';
      this.sentimentScore = 0.5;
      this.sentimentEmoji = '―';
    } else {
      this.sentimentPreview = 'pending';
      this.sentimentScore = 0.5;
      this.sentimentEmoji = '...';
    }
  }

  async analyzeSentiment() {
    if (!this.qualitativeFeedback || this.qualitativeFeedback.trim().length < 10) {
      alert('Please provide at least 10 characters of feedback text to analyze.');
      return;
    }

    this.isAnalyzing = true;
    try {
      const token = localStorage.getItem('adms_token');
      const res = await fetch('http://127.0.0.1:8081/api/feedback/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: this.qualitativeFeedback })
      });

      if (res.ok) {
        const data = await res.json();
        this.sentimentScore = data.score;
        if (this.sentimentScore > 0.6) {
          this.sentimentPreview = 'positive';
          this.sentimentEmoji = '▲';
        } else if (this.sentimentScore < 0.4) {
          this.sentimentPreview = 'negative';
          this.sentimentEmoji = '▼';
        } else {
          this.sentimentPreview = 'neutral';
          this.sentimentEmoji = '―';
        }
        this.sentimentAnalyzed = true;
      } else {
        const err = await res.json();
        alert('Analysis failed: ' + (err.detail || 'Unknown error'));
      }
    } catch (e) {
      console.error(e);
      alert('Network error analyzing sentiment.');
    } finally {
      this.isAnalyzing = false;
    }
  }

  async submitFeedback() {
    if (!this.selectedEmployee || !this.qualitativeFeedback) {
      alert('Please select an employee and provide written feedback.');
      return;
    }

    this.isSubmitting = true;
    try {
      const token = localStorage.getItem('adms_token');
      const payload = {
        target_user_id: parseInt(this.selectedEmployee),
        category: this.feedbackType,
        qualitative_text: this.qualitativeFeedback,
        competency_leadership: this.leadership,
        competency_collaboration: this.collaboration,
        competency_execution: this.initiative,
        sda_alignment: this.sdaAlignment
      };

      const res = await fetch('http://127.0.0.1:8081/api/feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        this.sentimentScore = data.sentiment_score;
        if (this.sentimentScore > 0.6) {
          this.sentimentPreview = 'positive';
          this.sentimentEmoji = '▲';
        } else if (this.sentimentScore < 0.4) {
          this.sentimentPreview = 'negative';
          this.sentimentEmoji = '▼';
        } else {
          this.sentimentPreview = 'neutral';
          this.sentimentEmoji = '―';
        }
        this.sentimentAnalyzed = true;
        this.submitted = true;
        setTimeout(() => {
          this.submitted = false;
          this.qualitativeFeedback = '';
          this.sentimentAnalyzed = false;
        }, 5000);
      } else {
        const err = await res.json();
        alert('Failed to submit feedback: ' + err.detail);
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Could not submit feedback.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
