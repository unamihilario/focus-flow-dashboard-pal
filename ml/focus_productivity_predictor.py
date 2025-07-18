#!/usr/bin/env python3
"""
Focus Productivity Predictor - Streamlit Web App

Interactive web application for predicting study session productivity scores
using the trained ML model.
"""

import streamlit as st
import pandas as pd
import numpy as np
import pickle
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_absolute_error, r2_score
import os

# Configuration
MODEL_FILE = 'ml/focus_model.pkl'
CSV_FILE = 'ml/ml_focus_dataset_2025-07-15.csv'  # Corrected path

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

def create_model_performance_chart(model_package):
    if model_package is None:
        return None

    try:
        df = pd.read_csv(CSV_FILE)
        sample_size = min(100, len(df))
        sample_df = df.sample(sample_size, random_state=42)

        features = ['duration_minutes', 'tab_switches', 'keystroke_rate_per_minute',
                    'mouse_movements_total', 'inactivity_periods_count',
                    'scroll_events_total']
        sample_df['subject_encoded'] = model_package['label_encoder'].transform(sample_df['subject'])
        X = sample_df[features + ['subject_encoded']]
        y_actual = sample_df['productivity_score']
        y_pred = model_package['model'].predict(X)

        fig, ax = plt.subplots(figsize=(10, 6))
        ax.scatter(y_actual, y_pred, alpha=0.6, s=50, color='#2E86AB')

        min_val, max_val = min(y_actual.min(), y_pred.min()), max(y_actual.max(), y_pred.max())
        ax.plot([min_val, max_val], [min_val, max_val], 'r--', lw=2, label='Perfect Prediction')

        ax.set_xlabel('Actual Score')
        ax.set_ylabel('Predicted Score')
        ax.set_title('Model Performance: Actual vs Predicted Scores')
        ax.legend()
        ax.grid(True, alpha=0.3)

        r2 = r2_score(y_actual, y_pred)
        mae = mean_absolute_error(y_actual, y_pred)
        textstr = f'R² = {r2:.3f}\nMAE = {mae:.2f}'
        props = dict(boxstyle='round', facecolor='wheat', alpha=0.8)
        ax.text(0.05, 0.95, textstr, transform=ax.transAxes, fontsize=11,
                verticalalignment='top', bbox=props)

        return fig

    except Exception as e:
        st.error(f"Error creating performance chart: {e}")
        return None

def main():
    st.set_page_config(
        page_title="Focus Productivity Predictor",
        page_icon="🧠",
        layout="wide"
    )

    st.title("🧠 Focus Productivity Predictor")
    st.markdown("Predict your study session productivity based on behavioral metrics")

    model_package = load_model()
    if model_package is None:
        st.stop()

    col1, col2 = st.columns([1, 1])
    with col1:
        st.header("📊 Session Input")
        duration = st.slider("Duration (minutes)", 1, 120, 30)
        tab_switches = st.slider("Tab Switches", 0, 20, 5)
        keystroke_rate = st.slider("Keystroke Rate (per minute)", 0, 25, 10)
        mouse_movements = st.slider("Mouse Movements", 0, 500, 150)
        inactivity_periods = st.slider("Inactivity Periods", 0, 10, 2)
        scroll_events = st.slider("Scroll Events", 0, 200, 50)
        subject = st.selectbox("Subject", 
            ["ai-ml-course", "maths", "web-dev", "cs-theory", "history"]
        )

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
                st.info("💡 High tab switching detected. Try using focus apps to block distractions.")

            if input_data['duration'] > 60:
                st.info("💡 Long session planned. Consider breaking it into smaller chunks with breaks.")
        else:
            st.info("👆 Enter your session parameters and click 'Predict Productivity'")

     st.header("📈 Model Performance")
     col3, col4 = st.columns([2, 1])
     with col3:
         with st.spinner("Loading performance chart..."):
             fig = create_model_performance_chart(model_package)
             if fig:
                 st.pyplot(fig)

    with col2:
        st.subheader("📊 Model Metrics")
        st.metric("Model Type", "Decision Tree")
        st.metric("R² Score", "0.98")
        st.metric("MAE", "~2.1")
        st.metric("Training Data", "300+ sessions")

        st.subheader("🎯 Focus Thresholds")
        st.write("🟢 **Attentive:** 70–100")
        st.write("🟡 **Semi-Focused:** 40–69")
        st.write("🔴 **Distracted:** 10–39")

    # 📋 Optional: Sample data viewer
    # st.header("📋 Sample Data")
    # sample_data = load_sample_data()
    # if sample_data is not None:
    #     st.dataframe(sample_data[[
    #         'session_id', 'subject', 'duration_minutes',
    #         'tab_switches', 'productivity_score'
    #     ]], use_container_width=True)

    st.markdown("---")
    st.markdown("🔬 **Focus Flow ML Dashboard** | Built with Streamlit & scikit-learn")

if __name__ == "__main__":
    main()
