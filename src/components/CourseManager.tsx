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
    return [
      {
        id: 'ai-ml-course',
        title: 'AI/ML Course',
        materials: [
          {
            id: 'unit-1',
            name: 'Introduction to Machine Learning',
            type: 'text',
            size: 1024,
            content: `Introduction to Machine Learning

What is Machine Learning?

Machine Learning (ML) is a subset of artificial intelligence (AI) that enables systems to learn and improve from experience without explicit programming.

Key Concepts

1. Types of Machine Learning
- Supervised Learning: Learning with labeled examples
  - Classification (predicting categories)
  - Regression (predicting continuous values)
- Unsupervised Learning: Finding patterns without labels
  - Clustering
  - Dimensionality reduction
- Reinforcement Learning: Learning through interaction

2. Python Libraries for ML
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import accuracy_score

3. Data Processing Pipeline
Load data
data = pd.read_csv('dataset.csv')

Preprocess
X = data.drop('target', axis=1)
y = data['target']

Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

Train model
model = LinearRegression()
model.fit(X_train, y_train)

Evaluate
predictions = model.predict(X_test)
score = accuracy_score(y_test, predictions)
print(f"Model accuracy: {score}")`,
            uploadDate: new Date()
          }
        ]
      },
      {
        id: 'maths',
        title: 'Mathematics',
        materials: [
          {
            id: 'unit-1',
            name: 'Introduction to Calculus',
            type: 'text',
            size: 1024,
            content: `Introduction to Calculus

What is Calculus?

Calculus is the mathematical study of continuous change. It has two main branches: differential calculus (concerning rates of change) and integral calculus (concerning accumulation of quantities).

Key Concepts

1. Limits
The foundation of calculus. A limit describes the value that a function approaches as the input approaches some value.

Example:
lim(x→2) (x² - 4)/(x - 2) = 4

2. Derivatives
Measures the rate of change of a function at any point.

Basic derivative rules:
- d/dx(x^n) = nx^(n-1)
- d/dx(sin x) = cos x
- d/dx(e^x) = e^x
- d/dx(ln x) = 1/x

3. Integrals
The reverse of differentiation. Measures area under curves.

Basic integral rules:
- ∫ x^n dx = x^(n+1)/(n+1) + C
- ∫ sin x dx = -cos x + C
- ∫ e^x dx = e^x + C

Applications:
- Physics: velocity, acceleration
- Engineering: optimization problems
- Economics: marginal analysis`,
            uploadDate: new Date()
          }
        ]
      },
      {
        id: 'web-dev',
        title: 'Web Development',
        materials: [
          {
            id: 'unit-1',
            name: 'Introduction to Web Development',
            type: 'text',
            size: 1024,
            content: `Introduction to Web Development

What is Web Development?

Web development is the process of creating websites and web applications. It involves both front-end (client-side) and back-end (server-side) development.

Key Technologies

1. Frontend Technologies
- HTML: Structure and content markup
- CSS: Styling and layout
- JavaScript: Interactive behavior

Basic HTML structure:
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome</h1>
    <p>This is a paragraph.</p>
</body>
</html>

2. CSS Styling
CSS controls the visual appearance of web pages.

Basic CSS example:
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
}

h1 {
    color: blue;
    text-align: center;
}

3. JavaScript Interactivity
JavaScript adds dynamic behavior to websites.

Basic JavaScript example:
function greetUser() {
    const name = prompt("What's your name?");
    alert("Hello, " + name + "!");
}

4. Modern Frameworks
- React: Component-based UI library
- Vue.js: Progressive JavaScript framework
- Angular: Full-featured framework`,
            uploadDate: new Date()
          }
        ]
      },
      {
        id: 'cs-theory',
        title: 'Computer Science Theory',
        materials: [
          {
            id: 'unit-1',
            name: 'Introduction to Algorithms',
            type: 'text',
            size: 1024,
            content: `Introduction to Algorithms

What are Algorithms?

An algorithm is a step-by-step procedure for solving a problem or completing a task. In computer science, algorithms are fundamental for writing efficient programs.

Key Concepts

1. Algorithm Complexity
We measure algorithm efficiency using Big O notation:

- O(1): Constant time
- O(log n): Logarithmic time
- O(n): Linear time
- O(n²): Quadratic time
- O(2^n): Exponential time

2. Common Sorting Algorithms

Bubble Sort (O(n²)):
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]

Quick Sort (O(n log n) average):
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

3. Data Structures
- Arrays: Fixed-size sequential collection
- Linked Lists: Dynamic size, node-based
- Stacks: Last In, First Out (LIFO)
- Queues: First In, First Out (FIFO)
- Trees: Hierarchical structure
- Graphs: Networks of connected nodes`,
            uploadDate: new Date()
          }
        ]
      },
      {
        id: 'history',
        title: 'History',
        materials: [
          {
            id: 'unit-1',
            name: 'Introduction to World History',
            type: 'text',
            size: 1024,
            content: `Introduction to World History

What is History?

History is the study of past events, particularly in human affairs. It helps us understand how societies, cultures, and civilizations have developed over time.

Key Historical Periods

1. Ancient Civilizations (3000 BCE - 500 CE)
- Mesopotamia: First cities and writing systems
- Egypt: Pyramids and pharaohs
- Greece: Democracy and philosophy
- Rome: Empire and law systems

Major developments:
- Agriculture revolution
- Development of writing
- Formation of governments
- Trade networks

2. Medieval Period (500 - 1500 CE)
- Fall of Roman Empire
- Rise of Christianity and Islam
- Feudalism in Europe
- Byzantine Empire
- Crusades and cultural exchange

3. Renaissance and Exploration (1400 - 1600)
- Revival of learning and art
- Scientific revolution
- Age of exploration
- Printing press invention

Key figures:
- Leonardo da Vinci: Artist and inventor
- Christopher Columbus: Explorer
- Galileo Galilei: Astronomer

4. Modern Era (1600 - present)
- Industrial Revolution
- Democratic revolutions
- World Wars
- Globalization
- Digital age

Understanding history helps us:
- Learn from past mistakes
- Understand current events
- Appreciate cultural diversity
- Develop critical thinking skills`,
            uploadDate: new Date()
          }
        ]
      }
    ];
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
                {material.content
                  .replace(/^#{1,6}\s+/gm, '')  // Remove # ## ### etc
                  .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove **bold**
                  .replace(/\*(.*?)\*/g, '$1')  // Remove *italic*
                }
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