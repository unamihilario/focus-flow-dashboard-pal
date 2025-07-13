
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
  }, [isTabVisible, isStudying, lastDistractionStart, spacedLearning.isBreakTime, toast]);

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

  const handleStopStudying = () => {
    try {
      if (currentSession && sessionTime > 60) {
        const currentMetrics = mlDataCollection.getCurrentMetrics();
        const predictedRating = predictFocusLevel(
          currentMetrics.tabSwitches,
          sessionTime,
          distractionLog.length
        );

        // End ML data collection session with predicted rating
        mlDataCollection.endSession(predictedRating);
        
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
