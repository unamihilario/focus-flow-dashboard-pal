import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Upload, FileText, Plus, Trash2, Clock, Target, Play } from "lucide-react";

interface Course {
  id: string;
  title: string;
  materials: Material[];
}

interface Material {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  uploadDate: Date;
}

interface CourseManagerProps {
  isStudying: boolean;
  onStartStudying?: (courseId: string, materialId: string) => void;
  selectedCourse?: string;
  selectedMaterial?: string;
}

export const CourseManager: React.FC<CourseManagerProps> = ({ 
  isStudying, 
  onStartStudying,
  selectedCourse,
  selectedMaterial
}) => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('studyAppCourses');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((course: Course) => ({
        ...course,
        materials: course.materials.map(material => ({
          ...material,
          uploadDate: new Date(material.uploadDate)
        }))
      }));
    }
    return [{
      id: 'ml-course',
      title: 'Machine Learning Fundamentals',
      materials: [
        {
          id: 'unit-1',
          name: 'Introduction to Machine Learning',
          type: 'text',
          size: 1024,
          content: `# Introduction to Machine Learning

## What is Machine Learning?

Machine Learning (ML) is a subset of artificial intelligence (AI) that enables systems to learn and improve from experience without explicit programming.

## Key Concepts

### 1. Types of Machine Learning
- **Supervised Learning**: Learning with labeled examples
  - Classification (predicting categories)
  - Regression (predicting continuous values)
- **Unsupervised Learning**: Finding patterns without labels
  - Clustering
  - Dimensionality reduction
- **Reinforcement Learning**: Learning through interaction

### 2. Python Libraries for ML
\`\`\`python
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import accuracy_score
\`\`\`

### 3. Data Processing Pipeline
\`\`\`python
# Load data
data = pd.read_csv('dataset.csv')

# Preprocess
X = data.drop('target', axis=1)
y = data['target']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
score = accuracy_score(y_test, predictions)
print(f"Model accuracy: {score}")
\`\`\``,
          uploadDate: new Date()
        }
      ]
    }];
  });
  
  const [newCourseName, setNewCourseName] = useState('');
  const [showNewCourse, setShowNewCourse] = useState(false);

  const handleFileUpload = (courseId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newMaterial: Material = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        content: content,
        uploadDate: new Date()
      };

      setCourses(prev => {
        const updated = prev.map(course => 
          course.id === courseId 
            ? { ...course, materials: [...course.materials, newMaterial] }
            : course
        );
        localStorage.setItem('studyAppCourses', JSON.stringify(updated));
        return updated;
      });
    };
    reader.readAsText(file);
  };

  const addCourse = () => {
    if (!newCourseName.trim()) return;
    
    const newCourse: Course = {
      id: Date.now().toString(),
      title: newCourseName,
      materials: []
    };
    
    setCourses(prev => {
      const updated = [...prev, newCourse];
      localStorage.setItem('studyAppCourses', JSON.stringify(updated));
      return updated;
    });
    
    setNewCourseName('');
    setShowNewCourse(false);
  };

  const deleteMaterial = (courseId: string, materialId: string) => {
    setCourses(prev => {
      const updated = prev.map(course => 
        course.id === courseId 
          ? { ...course, materials: course.materials.filter(m => m.id !== materialId) }
          : course
      );
      localStorage.setItem('studyAppCourses', JSON.stringify(updated));
      return updated;
    });
  };

  if (isStudying && selectedCourse && selectedMaterial) {
    const course = courses.find(c => c.id === selectedCourse);
    const material = course?.materials.find(m => m.id === selectedMaterial);
    
    if (material) {
      return (
        <Card className="bg-white border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                {material.name}
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {course?.title}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-blue max-w-none">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                {material.content}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center text-blue-900">
            <BookOpen className="w-5 h-5 mr-2" />
            Study Materials
          </div>
          <Button
            onClick={() => setShowNewCourse(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Course
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showNewCourse && (
          <div className="mb-4 p-4 bg-white rounded-lg border">
            <div className="flex space-x-2">
              <Input
                placeholder="Course name"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCourse()}
              />
              <Button onClick={addCourse} size="sm">Add</Button>
              <Button onClick={() => setShowNewCourse(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{course.title}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{course.materials.length} materials</Badge>
                  <input
                    type="file"
                    id={`upload-${course.id}`}
                    className="hidden"
                    accept=".txt,.md,.pdf"
                    onChange={(e) => handleFileUpload(course.id, e)}
                  />
                  <Button
                    onClick={() => document.getElementById(`upload-${course.id}`)?.click()}
                    size="sm"
                    variant="outline"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </div>
              
              {course.materials.length === 0 ? (
                <p className="text-gray-500 text-sm">No materials uploaded yet</p>
              ) : (
                <div className="grid gap-2">
                  {course.materials.map((material) => (
                    <div 
                      key={material.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => onStartStudying?.(course.id, material.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm">{material.name}</p>
                          <p className="text-xs text-gray-500">
                            {(material.size / 1024).toFixed(1)} KB • {material.uploadDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Play className="w-4 h-4 text-green-500" />
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMaterial(course.id, material.id);
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};