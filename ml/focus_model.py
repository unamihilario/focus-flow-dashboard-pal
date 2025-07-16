import pandas as pd
import matplotlib.pyplot as plt
import pickle
from sklearn.tree import DecisionTreeRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import os

# Load data
df = pd.read_csv("ml/ml_focus_dataset_2025-07-15.csv")
df["subject_encoded"] = LabelEncoder().fit_transform(df["subject"])

# Feature matrix
features = [
    "duration_minutes", "tab_switches", "keystroke_rate_per_minute",
    "mouse_movements_total", "inactivity_periods_count",
    "scroll_events_total", "subject_encoded"
]
X = df[features]
y = df["productivity_score"]

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)
model = DecisionTreeRegressor(random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# Metrics
print("✅ Model trained")
print("MAE:", round(mean_absolute_error(y_test, y_pred), 2))
print("MSE:", round(mean_squared_error(y_test, y_pred), 2))
print("R²:", round(r2_score(y_test, y_pred), 3))

# Save model
model_package = {
    "model": model,
    "feature_names": features,
    "label_encoder": LabelEncoder().fit(df["subject"])
}
with open("ml/focus_model.pkl", "wb") as f:
    pickle.dump(model_package, f)

# Save plot
os.makedirs("visuals", exist_ok=True)
plt.figure(figsize=(8, 5))
plt.scatter(y_test, y_pred, alpha=0.6)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], "r--")
plt.xlabel("Actual Productivity Score")
plt.ylabel("Predicted Score")
plt.title("Actual vs Predicted Productivity")
plt.tight_layout()
plt.savefig("visuals/actual_vs_predicted.png")
