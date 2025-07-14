
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTabVisibility } from "@/hooks/useTabVisibility";
import { useSpacedLearning } from "@/hooks/useSpacedLearning";
import { useMLDataCollection } from "@/hooks/useMLDataCollection";
import { CourseContent } from "@/components/CourseContent";
import { FloatingTimer } from "@/components/FloatingTimer";
import { SessionRatingPopup } from "@/components/SessionRatingPopup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StudyTimerProps {
  isStudying: boolean;
  onToggleStudying: (studying: boolean) => void;
  currentSession: any;
  onSessionChange: (session: any) => void;
  onGoToLogs?: () => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  isStudying,
  onToggleStudying,
  currentSession,
  onSessionChange,
  onGoToLogs
}) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [distractionLog, setDistractionLog] = useState<{type: string, duration: number, timestamp: Date}[]>([]);
  const [lastDistractionStart, setLastDistractionStart] = useState<Date | null>(null);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [currentUnit, setCurrentUnit] = useState(0);
  const { toast } = useToast();
  const isTabVisible = useTabVisibility();
  const spacedLearning = useSpacedLearning();
  
  // ML Data Collection for AI/ML course
  const mlDataCollection = useMLDataCollection(isStudying, "ai-ml-course");

// Handle tab visibility changes - track distractions AND navigation between tabs
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
        if (distractionDuration >= 5) { // Record if 5+ seconds (lowered threshold)
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
  }, [isTabVisible, isStudying, lastDistractionStart, spacedLearning.isBreakTime, toast]);

  // Track internal navigation (between Study Timer tabs) as distractions
  useEffect(() => {
    if (isStudying && !spacedLearning.isBreakTime) {
      const handleNavigation = () => {
        setDistractionLog(prev => [...prev, {
          type: "Navigation Switch",
          duration: 2, // Minimal duration for navigation
          timestamp: new Date()
        }]);
      };
      
      // Listen for route changes or navigation events
      window.addEventListener('popstate', handleNavigation);
      return () => window.removeEventListener('popstate', handleNavigation);
    }
  }, [isStudying, spacedLearning.isBreakTime]);

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

  // Auto-predict focus level based on activity
  const predictFocusLevel = (
    tabSwitches: number,
    sessionDuration: number,
    distractionCount: number
  ): 'attentive' | 'semi-attentive' | 'distracted' => {
    const distractionScore = 
      (tabSwitches > 3 ? 2 : 0) +
      (distractionCount > 2 ? 2 : 0) +
      (sessionDuration > 0 && distractionCount / (sessionDuration / 60) > 2 ? 1 : 0);

    if (distractionScore >= 4) return 'distracted';
    if (distractionScore >= 2) return 'semi-attentive';
    return 'attentive';
  };

  const handleStartStudying = (unitIndex: number) => {
    const now = new Date();
    setStartTime(now);
    setSessionTime(0);
    setDistractionLog([]);
    setLastDistractionStart(null);
    setCurrentUnit(unitIndex);
    onToggleStudying(true);
    
    const session = {
      id: Date.now(),
      subject: "ai-ml-course",
      startTime: now,
      isActive: true,
      unitIndex
    };
    onSessionChange(session);

    toast({
      title: "AI/ML Study Session Started! 🚀",
      description: "Focus tracking is active. Stay on task!",
    });
  };

  // Save session to localStorage and show rating
  const saveSessionToLogs = (sessionData: any) => {
    const savedLogs = localStorage.getItem('studyLogs');
    const logs = savedLogs ? JSON.parse(savedLogs) : [];
    
    const newSession = {
      id: `session_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      subject: "AI/ML Course",
      duration: Math.floor(sessionTime / 60),
      focusScore: Math.round((sessionData.focusScore || 85) + Math.random() * 10),
      startTime: startTime?.toTimeString().slice(0, 5) || "00:00",
      endTime: new Date().toTimeString().slice(0, 5),
      tabSwitches: sessionData.tabSwitches || 0,
      distractions: sessionData.distractions || 0,
      keystrokeRate: sessionData.keystrokeRate || 0,
      mouseMovements: sessionData.mouseMovements || 0,
      inactivityPeriods: sessionData.inactivityPeriods || 0,
      scrollActivity: sessionData.scrollActivity || 0,
    };
    
    logs.push(newSession);
    localStorage.setItem('studyLogs', JSON.stringify(logs));
  };

  const handleStopStudying = () => {
    try {
      if (currentSession && sessionTime > 30) { // Lowered minimum time
        const currentMetrics = mlDataCollection.getCurrentMetrics();
        const predictedRating = predictFocusLevel(
          currentMetrics.tabSwitches,
          sessionTime,
          distractionLog.length
        );

        // End ML data collection session with predicted rating
        const sessionResult = mlDataCollection.endSession(predictedRating);
        
        // Save to study logs
        saveSessionToLogs({
          tabSwitches: currentMetrics.tabSwitches,
          distractions: distractionLog.length,
          keystrokeRate: currentMetrics.keystrokes,
          mouseMovements: currentMetrics.mouseMovements,
          inactivityPeriods: currentMetrics.inactivityPeriods,
          scrollActivity: currentMetrics.scrolls,
          focusScore: predictedRating === 'attentive' ? 90 : predictedRating === 'semi-attentive' ? 75 : 60
        });
        
        setShowRatingPopup(true);
      }
    } catch (error) {
      console.log('Error during session end:', error);
      // Continue with cleanup even if ML data collection fails
    }
    
    onToggleStudying(false);
    onSessionChange(null);
  };

  const handleBackToUnits = () => {
    setShowRatingPopup(false);
    setSessionTime(0);
    setStartTime(null);
    setDistractionLog([]);
    setLastDistractionStart(null);
  };

  const handleGoToLogs = () => {
    setShowRatingPopup(false);
    setSessionTime(0);
    setStartTime(null);
    setDistractionLog([]);
    setLastDistractionStart(null);
    onGoToLogs?.();
  };

  // Break time UI
  if (spacedLearning.isBreakTime) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-600">
              Break Time! 🌿
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-mono font-bold text-gray-900">
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
            >
              Skip Break
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Content */}
      <CourseContent 
        isStudying={isStudying} 
        onStartStudying={handleStartStudying}
        currentUnit={currentUnit}
      />

      {/* Floating Timer */}
      <FloatingTimer
        sessionTime={sessionTime}
        isVisible={isStudying}
        distractionCount={distractionLog.length}
        onStop={handleStopStudying}
      />

      {/* Session Rating Popup */}
      <SessionRatingPopup
        isVisible={showRatingPopup}
        sessionTime={sessionTime}
        distractionCount={distractionLog.length}
        predictedRating={predictFocusLevel(
          mlDataCollection.getCurrentMetrics().tabSwitches,
          sessionTime,
          distractionLog.length
        )}
        onBackToUnits={handleBackToUnits}
        onGoToLogs={handleGoToLogs}
      />
    </div>
  );
};
