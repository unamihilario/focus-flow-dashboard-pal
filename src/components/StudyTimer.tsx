import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTabVisibility } from "@/hooks/useTabVisibility";
import { useSpacedLearning } from "@/hooks/useSpacedLearning";
import { useMLDataCollection } from "@/hooks/useMLDataCollection";
import { CourseManager } from "@/components/CourseManager";
import { FloatingTimer } from "@/components/FloatingTimer";
import { FocusScoreOverlay } from "@/components/FocusScoreOverlay";
import { SessionRatingPopup } from "@/components/SessionRatingPopup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StudyTimerProps {
  isStudying: boolean;
  onToggleStudying: (studying: boolean) => void;
  currentSession: any;
  onSessionChange: (session: any) => void;
  onGoToLogs?: () => void;
  onStudyTimeUpdate?: (minutes: number) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  isStudying,
  onToggleStudying,
  currentSession,
  onSessionChange,
  onGoToLogs,
  onStudyTimeUpdate
}) => {
  const [sessionTime, setSessionTime] = useState(() => {
    const saved = localStorage.getItem('currentSessionTime');
    return saved ? parseInt(saved) : 0;
  });
  const [startTime, setStartTime] = useState<Date | null>(() => {
    const saved = localStorage.getItem('currentSessionStart');
    return saved ? new Date(saved) : null;
  });
  const [distractionLog, setDistractionLog] = useState<Array<{
    type: 'tab_switch' | 'navigation' | 'internal_navigation';
    timestamp: number;
    duration?: number;
  }>>(() => {
    const saved = localStorage.getItem('currentDistractionLog');
    return saved ? JSON.parse(saved) : [];
  });
  const [lastDistractionStart, setLastDistractionStart] = useState<number | null>(() => {
    const saved = localStorage.getItem('lastDistractionStart');
    return saved ? parseInt(saved) : null;
  });
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  const { toast } = useToast();
  const isTabVisible = useTabVisibility();
  const spacedLearning = useSpacedLearning();
  const mlDataCollection = useMLDataCollection(isStudying, "ai-ml-course");

  // Persist timer state
  useEffect(() => {
    localStorage.setItem('currentSessionTime', sessionTime.toString());
  }, [sessionTime]);

  useEffect(() => {
    if (startTime) {
      localStorage.setItem('currentSessionStart', startTime.toISOString());
    } else {
      localStorage.removeItem('currentSessionStart');
    }
  }, [startTime]);

  useEffect(() => {
    localStorage.setItem('currentDistractionLog', JSON.stringify(distractionLog));
  }, [distractionLog]);

  useEffect(() => {
    if (lastDistractionStart !== null) {
      localStorage.setItem('lastDistractionStart', lastDistractionStart.toString());
    } else {
      localStorage.removeItem('lastDistractionStart');
    }
  }, [lastDistractionStart]);

  // Track distraction events
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isStudying && currentSession) {
        const now = Date.now();
        
        if (document.hidden) {
          // Tab became hidden - start tracking distraction
          setLastDistractionStart(now);
        } else {
          // Tab became visible - end tracking distraction
          if (lastDistractionStart) {
            const duration = now - lastDistractionStart;
            const newDistraction = {
              type: 'tab_switch' as const,
              timestamp: now,
              duration
            };
            
            setDistractionLog(prev => [...prev, newDistraction]);
            setLastDistractionStart(null);
          }
        }
      }
    };

    const handlePopState = () => {
      if (isStudying && currentSession) {
        const now = Date.now();
        const newDistraction = {
          type: 'navigation' as const,
          timestamp: now,
          duration: 0
        };
        
        setDistractionLog(prev => [...prev, newDistraction]);
      }
    };

    const handleTabSwitch = (event: CustomEvent) => {
      if (isStudying && currentSession) {
        const { from, to, timestamp, type } = event.detail;
        const newDistraction = {
          type: type || 'internal_navigation' as const,
          timestamp,
          duration: 0
        };
        
        setDistractionLog(prev => [...prev, newDistraction]);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('tabSwitch', handleTabSwitch as EventListener);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('tabSwitch', handleTabSwitch as EventListener);
    };
  }, [isStudying, currentSession, lastDistractionStart, mlDataCollection]);

  // Timer and spaced learning logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudying && startTime && !spacedLearning.isBreakTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
        setSessionTime(elapsed);
        
        // Check if it's time for a break
        if (elapsed >= spacedLearning.config.studyDuration * 60 && elapsed % (spacedLearning.config.studyDuration * 60) === 0) {
          spacedLearning.startBreak();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying, startTime, spacedLearning]);

  const predictFocusLevel = (sessionDuration: number, totalDistractionTime: number): 'attentive' | 'semi-attentive' | 'distracted' => {
    const sessionMinutes = sessionDuration / 60;
    const distractionMinutes = totalDistractionTime / 60;
    
    // If more than 50% of time in hour-long session was distracted, it's bad focus
    if (sessionMinutes >= 60 && distractionMinutes >= 30) {
      return 'distracted';
    }
    
    // Calculate distraction percentage
    const distractionPercentage = sessionDuration > 0 ? (totalDistractionTime / sessionDuration) * 100 : 0;
    
    if (distractionPercentage < 10) {
      return 'attentive';
    } else if (distractionPercentage < 25) {
      return 'semi-attentive';
    } else {
      return 'distracted';
    }
  };

  const handleStartStudying = (courseId: string, materialId: string) => {
    const now = new Date();
    setStartTime(now);
    setSessionTime(0);
    setDistractionLog([]);
    setLastDistractionStart(null);
    onToggleStudying(true);
    
    const session = {
      id: Date.now(),
      courseId,
      materialId,
      startTime: now,
      isActive: true
    };
    onSessionChange(session);

    toast({
      title: "Study Session Started! 🚀",
      description: "Focus tracking is active. Stay on task!",
    });
  };

  const handleStopStudying = () => {
    try {
      if (!currentSession || !startTime) return;

      const totalDistractionTime = distractionLog.reduce((total, distraction) => {
        return total + (distraction.duration || 0);
      }, 0);

      const mlMetrics = mlDataCollection.getCurrentMetrics();
      
      const sessionData = {
        courseId: currentSession.courseId,
        materialId: currentSession.materialId,
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
        duration: sessionTime,
        distractions: distractionLog.length,
        totalDistractionTime,
        focusLevel: predictFocusLevel(sessionTime, totalDistractionTime),
        distractionDetails: distractionLog.map(d => ({
          ...d,
          timeFromStart: d.timestamp - startTime.getTime()
        })),
        // Enhanced metrics for ML analysis
        keystrokeRate: mlMetrics.keystrokes,
        mouseMovements: mlMetrics.mouseMovements,
        scrollActivity: mlMetrics.scrolls,
        tabSwitches: mlMetrics.tabSwitches,
        inactivityPeriods: mlMetrics.inactivityPeriods
      };

      // Save to localStorage
      const existingLogs = JSON.parse(localStorage.getItem('studyLogs') || '[]');
      existingLogs.push(sessionData);
      localStorage.setItem('studyLogs', JSON.stringify(existingLogs));

      // Update total studied time
      if (onStudyTimeUpdate) {
        const today = new Date().toDateString();
        const currentStudied = parseInt(localStorage.getItem(`studiedToday_${today}`) || '0');
        const newTotal = currentStudied + Math.floor(sessionTime / 60);
        onStudyTimeUpdate(newTotal);
      }

      // Collect ML data
      mlDataCollection.endSession(sessionData.focusLevel);

      // Show rating popup
      setShowRatingPopup(true);
    } catch (error) {
      console.error('Error stopping study session:', error);
      toast({
        title: "Session Error",
        description: "There was an issue saving your session. Please try again.",
        variant: "destructive",
      });
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
    
    // Clear localStorage
    localStorage.removeItem('currentSessionTime');
    localStorage.removeItem('currentSessionStart');
    localStorage.removeItem('currentDistractionLog');
    localStorage.removeItem('lastDistractionStart');
  };

  const handleGoToLogs = () => {
    setShowRatingPopup(false);
    setSessionTime(0);
    setStartTime(null);
    setDistractionLog([]);
    setLastDistractionStart(null);
    
    // Clear localStorage
    localStorage.removeItem('currentSessionTime');
    localStorage.removeItem('currentSessionStart');
    localStorage.removeItem('currentDistractionLog');
    localStorage.removeItem('lastDistractionStart');
    
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
      <CourseManager 
        isStudying={isStudying} 
        onStartStudying={handleStartStudying}
        selectedCourse={currentSession?.courseId}
        selectedMaterial={currentSession?.materialId}
      />

      {/* Real-time Focus Score Overlay */}
      <FocusScoreOverlay
        sessionTime={sessionTime}
        distractionCount={distractionLog.length}
        totalDistractionTime={distractionLog.reduce((total, d) => total + (d.duration || 0), 0)}
        isVisible={isStudying}
        keystrokeRate={mlDataCollection.getCurrentMetrics().keystrokes}
        mouseMovements={mlDataCollection.getCurrentMetrics().mouseMovements}
        scrollActivity={mlDataCollection.getCurrentMetrics().scrolls}
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
        totalDistractionTime={distractionLog.reduce((total, d) => total + (d.duration || 0), 0)}
        distractionLog={distractionLog.map(d => ({
          ...d,
          timeFromStart: startTime ? d.timestamp - startTime.getTime() : 0
        }))}
        predictedRating={predictFocusLevel(
          sessionTime,
          distractionLog.reduce((total, d) => total + (d.duration || 0), 0)
        )}
        onBackToUnits={handleBackToUnits}
        onGoToLogs={handleGoToLogs}
      />
    </div>
  );
};