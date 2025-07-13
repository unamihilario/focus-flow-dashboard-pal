import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, BookOpen, Clock, Zap, Coffee, Timer, SkipForward } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTabVisibility } from "@/hooks/useTabVisibility";
import { useSpacedLearning } from "@/hooks/useSpacedLearning";
import { useMLDataCollection } from "@/hooks/useMLDataCollection";
import { MLDataCollector } from "@/components/MLDataCollector";

interface StudyTimerProps {
  isStudying: boolean;
  onToggleStudying: (studying: boolean) => void;
  currentSession: any;
  onSessionChange: (session: any) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  isStudying,
  onToggleStudying,
  currentSession,
  onSessionChange
}) => {
  const [selectedSubject, setSelectedSubject] = useState("mathematics");
  const [sessionTime, setSessionTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [autoStartEnabled, setAutoStartEnabled] = useState(true);
  const { toast } = useToast();
  const isTabVisible = useTabVisibility();
  const spacedLearning = useSpacedLearning();
  
  // ML Data Collection
  const mlDataCollection = useMLDataCollection(isStudying, selectedSubject);

  const subjects = [
    { id: "mathematics", name: "Mathematics", color: "bg-blue-500", emoji: "📐" },
    { id: "physics", name: "Physics", color: "bg-purple-500", emoji: "⚛️" },
    { id: "chemistry", name: "Chemistry", color: "bg-green-500", emoji: "🧪" },
    { id: "biology", name: "Biology", color: "bg-emerald-500", emoji: "🧬" },
    { id: "history", name: "History", color: "bg-amber-500", emoji: "📚" },
    { id: "literature", name: "Literature", color: "bg-rose-500", emoji: "📖" },
    { id: "coding", name: "Programming", color: "bg-gray-700", emoji: "💻" }
  ];

  // Handle tab visibility changes
  useEffect(() => {
    if (isStudying && !spacedLearning.isBreakTime) {
      if (!isTabVisible) {
        // Tab switched away - pause automatically
        onToggleStudying(false);
        toast({
          title: "Session paused 👀",
          description: "Timer paused because you switched tabs. Stay focused!",
        });
      } else if (autoStartEnabled && !isStudying && currentSession) {
        // Tab came back - auto-resume if enabled
        setTimeout(() => {
          onToggleStudying(true);
          toast({
            title: "Welcome back! 🔥",
            description: "Timer resumed automatically. Let's keep studying!",
          });
        }, 1000);
      }
    }
  }, [isTabVisible, isStudying, autoStartEnabled, currentSession, spacedLearning.isBreakTime]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudying && startTime && !spacedLearning.isBreakTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000) - pausedTime;
        setSessionTime(elapsed);
        
        // Check if it's time for a break (25 minutes = 1500 seconds)
        if (elapsed >= spacedLearning.config.studyDuration * 60 && elapsed % (spacedLearning.config.studyDuration * 60) === 0) {
          handlePauseStudying();
          spacedLearning.startBreak();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying, startTime, pausedTime, spacedLearning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStudying = () => {
    const now = new Date();
    if (!startTime) {
      setStartTime(now);
      setSessionTime(0);
      setPausedTime(0);
    }
    onToggleStudying(true);
    
    if (!currentSession) {
      const session = {
        id: Date.now(),
        subject: selectedSubject,
        startTime: now,
        isActive: true
      };
      onSessionChange(session);
    }

    toast({
      title: "Study session started! 🚀",
      description: `Good luck with ${subjects.find(s => s.id === selectedSubject)?.name}!`,
    });
  };

  const handlePauseStudying = () => {
    onToggleStudying(false);
    if (startTime) {
      setPausedTime(prev => prev + Math.floor((Date.now() - startTime.getTime()) / 1000) - sessionTime);
    }
    toast({
      title: "Session paused ⏸️",
      description: "Take a breather, you're doing great!",
    });
  };

  const handleStopStudying = () => {
    if (currentSession && sessionTime > 60) {
      // End ML data collection session
      mlDataCollection.endSession();
      
      toast({
        title: "Great work! 🎉",
        description: `You studied ${subjects.find(s => s.id === selectedSubject)?.name} for ${formatTime(sessionTime)}`,
      });
    }
    
    onToggleStudying(false);
    onSessionChange(null);
    setSessionTime(0);
    setStartTime(null);
    setPausedTime(0);
  };

  // Auto-start when subject is selected
  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    if (autoStartEnabled && !isStudying && !spacedLearning.isBreakTime) {
      setTimeout(() => {
        handleStartStudying();
      }, 500);
    }
  };

  const currentSubject = subjects.find(s => s.id === selectedSubject);
  const progressPercentage = (sessionTime / (spacedLearning.config.studyDuration * 60)) * 100;

  // Break time UI
  if (spacedLearning.isBreakTime) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
            <Coffee className="w-6 h-6 mr-2 text-green-500" />
            Break Time! 🌿
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="text-4xl font-mono font-bold text-green-600">
            {spacedLearning.formatBreakTime(spacedLearning.breakTimeLeft)}
          </div>
          <p className="text-gray-600">
            {spacedLearning.getNextBreakType() === 'long' 
              ? "Long break - stretch, walk, or grab a snack!" 
              : "Short break - rest your eyes and mind!"
            }
          </p>
          <div className="text-sm text-gray-500">
            Session {spacedLearning.sessionCount} completed
          </div>
          <Button 
            onClick={spacedLearning.skipBreak}
            variant="outline"
            className="mt-4"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip Break
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* ML Data Collector */}
      <MLDataCollector
        isStudying={isStudying}
        currentMetrics={mlDataCollection.getCurrentMetrics()}
        sessionCount={mlDataCollection.sessionData.length}
        onEndSession={mlDataCollection.endSession}
        onExportData={mlDataCollection.exportToCSV}
      />

      {/* Main Timer Card */}
      <Card className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
            <Clock className="w-6 h-6 mr-2 text-orange-500" />
            {isStudying ? "You're in the zone! 🔥" : "Ready to focus?"}
          </CardTitle>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <Badge variant="outline">Session {spacedLearning.sessionCount + 1}</Badge>
            <Badge variant="outline">
              Next: {spacedLearning.getNextBreakType()} break
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-start Toggle */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-700">Auto-start when subject selected</span>
            <Button
              onClick={() => setAutoStartEnabled(!autoStartEnabled)}
              variant={autoStartEnabled ? "default" : "outline"}
              size="sm"
            >
              {autoStartEnabled ? "ON" : "OFF"}
            </Button>
          </div>

          {/* Subject Selection */}
          {!isStudying && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">What are you studying today?</label>
              <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder="Choose your subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{subject.emoji}</span>
                        <span>{subject.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Current Subject Display */}
          {isStudying && currentSubject && (
            <div className="text-center space-y-2">
              <Badge className={`${currentSubject.color} text-white px-4 py-2 text-lg`}>
                {currentSubject.emoji} {currentSubject.name}
              </Badge>
            </div>
          )}

          {/* Pomodoro Progress */}
          {isStudying && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Pomodoro Progress</span>
                <span>{Math.min(Math.floor(progressPercentage), 100)}%</span>
              </div>
              <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold text-gray-900 tracking-wider">
              {formatTime(sessionTime)}
            </div>
            
            {isStudying && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Active session</span>
                {!isTabVisible && (
                  <Badge variant="destructive" className="ml-2">Tab not focused</Badge>
                )}
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            {!isStudying ? (
              <Button
                onClick={handleStartStudying}
                size="lg"
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Studying
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button
                  onClick={handlePauseStudying}
                  variant="outline"
                  size="lg"
                  className="px-6 py-3"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={handleStopStudying}
                  variant="destructive"
                  size="lg"
                  className="px-6 py-3"
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Session
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Spaced Learning Info */}
      {!isStudying && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Timer className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-purple-900">🌿 Spaced Learning Active</h3>
            </div>
            <div className="space-y-2 text-sm text-purple-700">
              <p>• {spacedLearning.config.studyDuration} minute study sessions</p>
              <p>• {spacedLearning.config.shortBreak} minute short breaks</p>
              <p>• {spacedLearning.config.longBreak} minute long breaks after {spacedLearning.config.sessionsBeforeLongBreak} sessions</p>
              <p>• Timer pauses automatically when you switch tabs</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions - only show when not studying and not in break */}
      {!isStudying && !spacedLearning.isBreakTime && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-gray-200 hover:border-orange-300">
            <CardContent className="text-center py-6">
              <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Quick Session</h3>
              <p className="text-sm text-gray-600">25 min Pomodoro</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-gray-200 hover:border-blue-300">
            <CardContent className="text-center py-6">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Deep Work</h3>
              <p className="text-sm text-gray-600">90 min focused</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-gray-200 hover:border-green-300">
            <CardContent className="text-center py-6">
              <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold text-gray-900">Custom</h3>
              <p className="text-sm text-gray-600">Set your own time</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
