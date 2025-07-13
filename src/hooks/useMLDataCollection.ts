
import { useState, useEffect, useRef } from 'react';

interface MLDataPoint {
  session_id: string;
  timestamp: string;
  active_tab_switches: number;
  keystroke_rate: number;
  mouse_movements: number;
  session_duration: number;
  inactivity_periods: number;
  scroll_activity: number;
  focus_level: 'attentive' | 'semi-attentive' | 'distracted';
  subject: string;
}

export const useMLDataCollection = (isStudying: boolean, subject: string) => {
  const [sessionData, setSessionData] = useState<MLDataPoint[]>([]);
  const [currentSession, setCurrentSession] = useState<Partial<MLDataPoint> | null>(null);
  
  // Tracking variables
  const tabSwitchCount = useRef(0);
  const keystrokeCount = useRef(0);
  const mouseMovementCount = useRef(0);
  const scrollCount = useRef(0);
  const inactivityStart = useRef<number | null>(null);
  const inactivityPeriods = useRef(0);
  const sessionStart = useRef<Date | null>(null);
  const lastActivity = useRef(Date.now());

  // Initialize session when studying starts
  useEffect(() => {
    if (isStudying && !currentSession) {
      const sessionId = `session_${Date.now()}`;
      sessionStart.current = new Date();
      setCurrentSession({
        session_id: sessionId,
        timestamp: new Date().toISOString(),
        subject: subject,
        active_tab_switches: 0,
        keystroke_rate: 0,
        mouse_movements: 0,
        session_duration: 0,
        inactivity_periods: 0,
        scroll_activity: 0,
      });
      
      // Reset counters
      tabSwitchCount.current = 0;
      keystrokeCount.current = 0;
      mouseMovementCount.current = 0;
      scrollCount.current = 0;
      inactivityPeriods.current = 0;
      lastActivity.current = Date.now();
    }
  }, [isStudying, subject, currentSession]);

  // Track tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isStudying && document.hidden) {
        tabSwitchCount.current++;
      }
      lastActivity.current = Date.now();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isStudying]);

  // Track keyboard activity
  useEffect(() => {
    const handleKeyPress = () => {
      if (isStudying) {
        keystrokeCount.current++;
        lastActivity.current = Date.now();
        
        // Reset inactivity timer
        if (inactivityStart.current) {
          inactivityStart.current = null;
        }
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [isStudying]);

  // Track mouse activity
  useEffect(() => {
    const handleMouseMove = () => {
      if (isStudying) {
        mouseMovementCount.current++;
        lastActivity.current = Date.now();
        
        // Reset inactivity timer
        if (inactivityStart.current) {
          inactivityStart.current = null;
        }
      }
    };

    const handleScroll = () => {
      if (isStudying) {
        scrollCount.current++;
        lastActivity.current = Date.now();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isStudying]);

  // Track inactivity periods
  useEffect(() => {
    if (!isStudying) return;

    const inactivityInterval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity.current;
      
      // If inactive for more than 30 seconds
      if (timeSinceLastActivity > 30000) {
        if (!inactivityStart.current) {
          inactivityStart.current = Date.now();
          inactivityPeriods.current++;
        }
      }
    }, 5000);

    return () => clearInterval(inactivityInterval);
  }, [isStudying]);

  // Auto-predict focus level based on activity
  const predictFocusLevel = (
    tabSwitches: number,
    keystrokeRate: number,
    inactivity: number,
    sessionDuration: number
  ): 'attentive' | 'semi-attentive' | 'distracted' => {
    const distractionScore = 
      (tabSwitches > 5 ? 2 : 0) +
      (keystrokeRate < 2 ? 1 : 0) +
      (inactivity > 3 ? 2 : 0) +
      (sessionDuration > 0 && keystrokeRate / sessionDuration < 0.1 ? 1 : 0);

    if (distractionScore >= 4) return 'distracted';
    if (distractionScore >= 2) return 'semi-attentive';
    return 'attentive';
  };

  // End session and save data
  const endSession = (manualFocusLevel?: 'attentive' | 'semi-attentive' | 'distracted') => {
    if (!currentSession || !sessionStart.current) return;

    const sessionDuration = Math.floor((Date.now() - sessionStart.current.getTime()) / 1000 / 60); // minutes
    const keystrokeRate = Math.floor(keystrokeCount.current / Math.max(sessionDuration, 1));
    
    const focusLevel = manualFocusLevel || predictFocusLevel(
      tabSwitchCount.current,
      keystrokeRate,
      inactivityPeriods.current,
      sessionDuration
    );

    const completedSession: MLDataPoint = {
      ...currentSession as MLDataPoint,
      active_tab_switches: tabSwitchCount.current,
      keystroke_rate: keystrokeRate,
      mouse_movements: mouseMovementCount.current,
      session_duration: sessionDuration,
      inactivity_periods: inactivityPeriods.current,
      scroll_activity: scrollCount.current,
      focus_level: focusLevel,
    };

    setSessionData(prev => [...prev, completedSession]);
    setCurrentSession(null);
    return completedSession;
  };

  // Export data as CSV
  const exportToCSV = () => {
    if (sessionData.length === 0) return null;

    const headers = [
      'session_id',
      'timestamp', 
      'subject',
      'active_tab_switches',
      'keystroke_rate', 
      'mouse_movements',
      'session_duration',
      'inactivity_periods',
      'scroll_activity',
      'focus_level'
    ];

    const csvContent = [
      headers.join(','),
      ...sessionData.map(row => [
        row.session_id,
        row.timestamp,
        row.subject,
        row.active_tab_switches,
        row.keystroke_rate,
        row.mouse_movements,
        row.session_duration,
        row.inactivity_periods,
        row.scroll_activity,
        row.focus_level
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ml_dataset_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    sessionData,
    currentSession,
    endSession,
    exportToCSV,
    getCurrentMetrics: () => ({
      tabSwitches: tabSwitchCount.current,
      keystrokes: keystrokeCount.current,
      mouseMovements: mouseMovementCount.current,
      scrolls: scrollCount.current,
      inactivityPeriods: inactivityPeriods.current,
    }),
  };
};
