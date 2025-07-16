import pandas as pd
import pickle
import os

df = pd.read_csv("ml/ml_focus_dataset_2025-07-15.csv")
with open("ml/focus_model.pkl", "rb") as f:
    pkg = pickle.load(f)

df["subject_encoded"] = pkg["label_encoder"].transform(df["subject"])
X = df[pkg["feature_names"]]
df["predicted_score"] = pkg["model"].predict(X)
df["prediction_error"] = abs(df["predicted_score"] - df["productivity_score"])

os.makedirs("outputs", exist_ok=True)
df.to_csv("outputs/predictions_comparison.csv", index=False)
print("📤 Predictions exported to /outputs/predictions_comparison.csv")
