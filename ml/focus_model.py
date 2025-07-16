#!/usr/bin/env python3
"""
Focus Productivity Model Training Script

This script trains a Decision Tree model to predict productivity scores
based on study session behavioral data.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns
import pickle
import os

# Configuration
CSV_FILE = 'ml_focus_dataset_2025-07-15.csv'
MODEL_FILE = 'ml/focus_model.pkl'
PLOT_FILE = 'visuals/actual_vs_predicted.png'

def load_and_prepare_data():
    """Load the dataset and prepare features for training."""
    print("📊 Loading dataset...")
    
    # Load data
    df = pd.read_csv(CSV_FILE)
    print(f"Dataset shape: {df.shape}")
    print(f"Subjects: {df['subject'].unique()}")
    
    # Encode categorical subject feature
    label_encoder = LabelEncoder()
    df['subject_encoded'] = label_encoder.fit_transform(df['subject'])
    
    # Define features and target
    features = [
        'duration_minutes', 'tab_switches', 'keystroke_rate_per_minute',
        'mouse_movements_total', 'inactivity_periods_count', 
        'scroll_events_total', 'subject_encoded'
    ]
    
    X = df[features]
    y = df['productivity_score']
    
    print(f"Features: {features}")
    print(f"Target: productivity_score (range: {y.min()}-{y.max()})")
    
    return X, y, label_encoder, df

def train_model(X, y):
    """Train the Decision Tree model."""
    print("\n🧠 Training Decision Tree model...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Initialize and train model
    model = DecisionTreeRegressor(
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate metrics
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    
    print(f"📈 Model Performance:")
    print(f"R² Score: {r2:.3f}")
    print(f"MAE: {mae:.2f}")
    print(f"MSE: {mse:.2f}")
    
    return model, X_test, y_test, y_pred

def save_model(model, label_encoder):
    """Save the trained model and encoder."""
    print(f"\n💾 Saving model to {MODEL_FILE}...")
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(MODEL_FILE), exist_ok=True)
    
    # Save model and encoder together
    model_package = {
        'model': model,
        'label_encoder': label_encoder,
        'feature_names': [
            'duration_minutes', 'tab_switches', 'keystroke_rate_per_minute',
            'mouse_movements_total', 'inactivity_periods_count', 
            'scroll_events_total', 'subject_encoded'
        ]
    }
    
    with open(MODEL_FILE, 'wb') as f:
        pickle.dump(model_package, f)
    
    print("✅ Model saved successfully!")

def create_visualization(y_test, y_pred):
    """Create and save the actual vs predicted visualization."""
    print(f"\n📊 Creating visualization...")
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(PLOT_FILE), exist_ok=True)
    
    # Set style
    plt.style.use('seaborn-v0_8')
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Create scatter plot
    ax.scatter(y_test, y_pred, alpha=0.6, s=50, color='#2E86AB')
    
    # Add perfect prediction line
    min_val = min(y_test.min(), y_pred.min())
    max_val = max(y_test.max(), y_pred.max())
    ax.plot([min_val, max_val], [min_val, max_val], 'r--', lw=2, label='Perfect Prediction')
    
    # Styling
    ax.set_xlabel('Actual Productivity Score', fontsize=12, fontweight='bold')
    ax.set_ylabel('Predicted Productivity Score', fontsize=12, fontweight='bold')
    ax.set_title('Model Performance: Actual vs Predicted Productivity Scores', 
                fontsize=14, fontweight='bold', pad=20)
    ax.legend()
    ax.grid(True, alpha=0.3)
    
    # Add metrics text
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    textstr = f'R² = {r2:.3f}\nMAE = {mae:.2f}'
    props = dict(boxstyle='round', facecolor='wheat', alpha=0.8)
    ax.text(0.05, 0.95, textstr, transform=ax.transAxes, fontsize=11,
            verticalalignment='top', bbox=props)
    
    plt.tight_layout()
    plt.savefig(PLOT_FILE, dpi=300, bbox_inches='tight')
    plt.show()
    
    print(f"📊 Visualization saved to {PLOT_FILE}")

def main():
    """Main training pipeline."""
    print("🚀 Focus Productivity Model Training")
    print("=" * 40)
    
    try:
        # Load and prepare data
        X, y, label_encoder, df = load_and_prepare_data()
        
        # Train model
        model, X_test, y_test, y_pred = train_model(X, y)
        
        # Save model
        save_model(model, label_encoder)
        
        # Create visualization
        create_visualization(y_test, y_pred)
        
        print("\n✅ Training completed successfully!")
        print(f"📁 Model saved: {MODEL_FILE}")
        print(f"📊 Plot saved: {PLOT_FILE}")
        
    except Exception as e:
        print(f"❌ Error during training: {e}")
        raise

if __name__ == "__main__":
    main()