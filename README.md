# StudySaver – ML-Powered Focus Analytics

## 📌 Overview
StudySaver is a browser-based productivity tracker designed for students to measure engagement during study sessions. It passively captures behavior such as tab switching, typing rhythm, mouse movement, scrolling, and inactivity—then uses machine learning to predict session focus levels. All data is exportable and supports downstream classification, analysis, and habit-building.

## 🚀 Live Demo
Access the deployed dashboard here:  
[Streamlit App – focus-flow-dashboard-pal](https://focus-flow-dashboard-pal-m2dfjzv7sy8mryvryc2wds.streamlit.app/)

## 🧪 Features
- Predictive focus scoring (Attentive, Semi-Focused, Distracted)
- Real-time session input and feedback
- Model performance charts and metrics
- Dataset viewer with export capabilities
- Study Tracker tab with weekly insights

## 🎯 Focus Prediction Logic
Session metrics include:
- Duration
- Tab switches
- Keystroke rate
- Mouse movement
- Scroll activity
- Inactivity periods
- Subject category

These are fed into a trained ML model (Decision Tree) for score prediction.

## 🐍 Machine Learning
Model training is handled with:
- Python 3
- pandas / numpy
- scikit-learn
- matplotlib / seaborn

``python
# Sample pipeline
df = pd.read_csv('ml/ml_focus_dataset_2025-07-15.csv')
X = df[[...]]
y = df['productivity_score']
model.fit(X, y)

## 📦 Project Structure
├── ml/
│   ├── focus_productivity_predictor.py
│   ├── focus_model.pkl
│   ├── ml_focus_dataset_2025-07-15.csv
├── requirements.txt
├── index.html
├── vite.config.ts
├── tailwind.config.ts

## 💻 Tech Stack
Frontend: HTML, TypeScript, Tailwind, Vite

Backend ML: Python, Streamlit

Deployment: Streamlit Cloud

Data Format: CSV

## 🔗 Resources
GitHub Repo: unamihilario/focus-flow-dashboard-pal

Dataset: ml/ml_focus_dataset_2025-07-15.csv

ML Script: focus_model.py

Project Report: 12322069AIMLReport.docx

## 📚 Author
Hilario Unami Ngwenya Summer Internship Project 2025 Lovely Professional University Course: Machine Learning Made Easy (PETV79)

## ✅ Deployment
Use Streamlit Cloud with:

Repository: unamihilario/focus-flow-dashboard-pal

Branch: main

Main file: ml/focus_productivity_predictor.py
