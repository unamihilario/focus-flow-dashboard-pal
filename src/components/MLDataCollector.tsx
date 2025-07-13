
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Activity, Eye, Mouse, Keyboard, Timer, AlertTriangle } from "lucide-react";

interface MLDataCollectorProps {
  isStudying: boolean;
  currentMetrics: {
    tabSwitches: number;
    keystrokes: number;
    mouseMovements: number;
    scrolls: number;
    inactivityPeriods: number;
  };
  sessionCount: number;
}

export const MLDataCollector: React.FC<MLDataCollectorProps> = ({
  isStudying,
  currentMetrics,
  sessionCount
}) => {
  return (
    <div className="space-y-4">
      {/* Real-time Metrics */}
      {isStudying && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center text-blue-900">
              <Brain className="w-5 h-5 mr-2" />
              ML Data Collection - Live Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-orange-500" />
                <span>Tab switches: <strong>{currentMetrics.tabSwitches}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Keyboard className="w-4 h-4 text-green-500" />
                <span>Keystrokes: <strong>{currentMetrics.keystrokes}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Mouse className="w-4 h-4 text-blue-500" />
                <span>Mouse moves: <strong>{currentMetrics.mouseMovements}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-500" />
                <span>Scrolls: <strong>{currentMetrics.scrolls}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-red-500" />
                <span>Inactivity periods: <strong>{currentMetrics.inactivityPeriods}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Sessions recorded: <strong>{sessionCount}</strong></span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dataset Info */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-green-900">
            <Brain className="w-5 h-5 mr-2" />
            ML Dataset Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-green-700">
            <p>Your focus level is automatically rated based on interaction patterns and distractions detected during study sessions.</p>
          </div>

          <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
            <strong>How it works:</strong> Study multiple sessions to build your dataset. The system automatically rates your focus and you can export the CSV dataset for ML model training!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
