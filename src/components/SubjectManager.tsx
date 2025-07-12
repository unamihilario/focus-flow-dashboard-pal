
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, BookOpen, Clock, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SubjectManager = () => {
  const { toast } = useToast();
  const [subjects] = useState([
    {
      id: "mathematics",
      name: "Mathematics",
      emoji: "📐",
      color: "bg-blue-500",
      totalTime: 1250, // minutes
      weeklyGoal: 300,
      thisWeek: 180,
      sessions: 15,
      averageSession: 83
    },
    {
      id: "physics",
      name: "Physics",
      emoji: "⚛️",
      color: "bg-purple-500",
      totalTime: 890,
      weeklyGoal: 240,
      thisWeek: 120,
      sessions: 12,
      averageSession: 74
    },
    {
      id: "chemistry",
      name: "Chemistry",
      emoji: "🧪",
      color: "bg-green-500",
      totalTime: 650,
      weeklyGoal: 180,
      thisWeek: 95,
      sessions: 8,
      averageSession: 81
    },
    {
      id: "biology",
      name: "Biology",
      emoji: "🧬",
      color: "bg-emerald-500",
      totalTime: 420,
      weeklyGoal: 150,
      thisWeek: 75,
      sessions: 6,
      averageSession: 70
    }
  ]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-orange-500";
    return "bg-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Subjects</h2>
          <p className="text-gray-600">Track progress across all your study topics</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => {
          const weeklyProgress = (subject.thisWeek / subject.weeklyGoal) * 100;
          
          return (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                      {subject.emoji}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <p className="text-sm text-gray-600">{subject.sessions} sessions total</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100">
                    {formatTime(subject.totalTime)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Weekly Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700">This Week</span>
                    <span className="text-gray-600">
                      {formatTime(subject.thisWeek)} / {formatTime(subject.weeklyGoal)}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(weeklyProgress, 100)} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    {weeklyProgress >= 100 ? "Weekly goal achieved! 🎉" : `${Math.round(weeklyProgress)}% of weekly goal`}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                    <div className="text-lg font-semibold text-gray-900">{subject.averageSession}m</div>
                    <div className="text-xs text-gray-600">Avg session</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                    <div className="text-lg font-semibold text-gray-900">+12%</div>
                    <div className="text-xs text-gray-600">vs last week</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Target className="w-3 h-3 mr-1" />
                    Set Goal
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Study Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add New Subject Card */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-orange-300 transition-colors cursor-pointer">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Subject</h3>
          <p className="text-gray-600 mb-4">Start tracking a new area of study</p>
          <Button variant="outline">
            Create Subject
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
