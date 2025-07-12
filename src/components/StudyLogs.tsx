
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const StudyLogs = () => {
  const { toast } = useToast();
  const [timeFilter, setTimeFilter] = useState("week");
  
  // Mock study log data - in a real app, this would come from your database
  const studyLogs = [
    { id: 1, date: "2025-01-12", subject: "Mathematics", duration: 45, focusScore: 92, startTime: "14:30", endTime: "15:15" },
    { id: 2, date: "2025-01-12", subject: "Physics", duration: 30, focusScore: 87, startTime: "16:00", endTime: "16:30" },
    { id: 3, date: "2025-01-11", subject: "Chemistry", duration: 60, focusScore: 95, startTime: "10:00", endTime: "11:00" },
    { id: 4, date: "2025-01-11", subject: "Mathematics", duration: 90, focusScore: 88, startTime: "19:00", endTime: "20:30" },
    { id: 5, date: "2025-01-10", subject: "Biology", duration: 25, focusScore: 78, startTime: "15:15", endTime: "15:40" },
    { id: 6, date: "2025-01-10", subject: "Physics", duration: 50, focusScore: 91, startTime: "20:00", endTime: "20:50" },
    { id: 7, date: "2025-01-09", subject: "Mathematics", duration: 75, focusScore: 89, startTime: "09:30", endTime: "10:45" },
    { id: 8, date: "2025-01-08", subject: "Chemistry", duration: 40, focusScore: 85, startTime: "14:00", endTime: "14:40" },
  ];

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
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
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
      });
      return;
    }

    // Create CSV content
    const headers = ["Date", "Subject", "Duration (min)", "Focus Score (%)", "Start Time", "End Time"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => [
        log.date,
        log.subject,
        log.duration,
        log.focusScore,
        log.startTime,
        log.endTime
      ].join(","))
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `study-logs-${timeFilter}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful! 📊",
      description: `Downloaded ${filteredLogs.length} study sessions as CSV file.`,
    });
  };

  const filteredLogs = getFilteredLogs();
  const totalTime = filteredLogs.reduce((sum, log) => sum + log.duration, 0);
  const avgFocusScore = filteredLogs.length > 0 
    ? Math.round(filteredLogs.reduce((sum, log) => sum + log.focusScore, 0) / filteredLogs.length)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Logs</h2>
          <p className="text-gray-600">View and export your study session history</p>
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
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={downloadCSV} className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-600">Sessions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{filteredLogs.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Total Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatDuration(totalTime)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Avg Focus</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgFocusScore}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Study Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-orange-500" />
            Study Sessions ({timeFilter})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No study sessions found for the selected period</p>
              <p className="text-sm text-gray-500">Start tracking your study time to see logs here!</p>
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
                    <TableHead>Time</TableHead>
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
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          {log.subject}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDuration(log.duration)}</TableCell>
                      <TableCell>
                        <Badge className={getFocusScoreBadge(log.focusScore)}>
                          {log.focusScore}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {log.startTime} - {log.endTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
