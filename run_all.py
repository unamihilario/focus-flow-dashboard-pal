import subprocess

print("📦 Running Focus Flow Pipeline...\n")

# Train the model and save visuals
subprocess.call(["python", "ml/focus_model.py"])

# Create dataset visualizations
subprocess.call(["python", "ml/visualize_dataset.py"])

# Export full-session predictions
subprocess.call(["python", "ml/export_predictions.py"])

# Optional: analyze feature importance
subprocess.call(["python", "ml/feature_analysis.py"])

print("\n✅ All tasks complete. Check /visuals and /outputs for results.")
