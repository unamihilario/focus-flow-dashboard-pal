
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Calendar, Clock, Star, CheckCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoalSetterProps {
  currentGoal: number;
  onGoalChange: (goal: number) => void;
}

export const GoalSetter: React.FC<GoalSetterProps> = ({ currentGoal, onGoalChange }) => {
  const { toast } = useToast();
  const [newGoalValue, setNewGoalValue] = useState(currentGoal.toString());
  const [goalType, setGoalType] = useState("daily");
  
  const goals = [
    {
      id: 1,
      title: "Study 2 hours daily",
      type: "Daily",
      progress: 75,
      current: "1.5h",
      target: "2h",
      daysLeft: 0,
      status: "active",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Complete Math course",
      type: "Long-term",
      progress: 45,
      current: "18 chapters",
      target: "40 chapters",
      daysLeft: 30,
      status: "active",
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Study streak: 7 days",
      type: "Streak",
      progress: 85,
      current: "6 days",
      target: "7 days",
      daysLeft: 1,
      status: "active",
      color: "bg-orange-500"
    },
    {
      id: 4,
      title: "Focus score 90%+",
      type: "Weekly",
      progress: 100,
      current: "92%",
      target: "90%",
      daysLeft: 0,
      status: "completed",
      color: "bg-purple-500"
    }
  ];

  const handleUpdateGoal = () => {
    const newGoal = parseInt(newGoalValue);
    if (newGoal > 0 && newGoal <= 480) { // Max 8 hours
      onGoalChange(newGoal);
      toast({
        title: "Goal updated! 🎯",
        description: `Your new daily goal is ${newGoal} minutes`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case "active":
        return <Badge className="bg-blue-100 text-blue-700">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-700">Paused</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Study Goals</h2>
        <p className="text-gray-600">Set and track your learning objectives</p>
      </div>

      {/* Quick Goal Update */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-900">
            <Target className="w-5 h-5 mr-2" />
            Daily Study Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="goal-input" className="text-sm font-medium text-orange-800">
                Minutes per day
              </Label>
              <Input
                id="goal-input"
                type="number"
                value={newGoalValue}
                onChange={(e) => setNewGoalValue(e.target.value)}
                min="15"
                max="480"
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handleUpdateGoal}
              className="bg-orange-500 hover:bg-orange-600 mt-6"
            >
              Update Goal
            </Button>
          </div>
          <p className="text-sm text-orange-700">
            Current goal: {currentGoal} minutes per day
          </p>
        </CardContent>
      </Card>

      {/* Active Goals */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Your Goals</h3>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${goal.color} rounded-full`}></div>
                    <div>
                      <CardTitle className="text-base">{goal.title}</CardTitle>
                      <p className="text-sm text-gray-600">{goal.type}</p>
                    </div>
                  </div>
                  {getStatusBadge(goal.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{goal.current} / {goal.target}</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{goal.progress}% complete</span>
                    {goal.daysLeft > 0 && (
                      <span>{goal.daysLeft} days left</span>
                    )}
                  </div>
                </div>

                {/* Status Icons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {goal.status === "completed" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Completed!</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>In progress</span>
                      </>
                    )}
                  </div>
                  
                  {goal.status === "completed" && (
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Goal Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Goal Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Exam Prep", desc: "30 days intensive study", icon: "📚" },
              { name: "Skill Building", desc: "Learn new topic in 60 days", icon: "🎯" },
              { name: "Habit Formation", desc: "21-day study routine", icon: "⚡" }
            ].map((template, index) => (
              <Card key={index} className="border-dashed border-2 border-gray-300 hover:border-orange-300 cursor-pointer transition-colors">
                <CardContent className="text-center py-6">
                  <div className="text-2xl mb-2">{template.icon}</div>
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{template.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Showcase */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-900">
            <Trophy className="w-5 h-5 mr-2" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Week Warrior", desc: "Studied 5 days this week", date: "2 days ago" },
              { title: "Focus Master", desc: "90%+ focus score", date: "5 days ago" },
              { title: "Subject Explorer", desc: "Studied 4 different subjects", date: "1 week ago" }
            ].map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.desc}</p>
                  <p className="text-xs text-gray-500">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
