
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, Trophy, Target, AlertTriangle } from "lucide-react";

interface SessionRatingPopupProps {
  isVisible: boolean;
  sessionTime: number;
  distractionCount: number;
  totalDistractionTime: number;
  distractionLog: Array<{
    type: 'tab_switch' | 'navigation' | 'internal_navigation';
    timestamp: number;
    duration?: number;
  }>;
  predictedRating: 'attentive' | 'semi-attentive' | 'distracted';
  onBackToUnits: () => void;
  onGoToLogs: () => void;
}

export const SessionRatingPopup: React.FC<SessionRatingPopupProps> = ({
  isVisible,
  sessionTime,
  distractionCount,
  totalDistractionTime,
  distractionLog,
  predictedRating,
  onBackToUnits,
  onGoToLogs
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getRatingInfo = (rating: string) => {
    switch (rating) {
      case 'attentive':
        return { 
          icon: Trophy, 
          color: 'bg-green-100 text-green-700', 
          title: 'Great Focus!', 
          description: 'You stayed focused with minimal distractions' 
        };
      case 'semi-attentive':
        return { 
          icon: Target, 
          color: 'bg-yellow-100 text-yellow-700', 
          title: 'Good Session', 
          description: 'Mostly focused with some wandering' 
        };
      case 'distracted':
        return { 
          icon: AlertTriangle, 
          color: 'bg-red-100 text-red-700', 
          title: 'Room for Improvement', 
          description: 'Many distractions detected' 
        };
      default:
        return { 
          icon: Target, 
          color: 'bg-gray-100 text-gray-700', 
          title: 'Session Complete', 
          description: '' 
        };
    }
  };

  if (!isVisible) return null;

  const ratingInfo = getRatingInfo(predictedRating);
  const RatingIcon = ratingInfo.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white max-w-md w-full">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <RatingIcon className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            {ratingInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <Badge className={ratingInfo.color} variant="secondary">
              {predictedRating}
            </Badge>
            <p className="text-gray-600">{ratingInfo.description}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Study Time:</span>
                <span className="font-medium">{formatTime(sessionTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Distractions:</span>
                <span className="font-medium">{distractionCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Distraction Time:</span>
                <span className="font-medium">{formatTime(totalDistractionTime)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Focus Percentage:</span>
                <span className="font-medium">
                  {sessionTime > 0 ? Math.round(((sessionTime - totalDistractionTime) / sessionTime) * 100) : 0}%
                </span>
              </div>
            </div>
            
            {distractionLog.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Distraction Details:</p>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {distractionLog.map((distraction, index) => (
                    <div key={index} className="text-xs text-gray-600 flex justify-between">
                      <span>
                        {distraction.type === 'tab_switch' ? '🔄 Tab Switch' : 
                         distraction.type === 'internal_navigation' ? '📱 Page Switch' : '🔗 Navigation'}
                      </span>
                      <span>{distraction.duration ? formatTime(distraction.duration / 1000) : '-'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onBackToUnits}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Units
            </Button>
            <Button
              onClick={onGoToLogs}
              className="flex-1"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
