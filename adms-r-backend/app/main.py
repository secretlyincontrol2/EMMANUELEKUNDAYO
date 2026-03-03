from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json

from app.database import Base, engine, SessionLocal, get_db
from app.models.models import User, ExtensionSession, PerformancePrediction
from app.schemas.schemas import (
    ExtensionSessionCreate, ExtensionSessionResponse,
    PerformancePredictionResponse,
)
from app.ml.predictor import ml_service

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ADMS-R API", description="AI-Driven Multi-Source Rating Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the ADMS-R Backend API"}

@app.post("/api/extension/log-session", response_model=ExtensionSessionResponse)
def create_extension_session(
    session_data: ExtensionSessionCreate,
    db: Session = Depends(get_db)
):
    user_id = 1
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(
            id=user_id,
            email="dr.adebayo@babcock.edu.ng",
            full_name="Dr. Adebayo F.",
            hashed_password="hashed",
            role="employee",
            department="Computer Science",
        )
        db.add(user)
        db.commit()

    db_session = ExtensionSession(
        user_id=user_id,
        url=session_data.url,
        title=session_data.title,
        duration_minutes=session_data.duration_minutes,
        interaction_count=session_data.interaction_count,
        timestamp=session_data.timestamp,
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@app.post("/api/ml/predict", response_model=PerformancePredictionResponse)
def predict_performance(
    kpi: float, sentiment: float, attendance: float, research: float,
    db: Session = Depends(get_db)
):
    result = ml_service.predict_and_explain(kpi, sentiment, attendance, research)

    db_pred = PerformancePrediction(
        user_id=1,
        score=result["score"],
        confidence=result["confidence"],
        feature_kpi=kpi,
        feature_sentiment=sentiment,
        feature_attendance=attendance,
        feature_research=research,
        shap_json=result["shap_explanation"],
        lime_json=result["lime_explanation"],
    )
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)
    return db_pred
