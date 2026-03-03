import { Injectable } from '@angular/core';

export interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  overallScore: number;
  kpiScore: number;
  sentimentScore: number;
  attendance: number;
  initials: string;
  riskLevel: 'low' | 'medium' | 'high';
  gender: string;
  trend: number[];
}

export interface Feedback {
  id: number;
  source: string;
  sourceType: 'peer' | 'supervisor' | 'subordinate' | 'student';
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentLabel: string;
  nlpScore: number;
  date: string;
}

export interface KPI {
  id: number;
  name: string;
  target: string;
  progress: number;
  category: string;
}

export interface ShapFeature {
  name: string;
  value: number;
  description: string;
}

export interface FairnessMetric {
  name: string;
  value: number;
  threshold: number;
  status: 'pass' | 'fail';
  description: string;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {

  currentRole: 'employee' | 'manager' | 'hr' | null = null;

  employees: Employee[] = [
    { id: 1, name: 'Dr. Adebayo F.', department: 'Computer Science', role: 'Lecturer II', overallScore: 84, kpiScore: 88, sentimentScore: 0.76, attendance: 94, initials: 'DA', riskLevel: 'low', gender: 'Male', trend: [68, 70, 72, 71, 74, 76, 75, 78, 79, 81, 82, 84] },
    { id: 2, name: 'Dr. Ogunleye T.', department: 'Computer Science', role: 'Lecturer I', overallScore: 72, kpiScore: 70, sentimentScore: 0.62, attendance: 88, initials: 'OT', riskLevel: 'medium', gender: 'Female', trend: [65, 64, 66, 68, 67, 69, 70, 71, 70, 72, 71, 72] },
    { id: 3, name: 'Prof. Balogun K.', department: 'Computer Science', role: 'Senior Lecturer', overallScore: 91, kpiScore: 95, sentimentScore: 0.88, attendance: 97, initials: 'BK', riskLevel: 'low', gender: 'Male', trend: [82, 84, 85, 86, 87, 88, 89, 88, 90, 91, 90, 91] },
    { id: 4, name: 'Dr. Chukwu N.', department: 'Computer Science', role: 'Lecturer II', overallScore: 58, kpiScore: 52, sentimentScore: 0.45, attendance: 78, initials: 'CN', riskLevel: 'high', gender: 'Female', trend: [62, 60, 58, 57, 59, 56, 55, 57, 56, 58, 57, 58] },
    { id: 5, name: 'Dr. Ibrahim M.', department: 'Computer Science', role: 'Lecturer I', overallScore: 79, kpiScore: 82, sentimentScore: 0.71, attendance: 91, initials: 'IM', riskLevel: 'low', gender: 'Male', trend: [70, 72, 73, 74, 75, 76, 77, 78, 77, 79, 78, 79] },
    { id: 6, name: 'Dr. Fashola A.', department: 'Computer Science', role: 'Lecturer II', overallScore: 66, kpiScore: 64, sentimentScore: 0.55, attendance: 85, initials: 'FA', riskLevel: 'medium', gender: 'Female', trend: [60, 61, 62, 63, 62, 64, 65, 64, 66, 65, 66, 66] },
    { id: 7, name: 'Prof. Adeyemi R.', department: 'Mathematics', role: 'Professor', overallScore: 93, kpiScore: 96, sentimentScore: 0.91, attendance: 98, initials: 'AR', riskLevel: 'low', gender: 'Male', trend: [88, 89, 90, 91, 90, 92, 91, 93, 92, 93, 93, 93] },
    { id: 8, name: 'Dr. Eze P.', department: 'Mathematics', role: 'Lecturer I', overallScore: 77, kpiScore: 80, sentimentScore: 0.68, attendance: 90, initials: 'EP', riskLevel: 'low', gender: 'Female', trend: [70, 71, 72, 73, 74, 75, 76, 75, 77, 76, 77, 77] },
  ];

  feedbacks: Feedback[] = [
    { id: 1, source: 'Peer — Dr. Ogunleye', sourceType: 'peer', text: 'Demonstrates excellent collaboration during departmental projects and consistently supports junior colleagues.', sentiment: 'positive', sentimentLabel: 'Positive', nlpScore: 0.87, date: '2026-02-25' },
    { id: 2, source: 'Supervisor — Prof. Okonkwo', sourceType: 'supervisor', text: 'Meets teaching objectives and maintains good research output. Should improve on timely submission of grades.', sentiment: 'neutral', sentimentLabel: 'Mixed', nlpScore: 0.58, date: '2026-02-20' },
    { id: 3, source: 'Student Feedback', sourceType: 'student', text: 'The lectures are sometimes rushed towards the end of semester. More revision sessions would be helpful.', sentiment: 'negative', sentimentLabel: 'Negative', nlpScore: 0.32, date: '2026-02-18' },
    { id: 4, source: 'Peer — Prof. Balogun', sourceType: 'peer', text: 'Very reliable team member. Always contributes meaningfully to committee assignments and research collaborations.', sentiment: 'positive', sentimentLabel: 'Positive', nlpScore: 0.92, date: '2026-02-15' },
    { id: 5, source: 'Subordinate — Mr. Akinola', sourceType: 'subordinate', text: 'Provides adequate mentoring but could be more available for one-on-one consultations.', sentiment: 'neutral', sentimentLabel: 'Mixed', nlpScore: 0.52, date: '2026-02-12' },
    { id: 6, source: 'Student Feedback', sourceType: 'student', text: 'Dr. Adebayo explains concepts clearly and provides excellent course materials. Very engaging lectures.', sentiment: 'positive', sentimentLabel: 'Positive', nlpScore: 0.89, date: '2026-02-10' },
  ];

  kpis: KPI[] = [
    { id: 1, name: 'Research Publications', target: '4 papers/year', progress: 75, category: 'Research' },
    { id: 2, name: 'Teaching Evaluation Score', target: '≥ 4.0/5.0', progress: 82, category: 'Teaching' },
    { id: 3, name: 'Student Pass Rate', target: '≥ 85%', progress: 90, category: 'Teaching' },
    { id: 4, name: 'Community Service Hours', target: '40 hours/year', progress: 60, category: 'Service' },
    { id: 5, name: 'Grant Proposals Submitted', target: '2 proposals/year', progress: 50, category: 'Research' },
    { id: 6, name: 'Conference Presentations', target: '3 presentations/year', progress: 100, category: 'Research' },
    { id: 7, name: 'Mentorship Sessions', target: '20 sessions/semester', progress: 85, category: 'Service' },
    { id: 8, name: 'Curriculum Development', target: '2 courses updated', progress: 100, category: 'Teaching' },
  ];

  shapFeatures: ShapFeature[] = [
    { name: 'KPI Achievement', value: 0.23, description: 'Strong publication and teaching metrics push score upward.' },
    { name: 'Peer Sentiment', value: 0.18, description: 'Positive peer reviews contribute significantly to overall score.' },
    { name: 'Attendance Rate', value: 0.12, description: 'Consistent attendance indicates commitment and reliability.' },
    { name: 'Student Feedback', value: -0.08, description: 'Some negative student reviews slightly reduce the score.' },
    { name: 'Grade Submission', value: -0.05, description: 'Occasional late grade submissions have minor negative impact.' },
    { name: 'SDA Value Alignment', value: 0.09, description: 'Alignment with institutional values supports score.' },
    { name: 'Research Output', value: 0.15, description: 'Active research publication and conference contributions.' },
    { name: 'Committee Participation', value: 0.07, description: 'Regular committee contributions add positively.' },
  ];

  limeExplanation = {
    baseScore: 72,
    finalScore: 84,
    rules: [
      { feature: 'KPI Achievement ≥ 80%', impact: +5, direction: 'positive' as const },
      { feature: 'Peer Sentiment ≥ 0.7', impact: +4, direction: 'positive' as const },
      { feature: 'Research Publications ≥ 3', impact: +3, direction: 'positive' as const },
      { feature: 'Attendance ≥ 90%', impact: +2, direction: 'positive' as const },
      { feature: 'Student Feedback < 0.6', impact: -2, direction: 'negative' as const },
    ],
  };

  fairnessMetrics: FairnessMetric[] = [
    { name: 'Demographic Parity', value: 0.94, threshold: 0.80, status: 'pass', description: 'Ratio of positive outcomes between protected groups. Values above 0.80 indicate acceptable parity.' },
    { name: 'Accuracy Difference', value: 0.03, threshold: 0.10, status: 'pass', description: 'Difference in prediction accuracy across groups. Values below 0.10 are acceptable.' },
    { name: 'Equal Opportunity', value: 0.91, threshold: 0.80, status: 'pass', description: 'True positive rate ratio between groups. Measures if qualified individuals are equally recognized.' },
    { name: 'Predictive Parity', value: 0.88, threshold: 0.80, status: 'pass', description: 'Positive predictive value ratio. Ensures predictions are equally reliable across groups.' },
  ];

  modelMetrics = {
    accuracy: 0.89,
    precision: 0.87,
    recall: 0.91,
    f1Score: 0.89,
    auc: 0.93,
  };

  complianceChecklist = [
    { item: 'NDPR Data Processing Consent', status: 'done', detail: 'All employee data collected with explicit consent forms' },
    { item: 'Data Minimization Principle', status: 'done', detail: 'Only performance-relevant data is collected and processed' },
    { item: 'Right to Explanation (NDPR Art. 3.1)', status: 'done', detail: 'SHAP/LIME explanations available for every prediction' },
    { item: 'Bias Audit Completed', status: 'done', detail: 'Demographic Parity and Accuracy Difference within thresholds' },
    { item: 'Data Encryption (In Transit)', status: 'done', detail: 'TLS 1.3 encryption for all API communications' },
    { item: 'Data Encryption (At Rest)', status: 'done', detail: 'AES-256 encryption for stored PII data' },
    { item: 'Annual NDPR Review', status: 'pending', detail: 'Scheduled for Q3 2026 — awaiting compliance officer sign-off' },
    { item: 'Employee Data Access Requests', status: 'done', detail: 'Self-service portal available for data access requests' },
  ];

  departmentScores = [
    { dept: 'Computer Science', avgScore: 78, headcount: 12, trend: 'up' },
    { dept: 'Mathematics', avgScore: 85, headcount: 8, trend: 'up' },
    { dept: 'Physics', avgScore: 74, headcount: 10, trend: 'stable' },
    { dept: 'Chemistry', avgScore: 71, headcount: 9, trend: 'down' },
    { dept: 'Biology', avgScore: 80, headcount: 11, trend: 'up' },
  ];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  getCurrentEmployee(): Employee {
    return this.employees[0];
  }

  getTeamEmployees(): Employee[] {
    return this.employees.filter(e => e.department === 'Computer Science');
  }

  getAllEmployees(): Employee[] {
    return this.employees;
  }
}
