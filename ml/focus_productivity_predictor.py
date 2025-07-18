#!/usr/bin/env python3
"""
Focus Productivity Predictor - Streamlit Web App

Predicts study session productivity scores based on behavioral metrics
and displays model performance metrics.
"""

import streamlit as st
import pandas as pd
import numpy as np
import pickle
from sklearn.metrics import mean_absolute_error, r2_score

# Configuration
MODEL_FILE = 'ml/focus_model.pkl'
CSV_FILE = 'ml/ml_focus_dataset_2025-07-15.csv'

@st.cache_data
def load_model():
    try:
        with open(MODEL_FILE, 'rb') as f:
            model_package = pickle.load(f)
        return model_package
    except FileNotFoundError:
        st.error(f"Model file not found: {MODEL_FILE}")
        st.info("Please run 'python ml/focus_model.py' to train the model first.")
        return None

@st.cache_data
def load_sample_data():
    try:
        df = pd.read_csv(CSV_FILE)
        return df.sample(10).reset_index(drop=True)
    except FileNotFoundError:
        return None

def get_training_metrics(model_package):
    try:
        df = pd.read_csv(CSV_FILE)
        df['subject_encoded'] = model_package['label_encoder'].transform(df['subject'])

        features = ['duration_minutes', 'tab_switches', 'keystroke_rate_per_minute',
                    'mouse_movements_total', 'inactivity_periods_count',
                    'scroll_events_total']
        X = df[features + ['subject_encoded']]
        y_actual = df['productivity_score']
        y_pred = model_package['model'].predict(X)

        r2 = r2_score(y_actual, y_pred)
        mae = mean_absolute_error(y_actual, y_pred)
        return r2, mae
    except Exception:
        return None, None

def predict_productivity(model_package, duration, tab_switches, keystroke_rate,
                         mouse_movements, inactivity_periods, scroll_events, subject):
    if model_package is None:
        return None
    try:
        subject_encoded = model_package['label_encoder'].transform([subject])[0]
    except ValueError:
        subject_encoded = 0
    features = np.array([[
        duration, tab_switches, keystroke_rate,
        mouse_movements, inactivity_periods, scroll_events, subject_encoded
    ]])
    prediction = model_package['model'].predict(features)[0]
    return max(10, min(100, prediction))

def get_focus_level(score):
    if score >= 70:
        return "🟢 Attentive", "#28a745"
    elif score >= 40:
        return "🟡 Semi-Focused", "#ffc107"
    else:
        return "🔴 Distracted", "#dc3545"

def main():
    st.set_page_config(page_title="Focus Productivity Predictor", page_icon="🧠", layout="wide")
    st.title("🧠 Focus Productivity Predictor")
    st.markdown("Estimate study session productivity based on user behavior")

    model_package = load_model()
    if model_package is None:
        st.stop()

    r2, mae = get_training_metrics(model_package)

    col1, col2 = st.columns([1, 1])
    with col1:
        st.header("📊 Session Input")
        duration = st.slider("Duration (minutes)", 1, 120, 30)
        tab_switches = st.slider("Tab Switches", 0, 20, 5)
        keystroke_rate = st.slider("Keystroke Rate (per minute)", 0, 25, 10)
        mouse_movements = st.slider("Mouse Movements", 0, 500, 150)
        inactivity_periods = st.slider("Inactivity Periods", 0, 10, 2)
        scroll_events = st.slider("Scroll Events", 0, 200, 50)
        subject = st.selectbox("Subject", ["ai-ml-course", "maths", "web-dev", "cs-theory", "history"])

        if st.button("🔮 Predict Productivity", type="primary"):
            prediction = predict_productivity(
                model_package, duration, tab_switches, keystroke_rate,
                mouse_movements, inactivity_periods, scroll_events, subject
            )
            if prediction is not None:
                st.session_state.prediction = prediction
                st.session_state.input_data = {
                    'duration': duration,
                    'tab_switches': tab_switches,
                    'subject': subject
                }

    with col2:
        st.header("🎯 Prediction Result")
        if hasattr(st.session_state, 'prediction'):
            score = st.session_state.prediction
            focus_level, color = get_focus_level(score)

            st.metric("Productivity Score", f"{score:.1f}/100")
            st.markdown(f"**Focus Level:** {focus_level}")
            st.progress(score / 100)

            st.subheader("💡 Insights")
            input_data = st.session_state.input_data

            if score >= 70:
                st.success("Great focus! You're likely to have a productive session.")
            elif score >= 40:
                st.warning("Moderate focus. Try minimizing distractions.")
            else:
                st.error("Low focus predicted. Consider taking a break or changing environment.")

            if input_data['tab_switches'] > 10:
                st.info("💡 High tab switching detected. Try using focus apps.")
            if input_data['duration'] > 60:
                st.info("💡 Long session planned. Break it into chunks.")
        else:
            st.info("👆 Enter your session parameters and click 'Predict Productivity'")

    st.header("📈 Model Performance")
    with st.container():
        st.subheader("📊 Model Metrics")
        st.metric("Model Type", "Decision Tree")
        st.metric("R² Score", f"{r2:.3f}" if r2 else "N/A")
        st.metric("MAE", f"{mae:.2f}" if mae else "N/A")
        st.metric("Training Data", "300+ sessions")

        st.subheader("🎯 Focus Thresholds")
        st.write("🟢 **Attentive:** 70–100")
        st.write("🟡 **Semi-Focused:** 40–69")
        st.write("🔴 **Distracted:** 10–39")

    st.markdown("---")
    st.markdown("🔬 **Focus Flow ML Dashboard** | Built with Streamlit & scikit-learn")

if __name__ == "__main__":
    main()
