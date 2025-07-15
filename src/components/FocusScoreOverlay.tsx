import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff } from "lucide-react";

interface FocusScoreOverlayProps {
  sessionTime: number;
  distractionCount: number;
  totalDistractionTime: number;
  isVisible: boolean;
  keystrokeRate: number;
  mouseMovements: number;
  scrollActivity: number;
}

export const FocusScoreOverlay: React.FC<FocusScoreOverlayProps> = ({
  sessionTime,
  distractionCount,
  totalDistractionTime,
  isVisible,
  keystrokeRate,
  mouseMovements,
  scrollActivity
}) => {
  const [focusScore, setFocusScore] = useState(100);
  const [focusColor, setFocusColor] = useState("bg-green-500");

  useEffect(() => {
    if (sessionTime < 60) return; // Don't calculate for first minute

    // Calculate focus score based on multiple factors
    const sessionMinutes = sessionTime / 60;
    const distractionPercentage = sessionTime > 0 ? (totalDistractionTime / sessionTime) * 100 : 0;
    
    // Base score starts at 100
    let score = 100;
    
    // Penalize for distractions (0-40 points lost)
    score -= Math.min(40, distractionPercentage);
    
    // Penalize for too many tab switches (0-20 points lost)
    const tabSwitchPenalty = Math.min(20, (distractionCount / sessionMinutes) * 5);
    score -= tabSwitchPenalty;
    
    // Reward for consistent activity (keyboard + mouse + scroll)
    const activityScore = Math.min(20, (keystrokeRate + mouseMovements + scrollActivity) / 10);
    score += activityScore - 20; // Subtract 20 so this is bonus only
    
    // Ensure score is between 0-100
    score = Math.max(0, Math.min(100, score));
    
    setFocusScore(Math.round(score));
    
    // Set color based on score
    if (score >= 80) {
      setFocusColor("bg-green-500");
    } else if (score >= 60) {
      setFocusColor("bg-yellow-500");
    } else if (score >= 40) {
      setFocusColor("bg-orange-500");
    } else {
      setFocusColor("bg-red-500");
    }
  }, [sessionTime, distractionCount, totalDistractionTime, keystrokeRate, mouseMovements, scrollActivity]);

  const getFocusText = () => {
    if (focusScore >= 90) return "Excellent focus! 🎯";
    if (focusScore >= 80) return "Great focus! 👍";
    if (focusScore >= 70) return "Good focus 📚";
    if (focusScore >= 60) return "Moderate focus ⚠️";
    if (focusScore >= 40) return "Low focus 😕";
    return "Very distracted 🚨";
  };

  if (!isVisible || sessionTime < 60) return null;

  return (
    <div className="fixed top-4 right-4 z-30">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-2 border-blue-200 min-w-[200px]">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Focus Level</span>
            </div>
            <span className="text-lg font-bold text-gray-900">{focusScore}%</span>
          </div>
          
          <Progress value={focusScore} className="mb-2 h-2" />
          
          <p className="text-xs text-gray-600 text-center">
            {getFocusText()}
          </p>
          
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Distractions:</span>
              <span>{distractionCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Activity:</span>
              <span>{keystrokeRate + mouseMovements + scrollActivity}/min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};