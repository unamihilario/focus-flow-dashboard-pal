
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface SpacedLearningConfig {
  studyDuration: number; // minutes
  shortBreak: number; // minutes
  longBreak: number; // minutes
  sessionsBeforeLongBreak: number;
}

export const useSpacedLearning = () => {
  const [sessionCount, setSessionCount] = useState(0);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [breakDuration, setBreakDuration] = useState(0);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const { toast } = useToast();

  const config: SpacedLearningConfig = {
    studyDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsBeforeLongBreak: 4
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBreakTime && breakTimeLeft > 0) {
      interval = setInterval(() => {
        setBreakTimeLeft(prev => {
          if (prev <= 1) {
            setIsBreakTime(false);
            toast({
              title: "Break's over! 🎯",
              description: "Time to get back to studying. Let's maintain that momentum!",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreakTime, breakTimeLeft, toast]);

  const startBreak = () => {
    const isLongBreak = (sessionCount + 1) % config.sessionsBeforeLongBreak === 0;
    const duration = isLongBreak ? config.longBreak : config.shortBreak;
    
    setSessionCount(prev => prev + 1);
    setIsBreakTime(true);
    setBreakDuration(duration);
    setBreakTimeLeft(duration * 60); // convert to seconds

    toast({
      title: isLongBreak ? "Long break time! 🌟" : "Short break time! ☕",
      description: `Take a ${duration} minute ${isLongBreak ? 'long' : 'short'} break. You've earned it!`,
    });
  };

  const skipBreak = () => {
    setIsBreakTime(false);
    setBreakTimeLeft(0);
    toast({
      title: "Break skipped 💪",
      description: "Ready to keep the momentum going!",
    });
  };

  const getNextBreakType = () => {
    return (sessionCount + 1) % config.sessionsBeforeLongBreak === 0 ? 'long' : 'short';
  };

  const formatBreakTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    sessionCount,
    isBreakTime,
    breakTimeLeft,
    breakDuration,
    startBreak,
    skipBreak,
    getNextBreakType,
    formatBreakTime,
    config
  };
};
