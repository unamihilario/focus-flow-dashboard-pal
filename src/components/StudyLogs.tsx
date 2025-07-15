import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar, Filter, Database, Eye, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MLDataCollector } from "@/components/MLDataCollector";
import { PythonAnalysisGuide } from "@/components/PythonAnalysisGuide";
import { useMLDataCollection } from "@/hooks/useMLDataCollection";

interface StudySession {
  id: string;
  date: string;
  subject: string;
  duration: number;
  focusScore: number;
  startTime: string;
  endTime: string;
  tabSwitches: number;
  distractions: number;
  keystrokeRate: number;
  mouseMovements: number;
  inactivityPeriods: number;
  scrollActivity: number;
}

export const StudyLogs = () => {
  const { toast } = useToast();
  const [timeFilter, setTimeFilter] = useState("week");
  const [studyLogs, setStudyLogs] = useState<StudySession[]>([]);
  
  // ML Data Collection hook for export functionality
  const mlDataCollection = useMLDataCollection(false, "AI/ML Course");

  // Load study logs from localStorage on component mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('studyLogs');
    if (savedLogs) {
      setStudyLogs(JSON.parse(savedLogs));
    } else {
      // Initialize with some sample data for demo purposes
      const sampleLogs: StudySession[] = [
        { 
          id: "session_1737633600000", 
          date: "2025-01-12", 
          subject: "Machine Learning Fundamentals", 
          duration: 85, 
          focusScore: 92, 
          startTime: "14:30", 
          endTime: "15:55",
          tabSwitches: 3,
          distractions: 2,
          keystrokeRate: 45,
          mouseMovements: 234,
          inactivityPeriods: 1,
          scrollActivity: 78
        },
        { 
          id: "session_1737547200000", 
          date: "2025-01-11", 
          subject: "Linear Algebra for CS", 
          duration: 65, 
          focusScore: 87, 
          startTime: "16:00", 
          endTime: "17:05",
          tabSwitches: 5,
          distractions: 4,
          keystrokeRate: 38,
          mouseMovements: 187,
          inactivityPeriods: 2,
          scrollActivity: 56
        },
        { 
          id: "session_1737460800000", 
          date: "2025-01-10", 
          subject: "Python for Data Science", 
          duration: 120, 
          focusScore: 95, 
          startTime: "10:00", 
          endTime: "12:00",
          tabSwitches: 2,
          distractions: 1,
          keystrokeRate: 62,
          mouseMovements: 412,
          inactivityPeriods: 0,
          scrollActivity: 145
        },
      ];
      setStudyLogs(sampleLogs);
      localStorage.setItem('studyLogs', JSON.stringify(sampleLogs));
    }
  }, []);

  const getFilteredLogs = () => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeFilter) {
      case "week":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return studyLogs;
    }
    
    return studyLogs.filter(log => new Date(log.date) >= cutoffDate);
  };

  const downloadCSV = () => {
    const filteredLogs = getFilteredLogs();
    
    if (filteredLogs.length === 0) {
      toast({
        title: "No data to export",
        description: `No study sessions found for the selected ${timeFilter} period.`,
        variant: "destructive"
      });
      return;
    }

    // Enhanced CSV headers for ML project
    const headers = [
      "session_id", "date", "subject", "duration_minutes", "focus_score", 
      "start_time", "end_time", "tab_switches", "distractions", 
      "keystroke_rate", "mouse_movements", "inactivity_periods", "scroll_activity"
    ];
    
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => [
        log.id,
        log.date,
        `"${log.subject}"`,
        log.duration,
        log.focusScore,
        log.startTime,
        log.endTime,
        log.tabSwitches,
        log.distractions,
        log.keystrokeRate,
        log.mouseMovements,
        log.inactivityPeriods,
        log.scrollActivity
      ].join(","))
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `study_logs_${timeFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "CSV Exported! 📊",
      description: `Downloaded ${filteredLogs.length} sessions as CSV file.`,
    });
  };

  const handleExportMLDataset = () => {
    const result = mlDataCollection.exportToCSV();
    if (result) {
      toast({
        title: "CSV Exported! 📊",
        description: "Dataset downloaded successfully.",
      });
    } else {
      toast({
        title: "No ML Data Available",
        description: "Complete some study sessions to generate dataset.",
        variant: "destructive"
      });
    }
  };

  const filteredLogs = getFilteredLogs();
  const totalTime = filteredLogs.reduce((sum, log) => sum + log.duration, 0);
  const avgFocusScore = filteredLogs.length > 0 
    ? Math.round(filteredLogs.reduce((sum, log) => sum + log.focusScore, 0) / filteredLogs.length)
    : 0;
  const totalDistractions = filteredLogs.reduce((sum, log) => sum + log.distractions, 0);
  const avgTabSwitches = filteredLogs.length > 0 
    ? Math.round(filteredLogs.reduce((sum, log) => sum + log.tabSwitches, 0) / filteredLogs.length)
    : 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getFocusScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-700";
    if (score >= 80) return "bg-blue-100 text-blue-700";
    if (score >= 70) return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <Tabs defaultValue="sessions" className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Analytics Dashboard</h2>
          <p className="text-gray-600">ML-powered study behavior analysis for CS Engineering students</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={downloadCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Dataset
          </Button>

          <Button 
            onClick={handleExportMLDataset}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            Export for Python
          </Button>
        </div>
      </div>

      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="sessions">Study Sessions</TabsTrigger>
        <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
        <TabsTrigger value="python">Python ML Guide</TabsTrigger>
      </TabsList>

      <TabsContent value="sessions" className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Study Sessions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{filteredLogs.length}</p>
            <p className="text-xs text-gray-500">Total recordings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Study Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatDuration(totalTime)}</p>
            <p className="text-xs text-gray-500">Total duration</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">Avg Focus</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgFocusScore}%</p>
            <p className="text-xs text-gray-500">ML-predicted</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Distractions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalDistractions}</p>
            <p className="text-xs text-gray-500">Total detected</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Study Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-500" />
            Study Sessions ({timeFilter})
            <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">
              Python/NumPy Ready
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No study sessions found for the selected period</p>
              <p className="text-sm text-gray-500">Complete study sessions to build your ML dataset!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Focus Score</TableHead>
                    <TableHead>Tab Switches</TableHead>
                    <TableHead>Distractions</TableHead>
                    <TableHead>Keystroke Rate</TableHead>
                    <TableHead>Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {new Date(log.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                          {log.subject}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDuration(log.duration)}</TableCell>
                      <TableCell>
                        <Badge className={getFocusScoreBadge(log.focusScore)}>
                          {log.focusScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm ${log.tabSwitches > 5 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          {log.tabSwitches}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm ${log.distractions > 3 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                          {log.distractions}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{log.keystrokeRate}/min</span>
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        M:{log.mouseMovements} S:{log.scrollActivity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        {/* ML Data Collection Display */}
        <MLDataCollector 
          isStudying={false}
          currentMetrics={mlDataCollection.getCurrentMetrics()}
          sessionCount={filteredLogs.length}
        />
        
        {/* Add more analytics here */}
      </TabsContent>

      <TabsContent value="python" className="space-y-6">
        <PythonAnalysisGuide 
          onExportDataset={mlDataCollection.exportToCSV}
          sessionCount={mlDataCollection.sessionData.length}
        />
      </TabsContent>
    </Tabs>
  );
};
