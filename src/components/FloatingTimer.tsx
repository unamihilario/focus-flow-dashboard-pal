
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Square, AlertTriangle } from "lucide-react";

interface FloatingTimerProps {
  sessionTime: number;
  isVisible: boolean;
  distractionCount: number;
  onStop: () => void;
}

export const FloatingTimer: React.FC<FloatingTimerProps> = ({
  sessionTime,
  isVisible,
  distractionCount,
  onStop
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Card className="bg-white shadow-2xl border-2 border-blue-200 min-w-[200px]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Study Timer</span>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          
          <div className="text-2xl font-mono font-bold text-gray-900 mb-2">
            {formatTime(sessionTime)}
          </div>

          {distractionCount > 0 && (
            <div className="flex items-center space-x-1 text-xs text-orange-600 mb-2">
              <AlertTriangle className="w-3 h-3" />
              <span>{distractionCount} distractions</span>
            </div>
          )}

          <Button
            onClick={onStop}
            variant="destructive"
            size="sm"
            className="w-full"
          >
            <Square className="w-3 h-3 mr-1" />
            Stop
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
