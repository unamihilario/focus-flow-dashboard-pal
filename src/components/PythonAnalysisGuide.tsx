import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Download, BarChart3, Brain, FileText, Play } from "lucide-react";

interface PythonAnalysisGuideProps {
  onExportDataset: () => void;
  sessionCount: number;
}

export const PythonAnalysisGuide: React.FC<PythonAnalysisGuideProps> = ({
  onExportDataset,
  sessionCount
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  const pythonCode = {
    setup: `# StudySaver ML Analysis Pipeline
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler

# Load your exported dataset
df = pd.read_csv('ml_focus_dataset_2024-01-15.csv', comment='#')
print(f"Dataset shape: {df.shape}")
print(df.head())`,

    exploration: `# Data Exploration & Visualization
# Focus level distribution
plt.figure(figsize=(10, 6))
sns.countplot(data=df, x='focus_classification')
plt.title('Distribution of Focus Levels')
plt.show()

# Correlation heatmap
numeric_cols = ['duration_minutes', 'tab_switches', 'keystroke_rate_per_minute', 
               'mouse_movements_total', 'scroll_events_total', 'productivity_score']
plt.figure(figsize=(12, 8))
sns.heatmap(df[numeric_cols].corr(), annot=True, cmap='coolwarm')
plt.title('Feature Correlation Matrix')
plt.show()

# Distraction analysis
df['distraction_ratio'] = df['tab_switches'] / df['duration_minutes']
sns.boxplot(data=df, x='focus_classification', y='distraction_ratio')
plt.title('Distraction Ratio by Focus Level')
plt.show()`,

    modeling: `# Machine Learning Model Training
# Feature selection
features = ['duration_minutes', 'tab_switches', 'keystroke_rate_per_minute', 
           'mouse_movements_total', 'scroll_events_total', 'productivity_score']

X = df[features]
y = df['focus_classification']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Random Forest
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_scaled, y_train)

# Predictions
y_pred = rf_model.predict(X_test_scaled)

# Evaluation
print("Classification Report:")
print(classification_report(y_test, y_pred))

# Feature Importance
feature_importance = pd.DataFrame({
    'feature': features,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

plt.figure(figsize=(10, 6))
sns.barplot(data=feature_importance, x='importance', y='feature')
plt.title('Feature Importance for Focus Prediction')
plt.show()`,

    prediction: `# Real-time Focus Prediction Function
def predict_focus_level(session_data):
    """
    Predict focus level for a new study session
    
    Args:
        session_data: dict with keys matching feature names
    
    Returns:
        str: Predicted focus level ('attentive', 'semi-attentive', 'distracted')
    """
    
    # Convert to DataFrame
    session_df = pd.DataFrame([session_data])
    
    # Scale features
    session_scaled = scaler.transform(session_df[features])
    
    # Predict
    prediction = rf_model.predict(session_scaled)[0]
    probability = rf_model.predict_proba(session_scaled)[0]
    
    return {
        'predicted_focus': prediction,
        'confidence': max(probability),
        'probabilities': dict(zip(rf_model.classes_, probability))
    }

# Example usage
new_session = {
    'duration_minutes': 45,
    'tab_switches': 3,
    'keystroke_rate_per_minute': 12,
    'mouse_movements_total': 450,
    'scroll_events_total': 25,
    'productivity_score': 8
}

result = predict_focus_level(new_session)
print(f"Predicted focus: {result['predicted_focus']}")
print(f"Confidence: {result['confidence']:.2%}")`,

    advanced: `# Advanced Analysis & Model Comparison
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.preprocessing import LabelEncoder

# Compare multiple models
models = {
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'SVM': SVC(probability=True, random_state=42),
    'Decision Tree': DecisionTreeClassifier(random_state=42)
}

# Encode labels for ROC analysis
le = LabelEncoder()
y_train_encoded = le.fit_transform(y_train)
y_test_encoded = le.transform(y_test)

results = {}
for name, model in models.items():
    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)
    
    results[name] = {
        'accuracy': accuracy_score(y_test, y_pred),
        'predictions': y_pred
    }

# Results comparison
for name, result in results.items():
    print(f"{name}: {result['accuracy']:.3f}")

# Time series analysis of focus trends
df['timestamp'] = pd.to_datetime(df['timestamp'])
daily_focus = df.groupby(df['timestamp'].dt.date)['productivity_score'].mean()

plt.figure(figsize=(12, 6))
daily_focus.plot(kind='line', marker='o')
plt.title('Daily Focus Trend Over Time')
plt.xlabel('Date')
plt.ylabel('Average Productivity Score')
plt.show()`
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-900">
            <Brain className="w-6 h-6 mr-2" />
            Python ML Analysis Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700">
                Ready to analyze your study behavior data with machine learning?
              </p>
              <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-700">
                {sessionCount} sessions collected
              </Badge>
            </div>
            <Button 
              onClick={onExportDataset}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={sessionCount === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Dataset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Python Code Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Setup</TabsTrigger>
          <TabsTrigger value="exploration">Explore</TabsTrigger>
          <TabsTrigger value="modeling">Model</TabsTrigger>
          <TabsTrigger value="prediction">Predict</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Dataset Import & Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{pythonCode.setup}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exploration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Data Exploration & Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{pythonCode.exploration}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modeling">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                ML Model Training
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{pythonCode.modeling}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Real-time Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{pythonCode.prediction}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Model Comparison & Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{pythonCode.advanced}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis Tips */}
      <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-900">💡 Analysis Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-emerald-700">
          <p>• <strong>Minimum Dataset Size:</strong> Collect at least 20-30 sessions for reliable ML training</p>
          <p>• <strong>Feature Engineering:</strong> The distraction_ratio is your most important predictor</p>
          <p>• <strong>Model Selection:</strong> Random Forest typically performs best for this type of behavioral data</p>
          <p>• <strong>Validation:</strong> Use your personal patterns to validate model predictions</p>
          <p>• <strong>Improvement:</strong> Track model accuracy over time as you collect more data</p>
        </CardContent>
      </Card>
    </div>
  );
};