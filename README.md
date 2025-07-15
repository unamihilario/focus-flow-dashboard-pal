Absolutely, Hilario. Here's a clean and professional version of your project overview for **StudySaver - ML-Powered Focus Analytics** that’s easy to read and presentation-ready:

---

# 🎓 StudySaver: ML-Powered Focus Analytics  
**CS Engineering Project – Machine Learning Study Behavior Analysis**

---

## 📌 Overview  
**StudySaver** is a real-time study session tracker that captures behavioral data from user interactions to predict focus levels using machine learning. It outputs structured datasets for seamless integration with Python-based tools like **scikit-learn** and **pandas**.

---

## 🔬 ML Data Collection Features  
Session metrics are recorded directly in-browser:

| Metric | Description |
|-------|-------------|
| **Session Duration** | Total active time in minutes |
| **Tab Switch Duration** | Accumulated time away from study tab |
| **Keystroke Rate** | Keystrokes per minute |
| **Mouse Movements** | Total mouse interactions |
| **Scroll Activity** | Number of scroll events |
| **Inactivity Periods** | Count & duration of idle intervals |

---

## 🎯 Focus Classification Logic  
Custom classification based on behavioral cues—no camera needed.

```python
distraction_ratio = tab_switch_duration_total / session_duration
```

| Classification | Conditions |
|----------------|------------|
| 🟢 **Attentive** | distraction_ratio < 0.2 and keystroke_rate ≥ 10 and scroll_activity ≥ 20 |
| 🟡 **Semi-Attentive** | distraction_ratio between 0.2–0.5 or medium interaction |
| 🔴 **Distracted** | distraction_ratio > 0.5 or low activity |

---

## 📊 Dataset Export  
- Exports structured **CSV** datasets
- Pre-computed features: `productivity_score`, `distraction_ratio`
- Ready for ML model training with **pandas** and **scikit-learn**

---

## 🐍 Python ML Pipeline Example  
```python
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
```

---

## 🚀 How to Get Started  
1. **Start Tracker** – Choose study material  
2. **Study Naturally** – Data collected in background  
3. **Review Results** – Post-session feedback  
4. **Export Dataset** – Analyze in Python  
5. **Train Models** – Build custom predictors

---

## 📈 UI Dashboard Highlights  
- **Focus Meter** – Real-time attention score  
- **Distraction Timeline** – Graph of dips in focus  
- **Session Summary** – Insights & feedback  
- **Weekly Analytics** – Trends in study consistency

---

## 🧠 Project Objectives  
- Real-time behavioral tracking  
- Predictive modeling from browser interactions  
- Actionable student feedback  
- Full-stack implementation: React + ML integration

---

## 🔧 Tech Stack  
- **Frontend**: React, TypeScript, Tailwind CSS  
- **Tracking**: Custom Hooks for browser events  
- **Storage**: localStorage  
- **Export Format**: CSV for pandas  
- **ML Tools**: Python, NumPy, scikit-learn  
- **Dev Setup**:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

---

## 🌐 Links  
- **Live Dashboard**: [focus-flow-dashboard-pal.vercel.app](https://focus-flow-dashboard-pal.vercel.app/)  
- **GitHub**: [focus-flow-dashboard-pal](https://github.com/unamihilario/focus-flow-dashboard-pal)  
- **Project Report (.docx)**: `12322069AIMLReport.docx`  
- **Dataset (.csv)**: `ml_focus_dataset_2025-07-15.csv`  
- **Python Script**: `focus_predictor.py`  

---

If you want this formatted as an actual webpage or printable document, I can help you convert it to HTML or Markdown too. Want that next?
