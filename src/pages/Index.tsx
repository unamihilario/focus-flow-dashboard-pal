import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, BarChart3, Target, Clock, Trophy, BookOpen, Coffee } from "lucide-react";
import { StudyTimer } from "@/components/StudyTimer";
import { SubjectManager } from "@/components/SubjectManager";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { GoalSetter } from "@/components/GoalSetter";
import { StudyLogs } from "@/components/StudyLogs";

const Index = () => {
  const [isStudying, setIsStudying] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem('studyGoal');
    return saved ? parseInt(saved) : 120;
  });
  const [studiedToday, setStudiedToday] = useState(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`studiedToday_${today}`);
    return saved ? parseInt(saved) : 0;
  });
  const [currentStreak, setCurrentStreak] = useState(() => {
    const saved = localStorage.getItem('currentStreak');
    return saved ? parseInt(saved) : 0;
  });
  const [activeTab, setActiveTab] = useState("study");

  // Persist data changes
  useEffect(() => {
    localStorage.setItem('studyGoal', dailyGoal.toString());
  }, [dailyGoal]);

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`studiedToday_${today}`, studiedToday.toString());
  }, [studiedToday]);

  useEffect(() => {
    localStorage.setItem('currentStreak', currentStreak.toString());
  }, [currentStreak]);

  const progressPercentage = Math.min((studiedToday / dailyGoal) * 100, 100);

  const handleGoToLogs = () => {
    setActiveTab("logs");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-coral-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">StudySaver</h1>
              <p className="text-sm text-gray-600">Your study companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
              <Trophy className="w-3 h-3 mr-1" />
              {currentStreak} day streak
            </Badge>
            <Button variant="outline" size="sm">
              <Coffee className="w-4 h-4 mr-2" />
              Take Break
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Ready to crush your study goals? 🚀
          </h2>
          <p className="text-gray-600 text-lg">
            Let's make today productive and rewarding
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-900">{studiedToday}m</span>
                  <span className="text-sm text-orange-600">of {dailyGoal}m goal</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-orange-600">
                  {dailyGoal - studiedToday > 0 ? `${dailyGoal - studiedToday}m to go` : "Goal achieved! 🎉"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-900">8.5h</div>
                <p className="text-sm text-blue-600">Total study time</p>
                <div className="flex space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-6 rounded-sm ${
                        i < 5 ? 'bg-blue-400' : 'bg-blue-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Focus Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-900">87%</div>
                <p className="text-sm text-green-600">Distraction-free time</p>
                <div className="text-xs text-green-600">↗️ +5% from yesterday</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(newTab) => {
          // Track tab switches as distractions if timer is running
          if (isStudying && newTab !== activeTab) {
            const event = new CustomEvent('tabSwitch', { 
              detail: { 
                from: activeTab, 
                to: newTab, 
                timestamp: Date.now(),
                type: 'internal_navigation'
              } 
            });
            window.dispatchEvent(event);
          }
          setActiveTab(newTab);
        }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="study" className="data-[state=active]:bg-orange-100">
              Study Timer
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-indigo-100">
              Study Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="study" className="space-y-6">
            <StudyTimer 
              isStudying={isStudying}
              onToggleStudying={setIsStudying}
              currentSession={currentSession}
              onSessionChange={setCurrentSession}
              onGoToLogs={handleGoToLogs}
              onStudyTimeUpdate={setStudiedToday}
            />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <StudyLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
