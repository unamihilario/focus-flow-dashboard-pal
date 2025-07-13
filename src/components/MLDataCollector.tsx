
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Download, Activity, Eye, Mouse, Keyboard, Timer, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  onEndSession: (focusLevel?: 'attentive' | 'semi-attentive' | 'distracted') => void;
  onExportData: () => void;
}

export const MLDataCollector: React.FC<MLDataCollectorProps> = ({
  isStudying,
  currentMetrics,
  sessionCount,
  onEndSession,
  onExportData
}) => {
  const [manualFocusLevel, setManualFocusLevel] = useState<string>('');
  const { toast } = useToast();

  const handleEndWithRating = () => {
    if (manualFocusLevel) {
      onEndSession(manualFocusLevel as 'attentive' | 'semi-attentive' | 'distracted');
      setManualFocusLevel('');
      toast({
        title: "Session data recorded! 📊",
        description: "Your study session has been added to the ML dataset.",
      });
    }
  };

  const handleExport = () => {
    onExportData();
    toast({
      title: "Dataset exported! 📁",
      description: "CSV file downloaded for your ML project submission.",
    });
  };

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

      {/* Focus Level Rating */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-green-900">
            <Brain className="w-5 h-5 mr-2" />
            ML Dataset Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-green-700">
            <p>Rate your focus level after each session to build labeled training data:</p>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-green-800">How focused were you?</label>
            <Select value={manualFocusLevel} onValueChange={setManualFocusLevel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Rate your focus level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attentive">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-500 text-white">Attentive</Badge>
                    <span className="text-sm">Fully focused, minimal distractions</span>
                  </div>
                </SelectItem>
                <SelectItem value="semi-attentive">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-yellow-500 text-white">Semi-Attentive</Badge>
                    <span className="text-sm">Mostly focused, some wandering</span>
                  </div>
                </SelectItem>
                <SelectItem value="distracted">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-red-500 text-white">Distracted</Badge>
                    <span className="text-sm">Hard to focus, many interruptions</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleEndWithRating}
              disabled={!manualFocusLevel || !isStudying}
              className="flex-1"
            >
              Record Session Data
            </Button>
            <Button 
              onClick={handleExport}
              variant="outline"
              disabled={sessionCount === 0}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Dataset
            </Button>
          </div>

          <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
            <strong>For your submission:</strong> Study multiple sessions, rate your focus, then export the CSV dataset for your ML model training!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
