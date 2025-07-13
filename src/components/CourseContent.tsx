
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronLeft, ChevronRight, Clock, Target } from "lucide-react";

interface CourseContentProps {
  isStudying: boolean;
}

export const CourseContent: React.FC<CourseContentProps> = ({ isStudying }) => {
  const [currentUnit, setCurrentUnit] = useState(0);

  const courseUnits = [
    {
      title: "Unit 1: Introduction to Machine Learning",
      duration: "45 minutes",
      content: `
# Introduction to Machine Learning

## What is Machine Learning?

Machine Learning (ML) is a subset of artificial intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. ML focuses on the development of computer programs that can access data and use it to learn for themselves.

## Key Concepts

### 1. Types of Machine Learning
- **Supervised Learning**: Learning with labeled examples
  - Classification (predicting categories)
  - Regression (predicting continuous values)
- **Unsupervised Learning**: Finding patterns in data without labels
  - Clustering
  - Dimensionality reduction
- **Reinforcement Learning**: Learning through interaction and feedback

### 2. The Machine Learning Process
1. **Data Collection**: Gathering relevant data
2. **Data Preprocessing**: Cleaning and preparing data
3. **Feature Engineering**: Selecting and transforming variables
4. **Model Selection**: Choosing appropriate algorithms
5. **Training**: Teaching the model using data
6. **Evaluation**: Testing model performance
7. **Deployment**: Implementing the model in production

### 3. Common Applications
- Image recognition and computer vision
- Natural language processing
- Recommendation systems
- Fraud detection
- Autonomous vehicles
- Medical diagnosis

## Why Machine Learning Matters

Machine learning has become crucial in our data-driven world because:
- **Automation**: Reduces manual work and human error
- **Scalability**: Can process vast amounts of data
- **Personalization**: Provides customized experiences
- **Prediction**: Helps forecast future trends and behaviors

## Getting Started

To begin your ML journey, you'll need to understand:
1. Basic statistics and probability
2. Programming (Python/R)
3. Data manipulation libraries (pandas, numpy)
4. ML frameworks (scikit-learn, TensorFlow, PyTorch)

## Next Steps

In the following units, we'll dive deeper into:
- Data preprocessing techniques
- Supervised learning algorithms
- Model evaluation methods
- Real-world case studies
      `
    },
    {
      title: "Unit 2: Data Preprocessing",
      duration: "60 minutes",
      content: `
# Data Preprocessing

## Overview
Data preprocessing is a crucial step in the machine learning pipeline. Raw data is often messy, incomplete, or in formats that aren't suitable for ML algorithms.

## Common Data Issues
- Missing values
- Outliers
- Inconsistent formats
- Duplicate records
- Irrelevant features

## Preprocessing Techniques
1. **Data Cleaning**
2. **Feature Scaling**
3. **Encoding Categorical Variables**
4. **Handling Missing Data**
      `
    },
    {
      title: "Unit 3: Supervised Learning Algorithms",
      duration: "75 minutes", 
      content: `
# Supervised Learning Algorithms

## Classification Algorithms
- Decision Trees
- Random Forest
- Support Vector Machines
- Logistic Regression

## Regression Algorithms
- Linear Regression
- Polynomial Regression
- Ridge and Lasso Regression
      `
    }
  ];

  const currentUnitData = courseUnits[currentUnit];

  if (!isStudying) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <BookOpen className="w-5 h-5 mr-2" />
            AI/ML Course Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 mb-4">Start studying to access course materials</p>
          <div className="grid gap-3">
            {courseUnits.map((unit, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <h3 className="font-medium text-gray-900">{unit.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {unit.duration}
                  </div>
                </div>
                <Badge variant="outline">Ready</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-blue-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            {currentUnitData.title}
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            Unit {currentUnit + 1} of {courseUnits.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose prose-blue max-w-none">
          <div className="whitespace-pre-line text-gray-800 leading-relaxed">
            {currentUnitData.content}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            onClick={() => setCurrentUnit(Math.max(0, currentUnit - 1))}
            disabled={currentUnit === 0}
            variant="outline"
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous Unit
          </Button>
          
          <div className="text-sm text-gray-600">
            <Clock className="w-4 h-4 inline mr-1" />
            Estimated time: {currentUnitData.duration}
          </div>
          
          <Button
            onClick={() => setCurrentUnit(Math.min(courseUnits.length - 1, currentUnit + 1))}
            disabled={currentUnit === courseUnits.length - 1}
            className="flex items-center"
          >
            Next Unit
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
