import pickle
import matplotlib.pyplot as plt

with open("ml/focus_model.pkl", "rb") as f:
    pkg = pickle.load(f)

features = pkg["feature_names"]
importances = pkg["model"].feature_importances_

plt.figure(figsize=(8, 5))
plt.barh(features, importances, color="#2E86AB")
plt.xlabel("Feature Importance")
plt.title("Decision Tree Importance")
plt.tight_layout()
plt.savefig("visuals/feature_importance.png")
print("📊 Feature importance saved to /visuals/feature_importance.png")
