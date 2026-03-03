import { Routes } from '@angular/router';
import { Login } from './pages/login';
import { EmployeeDashboard } from './pages/employee-dashboard';
import { ManagerDashboard } from './pages/manager-dashboard';
import { HrDashboard } from './pages/hr-dashboard';
import { FeedbackForm } from './pages/feedback-form';
import { XaiDetail } from './pages/xai-detail';
import { KpiTracking } from './pages/kpi-tracking';
import { Reports } from './pages/reports';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'employee-dashboard', component: EmployeeDashboard },
    { path: 'manager-dashboard', component: ManagerDashboard },
    { path: 'hr-dashboard', component: HrDashboard },
    { path: 'feedback-form', component: FeedbackForm },
    { path: 'xai-detail', component: XaiDetail },
    { path: 'kpi-tracking', component: KpiTracking },
    { path: 'reports', component: Reports },
    { path: '**', redirectTo: 'login' },
];
