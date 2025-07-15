# StudySaver - ML-Powered Focus Analytics

🎓 **CS Engineering Project**: Machine Learning Study Behavior Analysis

## Overview
StudySaver is a real-time study session tracker that collects behavioral data for machine learning analysis. It predicts focus levels based on user interaction patterns and exports structured datasets for Python/scikit-learn model training.

## 🔬 ML Data Collection Features

### Real-Time Metrics Tracked:
- **Session Duration** (minutes)
- **Tab Switch Duration** (accumulated time away from study tab)
- **Keystroke Rate** (keystrokes per minute)
- **Mouse Movements** (total interaction count)
- **Scroll Activity** (scroll events tracked)
- **Inactivity Periods** (count + duration of idle time)

### 🎯 Focus Classification Algorithm:
```python
# Distraction Ratio Formula
distraction_ratio = tab_switch_duration_total / session_duration

# Classification Thresholds:
# 🟢 Attentive: distraction_ratio < 0.2 AND keystroke_rate ≥ 10 AND scroll_activity ≥ 20
# 🟡 Semi-Attentive: 0.2 ≤ distraction_ratio ≤ 0.5 OR medium engagement
# 🔴 Distracted: distraction_ratio > 0.5 OR low interaction metrics
```

## 📊 Dataset Export
- **CSV Format**: Ready for pandas/NumPy analysis
- **Feature Engineering**: Productivity scores and distraction ratios pre-calculated
- **ML-Ready Headers**: Compatible with scikit-learn classification models

## 🐍 Python Analysis Pipeline
The exported dataset includes features suitable for:
- **Classification Models**: Random Forest, Decision Tree, SVM
- **Prediction Tasks**: "Will this session be distracted?"
- **Feature Importance**: Which behaviors best predict focus levels?

### Sample Python Analysis:
```python
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Load exported dataset
df = pd.read_csv('ml_focus_dataset_YYYY-MM-DD.csv')

# Features for classification
features = ['duration_minutes', 'tab_switches', 'keystroke_rate_per_minute', 
           'mouse_movements_total', 'scroll_events_total', 'productivity_score']

X = df[features]
y = df['focus_classification']

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Feature importance analysis
print("Feature Importance:", model.feature_importances_)
```

## 🚀 Getting Started

1. **Start Study Session**: Select course material and begin tracking
2. **Study Naturally**: System collects behavioral data in background
3. **Review Focus Score**: Get real-time feedback on attention levels
4. **Export Dataset**: Download CSV for ML analysis in Python
5. **Train Models**: Use exported data for focus prediction algorithms

## 📈 Key Metrics Dashboard
- **Real-time Focus Meter**: Live percentage based on current behavior
- **Distraction Timeline**: Visual chart of attention dips during session
- **Session Summary**: Post-study analysis with improvement suggestions
- **Weekly Analytics**: Trends in focus scores and study consistency

## 🎯 Project Goals
This system demonstrates:
- **Data Pipeline**: Real-time collection → feature engineering → ML-ready export
- **Predictive Analytics**: Behavioral patterns → focus level classification
- **User Experience**: Actionable insights for study improvement
- **Technical Implementation**: React frontend + ML data structure design

## 🔧 Technical Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Data Collection**: Real-time browser event tracking
- **Storage**: LocalStorage with structured data persistence
- **Export**: CSV format optimized for Python/pandas
- **ML Integration**: Feature-engineered dataset ready for scikit-learn

---

## Development Setup

### Requirements
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Steps
```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
```

### Technologies Used
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety and development experience
- **React** - UI framework
- **shadcn-ui** - Component library
- **Tailwind CSS** - Styling framework

### Deployment
Deploy directly via: https://lovable.dev/projects/38d61cb0-e7f9-4ba6-b9ef-0c9f5917c9ea

---
**Note**: This project focuses on the data collection and feature engineering pipeline. The exported CSV files are designed for seamless integration with Python ML workflows using pandas, NumPy, and scikit-learn.
