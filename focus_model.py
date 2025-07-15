import os
print("Current Directory:", os.getcwd())
print("Files in Current Directory:", os.listdir())

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.utils.multiclass import unique_labels
import matplotlib.pyplot as plt
import seaborn as sns

# Load the realistic dataset
df = pd.read_csv("ml_focus_dataset_realistic.csv")

# Encode focus labels
label_map = {"distracted": 0, "semi-attentive": 1, "attentive": 2}
reverse_map = {v: k for k, v in label_map.items()}
df["focus_label"] = df["focus_classification"].map(label_map)

# Feature selection
features = [
    "duration_minutes",
    "tab_switches",
    "keystroke_rate_per_minute",
    "mouse_movements_total",
    "inactivity_periods_count",
    "scroll_events_total",
    "productivity_score"
]
X = df[features]
y = df["focus_label"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, stratify=y, test_size=0.3, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Generate classification report
labels_found = unique_labels(y_test, y_pred)
label_names = [reverse_map[label] for label in labels_found]

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred, target_names=label_names, zero_division=0))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred, labels=labels_found)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=label_names, yticklabels=label_names)
plt.title("Confusion Matrix: Focus Prediction")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.tight_layout()
plt.show()

# Feature importance
importances = model.feature_importances_
sns.barplot(x=importances, y=features, orient="h", palette="viridis")
plt.title("Feature Importance for Focus Classification")
plt.xlabel("Importance Score")
plt.ylabel("Feature")
plt.tight_layout()
plt.show()

# Export predictions
df["predicted_focus_label"] = model.predict(X)
df["predicted_focus_classification"] = df["predicted_focus_label"].map(reverse_map)
df.to_csv("focus_predictions_output.csv", index=False)
print("Predictions saved to 'focus_predictions_output.csv'")

# Cross-validation
cv_scores = cross_val_score(model, X, y, cv=5)
print("\nCross-Validation Scores:", cv_scores)
print("Average CV Accuracy:", round(cv_scores.mean(), 3))
