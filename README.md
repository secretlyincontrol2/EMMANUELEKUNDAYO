# ADMS-R: AI-Driven Multi-Source Rating System

A full-stack performance assessment system featuring transparent, AI-powered employee evaluation with Explainable AI (XAI).

## Architecture

| Component | Tech Stack | Directory |
|--|--|--|
| **Frontend** | Angular 19, Chart.js, CSS | `adms-r/` |
| **Backend** | FastAPI, SQLAlchemy, SQLite | `adms-r-backend/` |
| **ML Engine** | XGBoost, SHAP, LIME | `adms-r-backend/app/ml/` |
| **Chrome Extension** | Manifest V3, Vanilla JS | `adms-r-extension/` |

## Quick Start

### Frontend
```bash
cd adms-r
npm install
ng serve
# → http://localhost:4200
```

### Backend
```bash
cd adms-r-backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn app.main:app --port 8000
# → http://localhost:8000/docs
```

### Chrome Extension
1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** → select `adms-r-extension/`

## Features

- **Role-based dashboards** — Employee, Manager, HR Admin
- **XGBoost ML model** — Predicts performance scores from KPI, sentiment, attendance, and research data
- **Explainable AI** — Real SHAP feature contributions and LIME decision rules for every prediction
- **360° feedback** — Multi-source feedback with live NLP sentiment preview
- **NDPR compliance** — Governance checklist and algorithmic fairness audit
- **Chrome Extension** — Tracks academic engagement on LMS portals
- **Monochrome design** — Strict black-and-white aesthetic

## Context

Built as a prototype for research on AI-driven performance management in the Babcock University context.
