import os
print("Current Directory:", os.getcwd())
print("Files in Current Directory:", os.listdir())
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
df = pd.read_csv("ml_focus_dataset_2025-07-15.csv")

# Encode labels
label_map = {"distracted": 0, "semi-attentive": 1, "attentive": 2}
df["focus_label"] = df["focus_classification"].map(label_map)

# Select features
X = df[[
    "duration_minutes",
    "tab_switches",
    "keystroke_rate_per_minute",
    "mouse_movements_total",
    "inactivity_periods_count",
    "scroll_events_total",
    "productivity_score"
]]
y = df["focus_label"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, stratify=y, test_size=0.3, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict + Evaluate
y_pred = model.predict(X_test)
print("Classification Report:\n")
print(classification_report(y_test, y_pred))

# Visualize confusion matrix
sns.heatmap(confusion_matrix(y_test, y_pred), annot=True, fmt="d", cmap="Blues")
plt.title("Focus Prediction Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.show()
