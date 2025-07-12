
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, Clock, Target, Award, Zap } from "lucide-react";

const chartConfig = {
  mathematics: {
    label: "Mathematics",
    color: "hsl(var(--chart-1))",
  },
  physics: {
    label: "Physics", 
    color: "hsl(var(--chart-2))",
  },
  chemistry: {
    label: "Chemistry",
    color: "hsl(var(--chart-3))",
  },
  biology: {
    label: "Biology",
    color: "hsl(var(--chart-4))",
  },
};

export const ProgressDashboard = () => {
  // Mock data for charts
  const weeklyData = [
    { day: "Mon", mathematics: 45, physics: 30, chemistry: 25, biology: 20 },
    { day: "Tue", mathematics: 60, physics: 40, chemistry: 35, biology: 15 },
    { day: "Wed", mathematics: 35, physics: 50, chemistry: 20, biology: 30 },
    { day: "Thu", mathematics: 80, physics: 25, chemistry: 45, biology: 25 },
    { day: "Fri", mathematics: 55, physics: 45, chemistry: 30, biology: 40 },
    { day: "Sat", mathematics: 90, physics: 60, chemistry: 50, biology: 35 },
    { day: "Sun", mathematics: 40, physics: 35, chemistry: 25, biology: 20 },
  ];

  const subjectDistribution = [
    { name: "Mathematics", value: 35, color: "#3b82f6" },
    { name: "Physics", value: 25, color: "#8b5cf6" },
    { name: "Chemistry", value: 22, color: "#10b981" },
    { name: "Biology", value: 18, color: "#06d6a0" }
  ];

  const focusData = [
    { time: "9:00", focus: 85 },
    { time: "10:00", focus: 92 },
    { time: "11:00", focus: 78 },
    { time: "12:00", focus: 65 },
    { time: "13:00", focus: 45 },
    { time: "14:00", focus: 70 },
    { time: "15:00", focus: 88 },
    { time: "16:00", focus: 95 },
    { time: "17:00", focus: 82 },
  ];

  const stats = [
    {
      title: "Total Study Time",
      value: "47.2h",
      change: "+2.3h",
      trend: "up",
      icon: Clock,
      color: "text-blue-600 bg-blue-100"
    },
    {
      title: "Focus Score",
      value: "87%",
      change: "+5%",
      trend: "up", 
      icon: Target,
      color: "text-green-600 bg-green-100"
    },
    {
      title: "Study Streak",
      value: "12 days",
      change: "+3 days",
      trend: "up",
      icon: Award,
      color: "text-orange-600 bg-orange-100"
    },
    {
      title: "Avg Session",
      value: "78 min",
      change: "-5 min",
      trend: "down",
      icon: Zap,
      color: "text-purple-600 bg-purple-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Your study performance insights</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Weekly Study Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="mathematics" stackId="a" fill="var(--color-mathematics)" />
                  <Bar dataKey="physics" stackId="a" fill="var(--color-physics)" />
                  <Bar dataKey="chemistry" stackId="a" fill="var(--color-chemistry)" />
                  <Bar dataKey="biology" stackId="a" fill="var(--color-biology)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-500" />
              Time by Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {subjectDistribution.map((subject, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="text-sm text-gray-600">{subject.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {subject.value}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Focus Score Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-orange-500" />
              Daily Focus Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={focusData}>
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="focus" 
                    stroke="#f97316" 
                    fill="url(#colorGradient)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-orange-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">📊 Weekly Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Peak Performance</p>
                <p className="text-sm text-gray-600">You focus best between 3-4 PM with 95% efficiency</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-gray-900">Improvement Area</p>
                <p className="text-sm text-gray-600">Consider shorter sessions for Chemistry (avg 45min)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
