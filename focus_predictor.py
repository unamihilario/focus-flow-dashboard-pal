import os
print("Current Directory:", os.getcwd())
print("Files in Current Directory:", os.listdir())

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
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

# Predict
y_pred = model.predict(X_test)

# Classification Report
print("📊 Classification Report:\n")
print(classification_report(y_test, y_pred, target_names=["Distracted", "Semi-Attentive", "Attentive"]))

# Confusion Matrix with Labels
labels = ["Distracted", "Semi-Attentive", "Attentive"]
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=labels, yticklabels=labels)
plt.title("Focus Prediction Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.tight_layout()
plt.show()

# Feature Importance
importances = model.feature_importances_
sns.barplot(x=importances, y=X.columns, orient="h", palette="viridis")
plt.title("Feature Importance for Focus Prediction")
plt.xlabel("Importance Score")
plt.ylabel("Feature")
plt.tight_layout()
plt.show()

# Export all predictions to CSV
df["predicted_focus_label"] = model.predict(X)
df["predicted_focus_classification"] = df["predicted_focus_label"].map({0: "distracted", 1: "semi-attentive", 2: "attentive"})
df.to_csv("focus_predictions_output.csv", index=False)

print("✅ Predictions saved to 'focus_predictions_output.csv'")

# Optional: Cross-Validation
scores = cross_val_score(model, X, y, cv=5)
print("\n📈 Cross-Validation Scores:", scores)
print("Average CV Accuracy:", round(scores.mean(), 3))
