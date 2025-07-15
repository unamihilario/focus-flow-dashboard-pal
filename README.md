StudySaver - ML-Powered Focus Analytics
🎓 CS Engineering Project: Machine Learning Study Behavior Analysis

Overview
StudySaver is a real-time study session tracker designed to collect behavioral data for machine learning analysis. It predicts focus levels based on user interaction patterns and exports structured datasets optimized for Python-based model training using libraries such as scikit-learn and pandas.

🔬 ML Data Collection Features
Real-Time Metrics Tracked
Session data is recorded in-browser and includes:

Session Duration – total active time in minutes

Tab Switch Duration – accumulated time spent away from the study tab

Keystroke Rate – number of keystrokes per minute

Mouse Movements – total user interaction via mouse

Scroll Activity – number of scroll events

Inactivity Periods – count and duration of idle intervals

🎯 Focus Classification Algorithm
python
# Distraction Ratio Formula
distraction_ratio = tab_switch_duration_total / session_duration

# Classification Thresholds:
# 🟢 Attentive: distraction_ratio < 0.2 AND keystroke_rate ≥ 10 AND scroll_activity ≥ 20
# 🟡 Semi-Attentive: 0.2 ≤ distraction_ratio ≤ 0.5 OR medium engagement
# 🔴 Distracted: distraction_ratio > 0.5 OR low interaction metrics
This logic helps label sessions using non-optical cues, allowing scalable focus prediction without camera-based tracking.

📊 Dataset Export
StudySaver exports behavioral metrics in a structured CSV format, ready for Python-based ML workflows. Pre-calculated features such as productivity score and distraction ratio streamline feature engineering. The dataset headers are fully compatible with classification algorithms from scikit-learn.

🐍 Python Analysis Pipeline
Exported datasets are tailored for training models like Random Forests, Decision Trees, or SVMs. These models predict session focus levels and evaluate which behaviors most strongly correlate with distraction or attention.

Sample Python Analysis
python
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

df = pd.read_csv('ml_focus_dataset_YYYY-MM-DD.csv')

features = ['duration_minutes', 'tab_switches', 'keystroke_rate_per_minute', 
            'mouse_movements_total', 'scroll_events_total', 'productivity_score']

X = df[features]
y = df['focus_classification']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = RandomForestClassifier()
model.fit(X_train, y_train)

print("Feature Importance:", model.feature_importances_)
🚀 Getting Started
Start Study Session – Launch tracker and select study material

Study Naturally – Behavioral data is collected in the background

Review Focus Score – Receive feedback post-session

Export Dataset – Download CSV for further analysis

Train Models – Use the exported file in Python to generate predictions

📈 Key Metrics Dashboard
The UI includes:

Focus Meter – real-time score based on current behavior

Distraction Timeline – visual graph of attention dips

Session Summary – post-session analysis with improvement hints

Weekly Analytics – aggregate tracking of study consistency and focus trends

🎯 Project Goals
StudySaver demonstrates:

A real-time data pipeline for behavioral tracking

Predictive modeling from browser interaction metrics

User-focused design for actionable study feedback

A complete technical implementation combining frontend tracking and backend ML analysis

🔧 Technical Stack
Frontend: React, TypeScript, Tailwind CSS

Data Collection: Custom React Hooks for browser event tracking

Storage: localStorage for persistent session data

Export Format: CSV files compatible with pandas

ML Tools: Python, NumPy, scikit-learn

Development Setup
Requirements
Node.js and npm Install via nvm →

Steps
bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
Technologies Used
Vite – fast dev server and build tool

TypeScript – type-safe development

React – UI rendering framework

shadcn-ui – accessible component library

Tailwind CSS – utility-first styling

Deployment
Live version hosted at: 
