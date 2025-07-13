
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, BookOpen, Clock, Timer, SkipForward, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTabVisibility } from "@/hooks/useTabVisibility";
import { useSpacedLearning } from "@/hooks/useSpacedLearning";
import { useMLDataCollection } from "@/hooks/useMLDataCollection";
import { MLDataCollector } from "@/components/MLDataCollector";
import { CourseContent } from "@/components/CourseContent";

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
  const [sessionTime, setSessionTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [distractionLog, setDistractionLog] = useState<{type: string, duration: number, timestamp: Date}[]>([]);
  const [lastDistractionStart, setLastDistractionStart] = useState<Date | null>(null);
  const { toast } = useToast();
  const isTabVisible = useTabVisibility();
  const spacedLearning = useSpacedLearning();
  
  // ML Data Collection for AI/ML course
  const mlDataCollection = useMLDataCollection(isStudying, "ai-ml-course");

  // Handle tab visibility changes - track distractions instead of pausing
  useEffect(() => {
    if (isStudying && !spacedLearning.isBreakTime) {
      if (!isTabVisible && !lastDistractionStart) {
        // Tab switched away - start tracking distraction
        setLastDistractionStart(new Date());
        toast({
          title: "Tab switch detected 👀",
          description: "Keep focused! Your distraction is being tracked.",
          variant: "destructive"
        });
      } else if (isTabVisible && lastDistractionStart) {
        // Tab came back - record distraction duration
        const distractionDuration = Math.floor((Date.now() - lastDistractionStart.getTime()) / 1000);
        if (distractionDuration >= 10) { // Only record if 10+ seconds
          setDistractionLog(prev => [...prev, {
            type: "Tab Switch",
            duration: distractionDuration,
            timestamp: lastDistractionStart
          }]);
          toast({
            title: "Distraction recorded 📊",
            description: `${distractionDuration}s tab switch logged for ML analysis.`,
          });
        }
        setLastDistractionStart(null);
      }
    }
  }, [isTabVisible, isStudying, lastDistractionStart, spacedLearning.isBreakTime]);

  // Timer logic - runs continuously during study
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudying && startTime && !spacedLearning.isBreakTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
        setSessionTime(elapsed);
        
        // Check if it's time for a break (25 minutes = 1500 seconds)
        if (elapsed >= spacedLearning.config.studyDuration * 60 && elapsed % (spacedLearning.config.studyDuration * 60) === 0) {
          spacedLearning.startBreak();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying, startTime, spacedLearning]);

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
    setStartTime(now);
    setSessionTime(0);
    setDistractionLog([]);
    setLastDistractionStart(null);
    onToggleStudying(true);
    
    const session = {
      id: Date.now(),
      subject: "ai-ml-course",
      startTime: now,
      isActive: true
    };
    onSessionChange(session);

    toast({
      title: "AI/ML Study Session Started! 🚀",
      description: "Focus tracking is active. Stay on task!",
    });
  };

  const handleStopStudying = () => {
    if (currentSession && sessionTime > 60) {
      // End ML data collection session
      mlDataCollection.endSession();
      
      toast({
        title: "Great work! 🎉",
        description: `You studied AI/ML for ${formatTime(sessionTime)}. ${distractionLog.length} distractions recorded.`,
      });
    }
    
    onToggleStudying(false);
    onSessionChange(null);
    setSessionTime(0);
    setStartTime(null);
    setDistractionLog([]);
    setLastDistractionStart(null);
  };

  const progressPercentage = (sessionTime / (spacedLearning.config.studyDuration * 60)) * 100;
  const totalDistractionTime = distractionLog.reduce((total, d) => total + d.duration, 0);

  // Break time UI
  if (spacedLearning.isBreakTime) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
            <Timer className="w-6 h-6 mr-2 text-green-500" />
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
      <Card className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
            <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
            AI/ML Course Study Session
          </CardTitle>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <Badge variant="outline">Session {spacedLearning.sessionCount + 1}</Badge>
            {isStudying && (
              <Badge variant={!isTabVisible ? "destructive" : "default"}>
                {!isTabVisible ? "Distracted" : "Focused"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pomodoro Progress */}
          {isStudying && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Study Progress</span>
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
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Timer running continuously</span>
                </div>
                
                {/* Distraction Summary */}
                {distractionLog.length > 0 && (
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center text-orange-600">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {distractionLog.length} distractions
                    </div>
                    <div className="text-red-600">
                      {formatTime(totalDistractionTime)} total distraction time
                    </div>
                  </div>
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
                className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Study AI/ML Now
              </Button>
            ) : (
              <Button
                onClick={handleStopStudying}
                variant="destructive"
                size="lg"
                className="px-6 py-3"
              >
                <Square className="w-4 h-4 mr-2" />
                End Session
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Course Content */}
      <CourseContent isStudying={isStudying} />

      {/* Distraction Log */}
      {isStudying && distractionLog.length > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Focus Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {distractionLog.map((distraction, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-orange-700">{distraction.type}</span>
                  <span className="text-orange-600">{formatTime(distraction.duration)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
