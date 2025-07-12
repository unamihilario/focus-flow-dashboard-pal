
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Square, BookOpen, Clock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyTimerProps {
  isStudying: boolean;
  onToggleStudying: (studying: boolean) => void;
  currentSession: any;
  onSessionChange: (session: any) => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  isStudying,
  onToggleStudying,
  currentSession,
  onSessionChange
}) => {
  const [selectedSubject, setSelectedSubject] = useState("mathematics");
  const [sessionTime, setSessionTime] = useState(0); // seconds
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const subjects = [
    { id: "mathematics", name: "Mathematics", color: "bg-blue-500", emoji: "📐" },
    { id: "physics", name: "Physics", color: "bg-purple-500", emoji: "⚛️" },
    { id: "chemistry", name: "Chemistry", color: "bg-green-500", emoji: "🧪" },
    { id: "biology", name: "Biology", color: "bg-emerald-500", emoji: "🧬" },
    { id: "history", name: "History", color: "bg-amber-500", emoji: "📚" },
    { id: "literature", name: "Literature", color: "bg-rose-500", emoji: "📖" },
    { id: "coding", name: "Programming", color: "bg-gray-700", emoji: "💻" }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudying && startTime) {
      interval = setInterval(() => {
        setSessionTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying, startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStudying = () => {
    const now = new Date();
    setStartTime(now);
    setSessionTime(0);
    onToggleStudying(true);
    
    const session = {
      id: Date.now(),
      subject: selectedSubject,
      startTime: now,
      isActive: true
    };
    onSessionChange(session);

    toast({
      title: "Study session started! 🚀",
      description: `Good luck with ${subjects.find(s => s.id === selectedSubject)?.name}!`,
    });
  };

  const handlePauseStudying = () => {
    onToggleStudying(false);
    toast({
      title: "Session paused ⏸️",
      description: "Take a breather, you're doing great!",
    });
  };

  const handleStopStudying = () => {
    if (currentSession && sessionTime > 60) { // Only log sessions longer than 1 minute
      toast({
        title: "Great work! 🎉",
        description: `You studied ${subjects.find(s => s.id === selectedSubject)?.name} for ${formatTime(sessionTime)}`,
      });
    }
    
    onToggleStudying(false);
    onSessionChange(null);
    setSessionTime(0);
    setStartTime(null);
  };

  const currentSubject = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="space-y-6">
      {/* Main Timer Card */}
      <Card className="bg-gradient-to-br from-white to-orange-50 border-2 border-orange-100 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
            <Clock className="w-6 h-6 mr-2 text-orange-500" />
            {isStudying ? "You're in the zone! 🔥" : "Ready to focus?"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subject Selection */}
          {!isStudying && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">What are you studying today?</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder="Choose your subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{subject.emoji}</span>
                        <span>{subject.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Current Subject Display */}
          {isStudying && currentSubject && (
            <div className="text-center space-y-2">
              <Badge className={`${currentSubject.color} text-white px-4 py-2 text-lg`}>
                {currentSubject.emoji} {currentSubject.name}
              </Badge>
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-mono font-bold text-gray-900 tracking-wider">
              {formatTime(sessionTime)}
            </div>
            
            {isStudying && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Active session</span>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            {!isStudying ? (
              <Button
                onClick={handleStartStudying}
                size="lg"
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Studying
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button
                  onClick={handlePauseStudying}
                  variant="outline"
                  size="lg"
                  className="px-6 py-3"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={handleStopStudying}
                  variant="destructive"
                  size="lg"
                  className="px-6 py-3"
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Session
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {!isStudying && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-gray-200 hover:border-orange-300">
            <CardContent className="text-center py-6">
              <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Quick Session</h3>
              <p className="text-sm text-gray-600">25 min Pomodoro</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-gray-200 hover:border-blue-300">
            <CardContent className="text-center py-6">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Deep Work</h3>
              <p className="text-sm text-gray-600">90 min focused</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-gray-200 hover:border-green-300">
            <CardContent className="text-center py-6">
              <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold text-gray-900">Custom</h3>
              <p className="text-sm text-gray-600">Set your own time</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
