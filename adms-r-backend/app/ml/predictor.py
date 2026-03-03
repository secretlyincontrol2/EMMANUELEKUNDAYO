# We will train a simple ML model here using scikit-learn/XGBoost to predict employee performance.
import os
import pickle
import numpy as np
import pandas as pd
import xgboost as xgb
import shap
import lime.lime_tabular
import json

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, 'model.pkl')
TRAINER_PATH = os.path.join(MODEL_DIR, 'trainer.pkl')

# Feature names explicitly mapped for training and explanations
FEATURE_NAMES = ['kpi_score', 'sentiment_score', 'attendance_rate', 'research_output']

class PerformancePredictor:
    def __init__(self):
        self.model = None
        self.explainer_shap = None
        self.explainer_lime = None
        self.training_data = None
        self.load_or_train_model()

    def generate_dummy_data(self, n_samples=500):
        # Generate synthetic HR data for training the ADMS-R model
        np.random.seed(42)
        kpi = np.random.normal(70, 15, n_samples).clip(0, 100)
        sentiment = np.random.normal(0.6, 0.2, n_samples).clip(-1, 1)
        attendance = np.random.normal(90, 5, n_samples).clip(0, 100)
        research = np.random.normal(5, 3, n_samples).clip(0, 20)
        
        # Target variable (Performance Score 0-100)
        # Assuming true relationship: KPI is most important, then Sentiment
        target = (kpi * 0.45) + ((sentiment + 1) * 50 * 0.25) + (attendance * 0.20) + (research * 2 * 0.10)
        target = target + np.random.normal(0, 5, n_samples)
        target = target.clip(0, 100)
        
        df = pd.DataFrame({
            'kpi_score': kpi,
            'sentiment_score': sentiment,
            'attendance_rate': attendance,
            'research_output': research
        })
        return df, target

    def load_or_train_model(self):
        if os.path.exists(MODEL_PATH) and os.path.exists(TRAINER_PATH):
            with open(MODEL_PATH, 'rb') as f:
                self.model = pickle.load(f)
            with open(TRAINER_PATH, 'rb') as f:
                self.training_data = pickle.load(f)
        else:
            print("Training new XGBoost model for ADMS-R...")
            X, y = self.generate_dummy_data()
            self.training_data = X
            
            self.model = xgb.XGBRegressor(
                objective='reg:squarederror',
                n_estimators=100,
                max_depth=4,
                learning_rate=0.1
            )
            self.model.fit(X, y)
            
            with open(MODEL_PATH, 'wb') as f:
                pickle.dump(self.model, f)
            with open(TRAINER_PATH, 'wb') as f:
                pickle.dump(self.training_data, f)
                
        # Initialize Explainers
        self.explainer_shap = shap.TreeExplainer(self.model)
        self.explainer_lime = lime.lime_tabular.LimeTabularExplainer(
            self.training_data.values,
            feature_names=FEATURE_NAMES,
            class_names=['Performance Score'],
            mode='regression'
        )

    def predict_and_explain(self, kpi: float, sentiment: float, attendance: float, research: float):
        # Format input instance
        instance_df = pd.DataFrame([{
            'kpi_score': kpi,
            'sentiment_score': sentiment,
            'attendance_rate': attendance,
            'research_output': research
        }])
        
        # Base Prediction
        pred = float(self.model.predict(instance_df)[0])
        score = min(max(round(pred, 1), 0), 100)

        # 1. SHAP Explanation (Global feature importance for this specific prediction)
        shap_values = self.explainer_shap.shap_values(instance_df)
        base_value = float(self.explainer_shap.expected_value)
        
        shap_dict = {
            "base_value": base_value,
            "features": []
        }
        for i, name in enumerate(FEATURE_NAMES):
            shap_dict["features"].append({
                "name": name,
                "value": float(instance_df.iloc[0, i]),
                "contribution": float(shap_values[0][i])
            })
            
        # Sort by absolute contribution for frontend waterfall
        shap_dict["features"].sort(key=lambda x: abs(x["contribution"]), reverse=True)

        # 2. LIME Explanation (Local interpretable surrogate rules)
        lime_exp = self.explainer_lime.explain_instance(
            instance_df.iloc[0].values, 
            self.model.predict, 
            num_features=4
        )
        
        lime_rules = []
        for rule, weight in lime_exp.as_list():
            lime_rules.append({
                "rule": rule,
                "weight": float(weight)
            })

        return {
            "score": score,
            "confidence": 0.89, # Mock confidence score
            "shap_explanation": json.dumps(shap_dict),
            "lime_explanation": json.dumps(lime_rules)
        }

# Singleton instance
ml_service = PerformancePredictor()
